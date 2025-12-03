import { apiRequest, normalizeTemplateParams } from './client'
// Removed TypeScript type imports - using plain JavaScript

export const fetchTemplates = (params, signal) => {
  return apiRequest('/templates/list', {
    method: 'GET',
    query: normalizeTemplateParams(params),
    signal,
  })
}

export const fetchTemplateDetail = (slug, signal) => {
  return apiRequest(`/templates/${slug}`, {
    method: 'GET',
    signal,
  })
}

export const fetchFrameworks = (signal) => {
  return apiRequest('/standards/frameworks', { method: 'GET', signal })
}

export const fetchStandardItems = (frameworkCode, filters, signal) => {
  return apiRequest(`/standards/${frameworkCode}/items`, {
    method: 'GET',
    query: {
      subject: filters?.subject,
      grade: filters?.grade,
    },
    signal,
  })
}

export const fetchEquivalentStandards = (standardCode, signal) => {
  return apiRequest(`/standards/equivalents/${standardCode}`, {
    method: 'GET',
    signal,
  })
}

export const alignTemplatesByGoal = (goal) => {
  return apiRequest('/agents/templates/align/by-goal', {
    method: 'POST',
    body: { goal },
  })
}

export const alignTemplatesByCode = (standardCode) => {
  return apiRequest('/agents/templates/align/by-code', {
    method: 'POST',
    body: { standardCode },
  })
}

export const executeTemplate = (slug, data, regenerate = 0) => {
  return apiRequest(`/templates/${slug}/execute`, {
    method: 'POST',
    query: { regenerate },
    body: { data },
  })
}
