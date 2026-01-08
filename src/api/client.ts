import { TemplateListParams } from './types'

// Default to IPv4 loopback to avoid IPv6 (::1) resolution issues on Windows
// when the backend is bound to 127.0.0.1. Users can override via VITE_API_URL.
const DEFAULT_BASE_URL = 'http://127.0.0.1:8000/api'
const API_BASE_URL = (import.meta.env.VITE_API_URL || DEFAULT_BASE_URL).replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  payload: unknown

  constructor(status: number, message: string, payload: unknown) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

interface RequestOptions extends RequestInit {
  query?: Record<string, string | number | boolean | undefined>
  body?: unknown
  timeout?: number // Timeout in milliseconds (default: 30000 = 30 seconds)
}

const toQueryString = (query?: Record<string, string | number | boolean | undefined>) => {
  const params = new URLSearchParams()
  if (!query) return params
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === null) return
    params.append(key, String(value))
  })
  return params
}

// Helper to get auth token from Redux persisted state (synced with store)
const getAuthToken = (): string | null => {
  try {
    const persistedState = localStorage.getItem('persist:root')
    if (persistedState) {
      const parsed = JSON.parse(persistedState)
      const authState = parsed?.auth ? JSON.parse(parsed.auth) : null
      return authState?.user?.token || null
    }
  } catch (error) {
    console.warn('[getAuthToken] Failed to parse persisted state:', error)
  }
  return null
}

const buildUrl = (path: string, query?: Record<string, string | number | boolean | undefined>): string => {
  const normalizedPath = path.startsWith('http') ? path : `${API_BASE_URL}/${path.replace(/^\//, '')}`
  const url = new URL(normalizedPath)
  const params = toQueryString(query)
  if ([...params.keys()].length > 0) {
    url.search = params.toString()
  }
  return url.toString()
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, body, headers, timeout = 30000, signal: providedSignal, ...rest } = options
  const url = buildUrl(path, query)

  console.log('[apiRequest] 🔵 Making request to:', url)
  console.log('[apiRequest] 🔵 Options:', { method: rest.method || 'GET', headers, timeout })

  // Create AbortController for timeout if not already provided
  const abortController = new AbortController()
  const timeoutId = setTimeout(() => {
    console.warn('[apiRequest] ⏰ Request timeout after', timeout, 'ms')
    abortController.abort()
  }, timeout)

  // Combine provided signal with timeout signal
  const combinedSignal = providedSignal 
    ? (() => {
        const combined = new AbortController()
        // If either signal aborts, abort the combined signal
        providedSignal.addEventListener('abort', () => combined.abort())
        abortController.signal.addEventListener('abort', () => combined.abort())
        return combined.signal
      })()
    : abortController.signal

  // Get auth token if available (for authenticated requests)
  const authToken = getAuthToken()
  
  // Build headers - automatically include Authorization if token exists
  // Custom headers passed in will override these defaults
  const requestHeaders: HeadersInit = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    ...headers, // Custom headers override defaults
  }

  try {
    const response = await fetch(url, {
      ...rest,
      signal: combinedSignal,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    
    // Clear timeout on successful response start
    clearTimeout(timeoutId)
    
    console.log('[apiRequest] 📥 Response status:', response.status, response.statusText)

    let payload: unknown = null
    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
      payload = await response.json()
    } else {
      payload = await response.text()
    }

    if (!response.ok) {
      // Handle 401 Unauthorized - token may be expired
      if (response.status === 401) {
        // Clear auth token from localStorage if present
        try {
          const persistedState = localStorage.getItem('persist:root')
          if (persistedState) {
            const parsed = JSON.parse(persistedState)
            if (parsed?.auth) {
              const authState = JSON.parse(parsed.auth)
              if (authState?.user?.token) {
                // Token is expired/invalid, clear it
                authState.user.token = null
                authState.user = null
                authState.isAuthenticated = false
                parsed.auth = JSON.stringify(authState)
                localStorage.setItem('persist:root', JSON.stringify(parsed))
                console.warn('[apiRequest] ⚠️ Token expired, cleared from storage')
              }
            }
          }
        } catch (error) {
          console.error('[apiRequest] Failed to clear expired token:', error)
        }
      }
      
      const message = typeof payload === 'object' && payload !== null && 'detail' in (payload as Record<string, unknown>)
        ? String((payload as Record<string, unknown>).detail)
        : response.statusText || 'Request failed'
      throw new ApiError(response.status, message, payload)
    }

    return payload as T
  } catch (error) {
    // Clear timeout in case of error
    clearTimeout(timeoutId)
    
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error
    }
    
    // Handle abort/timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      if (abortController.signal.aborted && !providedSignal?.aborted) {
        throw new Error(`Request timeout: The request took longer than ${timeout}ms to complete. The server may be slow or unreachable.`)
      }
      throw new Error('Request was cancelled')
    }
    
    // Handle network errors
    if (error instanceof TypeError) {
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        throw new Error(`Network error: Unable to reach server at ${url}. Please check if the backend is running on port 8000.`)
      }
      if (error.message.includes('network') || error.message.includes('connection')) {
        throw new Error(`Connection error: Cannot connect to server. Please verify the backend is running and accessible.`)
      }
    }
    
    // Re-throw other errors
    throw error
  }
}

export const normalizeTemplateParams = (params: TemplateListParams): Record<string, string | number> => {
  const query: Record<string, string | number> = {}
  if (params.q) query.q = params.q
  if (params.subject) query.subject = params.subject
  if (params.gradeBand) query.gradeBand = params.gradeBand
  if (params.bloom) query.bloom = params.bloom
  if (params.kind) query.kind = params.kind
  if (params.framework) query.framework = params.framework
  if (params.standardCode) query.standard_code = params.standardCode
  if (params.page) query.page = params.page
  if (params.pageSize) query.page_size = params.pageSize
  if (params.sort) query.sort = params.sort
  return query
}
