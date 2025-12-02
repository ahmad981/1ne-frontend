import { apiRequest, normalizeTemplateParams } from './client'
import {
  AlignmentResponse,
  EquivalentStandardsResponse,
  FrameworkResponse,
  PagedResponse,
  StandardItemResponse,
  TemplateExecuteResponse,
  TemplateListParams,
  TemplateResponse,
} from './types'

export const fetchTemplates = (params: TemplateListParams, signal?: AbortSignal) => {
  return apiRequest<PagedResponse<TemplateResponse>>('/templates/list', {
    method: 'GET',
    query: normalizeTemplateParams(params),
    signal,
  })
}

export const fetchTemplateDetail = (slug: string, signal?: AbortSignal) => {
  return apiRequest<TemplateResponse>(`/templates/${slug}`, {
    method: 'GET',
    signal,
  })
}

export const fetchFrameworks = (signal?: AbortSignal) => {
  return apiRequest<FrameworkResponse[]>('/standards/frameworks', { method: 'GET', signal })
}

export const fetchStandardItems = (
  frameworkCode: string,
  filters?: { subject?: string; grade?: string },
  signal?: AbortSignal,
) => {
  return apiRequest<StandardItemResponse[]>(`/standards/${frameworkCode}/items`, {
    method: 'GET',
    query: {
      subject: filters?.subject,
      grade: filters?.grade,
    },
    signal,
  })
}

export const fetchEquivalentStandards = (standardCode: string, signal?: AbortSignal) => {
  return apiRequest<EquivalentStandardsResponse>(`/standards/equivalents/${standardCode}`, {
    method: 'GET',
    signal,
  })
}

export const alignTemplatesByGoal = (goal: string) => {
  return apiRequest<AlignmentResponse>('/agents/templates/align/by-goal', {
    method: 'POST',
    body: { goal },
  })
}

export const alignTemplatesByCode = (standardCode: string) => {
  return apiRequest<AlignmentResponse>('/agents/templates/align/by-code', {
    method: 'POST',
    body: { standardCode },
  })
}

export const executeTemplate = (slug: string, data: Record<string, unknown>, regenerate: number = 0) => {
  return apiRequest<TemplateExecuteResponse>(`/templates/${slug}/execute`, {
    method: 'POST',
    query: { regenerate },
    body: { data },
  })
}
