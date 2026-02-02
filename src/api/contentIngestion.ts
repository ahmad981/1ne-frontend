/**
 * Content Ingestion API client
 */
import { apiRequest, buildUrl } from './client'

export interface ContentPack {
  id: string
  name: string
  description: string | null
  subject: string | null
  grade: string | null
  curriculum: string | null
  metadata: Record<string, any> | null
  is_active: boolean
  created_at: string
  updated_at: string
  document_count?: number
}

export interface ContentPackCreate {
  name: string
  description?: string | null
  subject?: string | null
  grade?: string | null
  curriculum?: string | null
  metadata?: Record<string, any> | null
}

export interface Document {
  id: string
  pack_id: string
  filename: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  source_type: string
  status: string
  error_code: string | null
  error_message: string | null
  remediation_hint: string | null
  processing_metadata: Record<string, any> | null
  chapter_map: Array<{
    id: string
    title: string
    level: number
    parent_id: string | null
    start_page_pdf: number
    end_page_pdf: number
    keywords: string[]
  }> | null
  title: string | null
  author: string | null
  total_pages: number | null
  document_hash: string | null
  version_label: string | null
  created_at: string
  updated_at: string
  processed_at: string | null
}

export interface DocumentUploadRequest {
  pack_id?: string  // Optional - if not provided, will create pack
  file: File
  title?: string
  author?: string
  chapter_map?: Array<{
    id: string
    title: string
    level: number
    parent_id: string | null
    start_page_pdf: number
    end_page_pdf: number
    keywords: string[]
  }>
  force_ocr?: boolean
  // Pack creation fields (used when pack_id is not provided)
  pack_name?: string
  pack_description?: string
  pack_subject?: string
  pack_grade?: string
  pack_curriculum?: string
}

export interface UploadProgressEvent {
  type: 'progress' | 'success' | 'error'
  step?: string
  message: string
  percentage?: number
  document_id?: string
  pack_id?: string
}

export interface DocumentStatus {
  document_id: string
  status: string
  progress: {
    step: string
    completed: number
    total: number
    percentage: number
    estimated_time_remaining?: string
  } | null
  steps_completed: string[]
  current_step: string | null
  error_code: string | null
  error_message: string | null
  remediation_hint: string | null
}

export interface WorksheetQuestion {
  id: string
  type: string
  question: string
  options?: string[]
  correct_answer: string
  explanation?: string
  points: number
  difficulty: string
  math_content: boolean
}

export interface Worksheet {
  id: string
  pack_id: string
  topic_id: string | null
  topic_text: string | null
  grade: string | null
  subject: string | null
  questions: WorksheetQuestion[]
  answer_key: Record<string, string>
  marking_scheme: Record<string, any>
  citations?: Array<{
    chunk_id: string
    document_id: string
    page_range: string
  }>
  created_at: string
}

export interface WorksheetGenerateRequest {
  pack_id: string
  topic_id?: string
  topic_text?: string
  grade?: string
  subject?: string
  difficulty_mix?: {
    easy: number
    medium: number
    hard: number
  }
  num_questions?: number
  question_types?: string[]
}

// Content Pack API
export async function fetchContentPacks(params?: {
  skip?: number
  limit?: number
  is_active?: boolean
}): Promise<ContentPack[]> {
  return apiRequest<ContentPack[]>('v1/admin/content-packs', {
    query: params,
  })
}

export async function createContentPack(data: ContentPackCreate): Promise<ContentPack> {
  return apiRequest<ContentPack>('v1/admin/content-packs', {
    method: 'POST',
    body: data,
  })
}

export async function getContentPack(packId: string): Promise<ContentPack> {
  return apiRequest<ContentPack>(`v1/admin/content-packs/${packId}`)
}

export async function updateContentPack(packId: string, data: ContentPackCreate): Promise<ContentPack> {
  return apiRequest<ContentPack>(`v1/admin/content-packs/${packId}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deleteContentPack(packId: string): Promise<void> {
  return apiRequest<void>(`v1/admin/content-packs/${packId}`, {
    method: 'DELETE',
  })
}

// Document API - Streaming upload with progress
export async function uploadDocumentStream(
  data: DocumentUploadRequest,
  onProgress: (event: UploadProgressEvent) => void
): Promise<{ document_id: string; pack_id: string }> {
  const formData = new FormData()
  
  // Pack fields
  if (data.pack_id) {
    formData.append('pack_id', data.pack_id)
  } else {
    // Create new pack
    if (data.pack_name) formData.append('pack_name', data.pack_name)
    if (data.pack_description) formData.append('pack_description', data.pack_description)
    if (data.pack_subject) formData.append('pack_subject', data.pack_subject)
    if (data.pack_grade) formData.append('pack_grade', data.pack_grade)
    if (data.pack_curriculum) formData.append('pack_curriculum', data.pack_curriculum)
  }
  
  // Document fields
  formData.append('file', data.file)
  if (data.title) formData.append('title', data.title)
  if (data.author) formData.append('author', data.author)
  if (data.chapter_map) {
    formData.append('chapter_map', JSON.stringify(data.chapter_map))
  }
  if (data.force_ocr) {
    formData.append('force_ocr', 'true')
  }
  
  const url = buildUrl('v1/admin/documents/upload-stream')
  const token = getAuthToken()
  
  // Add timeout for upload (120 seconds for large files)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, 120000) // 120 seconds timeout
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }))
      throw new Error(error.detail || `Upload failed: ${response.statusText}`)
    }
    
    // Read streaming response
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    
    if (!reader) {
      throw new Error('Response body is not readable')
    }
    
    let result: { document_id: string; pack_id: string } | null = null
    let lastActivityTime = Date.now()
    const STREAM_TIMEOUT = 60000 // 60 seconds for stream inactivity
    
    while (true) {
      // Check for stream timeout
      if (Date.now() - lastActivityTime > STREAM_TIMEOUT) {
        throw new Error('Upload stream timed out - no activity for 60 seconds')
      }
      
      const { done, value } = await reader.read()
      if (done) break
      
      lastActivityTime = Date.now() // Update activity time
      
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''  // Keep incomplete line in buffer
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const event: UploadProgressEvent = JSON.parse(line.slice(6))
            onProgress(event)
            
            if (event.type === 'success') {
              result = {
                document_id: event.document_id!,
                pack_id: event.pack_id!,
              }
            } else if (event.type === 'error') {
              throw new Error(event.message)
            }
          } catch (e) {
            console.error('Error parsing SSE event:', e)
            // Don't break on parse errors, continue reading
          }
        }
      }
    }
    
    if (!result) {
      throw new Error('Upload completed but no result received')
    }
    
    return result
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Upload request timed out after 120 seconds')
    }
    throw error
  }
}

// Legacy non-streaming upload (kept for backward compatibility)
export async function uploadDocument(data: DocumentUploadRequest): Promise<Document> {
  const formData = new FormData()
  if (data.pack_id) {
    formData.append('pack_id', data.pack_id)
  }
  formData.append('file', data.file)
  
  if (data.title) formData.append('title', data.title)
  if (data.author) formData.append('author', data.author)
  if (data.chapter_map) {
    formData.append('chapter_map', JSON.stringify(data.chapter_map))
  }
  if (data.force_ocr) {
    formData.append('force_ocr', 'true')
  }
  
  const url = buildUrl('v1/admin/documents')
  
  const token = getAuthToken()
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }))
    throw new Error(error.detail || `Upload failed: ${response.statusText}`)
  }
  
  return response.json()
}

export async function fetchDocuments(params?: {
  pack_id?: string
  status?: string
  skip?: number
  limit?: number
}): Promise<Document[]> {
  return apiRequest<Document[]>('v1/admin/documents', {
    query: params,
  })
}

export async function getDocument(documentId: string): Promise<Document> {
  return apiRequest<Document>(`v1/admin/documents/${documentId}`)
}

export async function deleteDocument(documentId: string): Promise<void> {
  return apiRequest<void>(`v1/admin/documents/${documentId}`, {
    method: 'DELETE',
  })
}

export async function retryDocumentProcessing(documentId: string): Promise<Document> {
  return apiRequest<Document>(`v1/admin/documents/${documentId}/retry`, {
    method: 'POST',
  })
}

export async function runQAValidation(documentId: string): Promise<any> {
  return apiRequest(`v1/admin/documents/${documentId}/qa/run`, {
    method: 'POST',
  })
}

export async function publishDocument(
  documentId: string,
  override_qa?: boolean,
  override_reason?: string
): Promise<Document> {
  return apiRequest<Document>(`v1/admin/documents/${documentId}/publish`, {
    method: 'POST',
    body: {
      override_qa,
      override_reason,
    },
  })
}

// SSE Status Stream (using fetch with ReadableStream for custom headers)
export function streamDocumentStatus(
  documentId: string,
  onStatusUpdate: (status: DocumentStatus) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void
): () => void {
  const url = buildUrl(`v1/admin/documents/${documentId}/status/stream`)
  
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Accept': 'text/event-stream',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const abortController = new AbortController()
  let buffer = ''
  let isClosed = false
  
  const processStream = async () => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: abortController.signal,
      })
      
      if (!response.ok) {
        throw new Error(`SSE stream failed: ${response.statusText}`)
      }
      
      if (!response.body) {
        throw new Error('No response body received')
      }
      
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      
      while (true) {
        if (isClosed) break
        
        const { done, value } = await reader.read()
        
        if (done) {
          break
        }
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim()
            if (!jsonStr) continue
            try {
              const raw = JSON.parse(jsonStr) as Record<string, unknown>
              // Normalize backend payload so UI always receives valid DocumentStatus (matrix)
              const progress = raw.progress != null && typeof raw.progress === 'object'
                ? {
                    step: String((raw.progress as Record<string, unknown>).step ?? raw.current_step ?? raw.status ?? ''),
                    completed: Number((raw.progress as Record<string, unknown>).completed ?? 0),
                    total: Number((raw.progress as Record<string, unknown>).total ?? 0),
                    percentage: Number((raw.progress as Record<string, unknown>).percentage ?? 0),
                    estimated_time_remaining: (raw.progress as Record<string, unknown>).estimated_time_remaining as string | undefined,
                  }
                : null
              const status: DocumentStatus = {
                document_id: String(raw.document_id ?? ''),
                status: String(raw.status ?? 'uploaded'),
                progress,
                steps_completed: Array.isArray(raw.steps_completed) ? raw.steps_completed as string[] : [],
                current_step: raw.current_step != null ? String(raw.current_step) : null,
                error_code: raw.error_code != null ? String(raw.error_code) : null,
                error_message: raw.error_message != null ? String(raw.error_message) : null,
                remediation_hint: raw.remediation_hint != null ? String(raw.remediation_hint) : null,
              }
              onStatusUpdate(status)
              if (status.status === 'published' || status.status === 'failed') {
                if (onComplete) onComplete()
                isClosed = true
                return
              }
            } catch (error) {
              console.error('Error parsing status update:', error)
              if (onError) onError(error as Error)
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError' && !isClosed) {
        console.error('SSE stream error:', error)
        if (onError) onError(error)
      }
    }
  }
  
  // Start processing stream
  processStream()
  
  // Return cleanup function
  return () => {
    isClosed = true
    abortController.abort()
  }
}

// Worksheet API
export async function generateWorksheet(data: WorksheetGenerateRequest): Promise<Worksheet> {
  return apiRequest<Worksheet>('v1/worksheets/generate', {
    method: 'POST',
    body: data,
    timeout: 120000, // 2 minutes for LLM generation
  })
}

export async function getWorksheet(worksheetId: string): Promise<Worksheet> {
  return apiRequest<Worksheet>(`v1/worksheets/${worksheetId}`)
}

// Helper to get auth token (same pattern as client.ts)
function getAuthToken(): string | null {
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
