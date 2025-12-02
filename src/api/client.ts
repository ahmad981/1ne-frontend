import { TemplateListParams } from './types'

const DEFAULT_BASE_URL = 'http://localhost:8000/api'
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
  const { query, body, headers, ...rest } = options
  const url = buildUrl(path, query)

  const response = await fetch(url, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let payload: unknown = null
  const contentType = response.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    payload = await response.json()
  } else {
    payload = await response.text()
  }

  if (!response.ok) {
    const message = typeof payload === 'object' && payload !== null && 'detail' in (payload as Record<string, unknown>)
      ? String((payload as Record<string, unknown>).detail)
      : response.statusText || 'Request failed'
    throw new ApiError(response.status, message, payload)
  }

  return payload as T
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
