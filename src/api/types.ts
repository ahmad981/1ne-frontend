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
