/**
 * Centralized API Configuration
 * All API URLs should be imported from here
 */

// Railway Production Backend URL
const RAILWAY_BACKEND_URL = 'https://1nebackend-production.up.railway.app'

// Local Development Backend URL (match uvicorn --port, commonly 8001)
const LOCAL_BACKEND_URL = 'http://127.0.0.1:8001'

/**
 * Get the backend base URL from environment variables or use defaults
 * Priority: VITE_API_BASE_URL > VITE_API_URL (with /api removed) > Railway (default) > Localhost (only if VITE_USE_LOCAL=true)
 */
const getBackendBaseUrl = (): string => {
  // Check for VITE_API_BASE_URL first (for base URL without /api)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
  }
  
  // Check for VITE_API_URL (for URL with /api)
  if (import.meta.env.VITE_API_URL) {
    // Remove /api if present, we'll add it in API_URL
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '').replace(/\/$/, '')
  }
  
  // Default to Railway globally (unless explicitly set to use local)
  // Set VITE_USE_LOCAL=true in .env to use localhost
  if (import.meta.env.VITE_USE_LOCAL === 'true') {
    return LOCAL_BACKEND_URL
  }
  
  // Default to Railway URL
  return RAILWAY_BACKEND_URL
}

// Base URL (without /api) - for health checks and general use
export const API_BASE_URL = getBackendBaseUrl()

// API URL (with /api) - for API endpoints
export const API_URL = `${API_BASE_URL}/api`

// Health check URL
export const HEALTH_URL = `${API_BASE_URL}/health`

// Export for use in other files
export default {
  API_BASE_URL,
  API_URL,
  HEALTH_URL,
}
