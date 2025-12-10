export type TemplateSort = 'title' | '-title' | 'created' | '-created'

export interface TemplateStandardRef {
  framework_code: string
  standard_code: string
  title: string
}

export interface TemplateResponse {
  id: string
  slug: string
  title: string
  description: string | null
  subject: string
  gradeBand: string
  bloom: string | null
  kind: string | null
  estimatedMinutes?: number | null
  popularity?: number | null
  tags?: string[]
  inputSchema?: Record<string, unknown> | null
  canonicalOutcome: string | null
  standards: TemplateStandardRef[]
  is_hot?: boolean
  is_favorite?: boolean
  execution_count?: number
  category?: string | null  // Template category for icon mapping
}

export interface PagedResponse<T> {
  total: number
  page: number
  pageSize: number
  items: T[]
}

export interface FrameworkResponse {
  code: string
  name: string
  jurisdiction?: string | null
  description?: string | null
}

export interface StandardItemResponse {
  code: string
  frameworkCode: string
  title: string
  description?: string | null
  subject: string
  gradeBand: string
  bloom?: string | null
  kind?: string | null
}

export interface EquivalentStandardsResponse {
  canonicalSlug: string
  canonicalTitle: string
  canonicalDescription?: string | null
  sourceStandard: StandardItemResponse
  equivalents: StandardItemResponse[]
}

export interface AlignmentEquivalentResponse {
  frameworkCode: string
  standardCode: string
  title: string
  subject?: string | null
  gradeBand?: string | null
}

export interface AlignmentResponse {
  canonicalSlug: string
  canonicalTitle?: string | null
  canonicalDescription?: string | null
  why: string
  equivalents: AlignmentEquivalentResponse[]
}

export interface TemplateListParams {
  q?: string
  subject?: string
  gradeBand?: string
  bloom?: string
  kind?: string
  framework?: string
  standardCode?: string
  page?: number
  pageSize?: number
  sort?: TemplateSort
  is_hot?: boolean
  is_favorite?: boolean
}

export interface TemplateExecuteRequest {
  data: Record<string, unknown>
}

export interface TemplateExecutionResult {
  preview: string
  data: Record<string, unknown>
  alignment?: AlignmentResponse | null
  professionalOutput?: Record<string, string> | null
}

export interface TemplateExecuteResponse {
  template: TemplateResponse
  result: TemplateExecutionResult
}

// Streaming Event Types
export interface StreamMetaEvent {
  type: 'meta'
  template_slug: string
  template_name: string
  timestamp: number
}

export interface StreamContentEvent {
  type: 'content'
  chunk: string
  template_slug: string
}

export interface StreamDoneEvent {
  type: 'done'
  execution_id: string
  template_slug: string
}

export interface StreamErrorEvent {
  type: 'error'
  message: string
  template_slug: string
}

export type StreamEvent = StreamMetaEvent | StreamContentEvent | StreamDoneEvent | StreamErrorEvent