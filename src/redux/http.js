// Library Imports
import axios from 'axios';

// Local Imports
import { baseURL } from './constant';
import { logoutUser } from './features/auth/authSlice';

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds timeout - signup can take longer due to multiple DB operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store reference for accessing auth token (set after store creation)
let storeRef = null;

// Function to set store reference (called from store.js after store creation)
export const setStoreReference = (store) => {
  storeRef = store;
};

// Request interceptor - auto-include auth token from Redux store
axiosInstance.interceptors.request.use(
  (config) => {
    // Get auth token from Redux store if available
    if (storeRef) {
      try {
        const state = storeRef.getState();
        const token = state?.auth?.user?.token;

        // Automatically include auth token if available
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        // Handle gracefully if state access fails
        console.warn('[Axios] Could not get auth token from store:', error);
      }
    }

    // Don't override Content-Type for FormData - let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const fullUrl = config.baseURL 
      ? `${config.baseURL}${config.url.startsWith('/') ? '' : '/'}${config.url}`
      : config.url;
    console.log(`[Axios] ${config.method?.toUpperCase()} ${fullUrl}`);
    console.log(`[Axios] Headers:`, {
      Authorization: config.headers.Authorization ? 'Bearer ***' : 'None',
      'Content-Type': config.headers['Content-Type'] || 'None',
    });
    return config;
  },
  (error) => {
    console.error('[Axios] Request error:', error);
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('Error from axios:', error);

    // Handle network/connection errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      const timeoutError = new Error(
        `Request timeout: The server took longer than ${axiosInstance.defaults.timeout}ms to respond. ` +
        `Please check if the backend is running and accessible at ${baseURL}`
      );
      timeoutError.name = 'TimeoutError';
      console.error('[Axios] ⏰ Request timeout:', timeoutError.message);
      return Promise.reject(timeoutError);
    }

    // Handle network errors (no response received)
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      const networkError = new Error(
        `Network error: Unable to connect to server at ${baseURL}. ` +
        `Please verify:\n1. Backend is running on port 8000\n2. CORS is properly configured\n3. No firewall blocking the connection`
      );
      networkError.name = 'NetworkError';
      console.error('[Axios] 🌐 Network error:', networkError.message);
      return Promise.reject(networkError);
    }

    // Handle connection refused errors
    if (error.code === 'ECONNREFUSED' || error.message?.includes('refused')) {
      const connectionError = new Error(
        `Connection refused: The server at ${baseURL} is not accepting connections. ` +
        `Please ensure the backend server is running.`
      );
      connectionError.name = 'ConnectionError';
      console.error('[Axios] 🔌 Connection refused:', connectionError.message);
      return Promise.reject(connectionError);
    }

    // Check for offline status
    if (!navigator.onLine) {
      const offlineError = new Error(
        'No internet connection: Please check your network connection and try again.'
      );
      offlineError.name = 'OfflineError';
      console.error('[Axios] 📴 Offline error:', offlineError.message);
      return Promise.reject(offlineError);
    }

    // Handle 401 Unauthorized - logout user (but NOT for password change errors)
    // Password change endpoint returns 401 for wrong password, which is a validation error, not auth error
    if (error?.response?.status === 401) {
      const requestUrl = error?.config?.url || '';
      
      // Don't logout on password change errors - these are validation errors, not auth errors
      if (requestUrl.includes('/change-password') || requestUrl.includes('/change_password')) {
        // Just reject the error, don't logout
        return Promise.reject(error);
      }
      
      try {
        // Use dynamic import with timeout protection to prevent hanging
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Store import timeout after 5 seconds')), 5000);
        });
        
        const storeModule = await Promise.race([
          import('./store'),
          timeoutPromise
        ]);
        
        // Clear timeout if import succeeded before timeout
        clearTimeout(timeoutId);
        
        const { store, persistor } = storeModule;
        const dispatch = store.dispatch;

        dispatch(logoutUser());
        persistor.purge();
      } catch (importError) {
        console.error('Failed to import store in error handler:', importError);
        // Continue execution - don't let import failure block error handling
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

