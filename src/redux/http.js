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

// Request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[Axios] ${config.method?.toUpperCase()} ${config.url}`);
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

    // Handle 401 Unauthorized - logout user
    if (error?.response?.status === 401) {
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

