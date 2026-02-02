/**
 * Hook for streaming document processing status via SSE
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { streamDocumentStatus, DocumentStatus } from '../api/contentIngestion'

interface UseDocumentStatusStreamReturn {
  status: DocumentStatus | null
  isStreaming: boolean
  error: string | null
  startStream: (documentId: string) => void
  stopStream: () => void
  reset: () => void
}

/**
 * Custom hook for handling document status streaming via Server-Sent Events (SSE)
 * 
 * This hook manages the streaming connection, receives status updates,
 * and handles completion and error states.
 */
const MAX_STREAM_RETRIES = 2
const RETRY_DELAY_MS = 2000

export const useDocumentStatusStream = (): UseDocumentStatusStreamReturn => {
  const [status, setStatus] = useState<DocumentStatus | null>(null)
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  const cleanupRef = useRef<(() => void) | null>(null)
  const retryCountRef = useRef(0)
  
  const stopStream = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
    setIsStreaming(false)
  }, [])
  
  const reset = useCallback(() => {
    stopStream()
    setStatus(null)
    setError(null)
  }, [stopStream])
  
  const startStream = useCallback((documentId: string) => {
    reset()
    setIsStreaming(true)
    
    const onStatusUpdate = (statusUpdate: DocumentStatus) => {
      retryCountRef.current = 0
      setStatus(statusUpdate)
      setError(null)
      if (statusUpdate.status === 'published' || statusUpdate.status === 'failed') {
        setIsStreaming(false)
      }
    }
    
    const onStreamError = (streamError: Error) => {
      if (retryCountRef.current < MAX_STREAM_RETRIES) {
        retryCountRef.current += 1
        if (cleanupRef.current) {
          cleanupRef.current()
          cleanupRef.current = null
        }
        setTimeout(() => {
          const cleanup = streamDocumentStatus(
            documentId,
            onStatusUpdate,
            onStreamError,
            () => setIsStreaming(false)
          )
          cleanupRef.current = cleanup
        }, RETRY_DELAY_MS)
      } else {
        retryCountRef.current = 0
        setError(streamError.message)
        setIsStreaming(false)
      }
    }
    
    const cleanup = streamDocumentStatus(
      documentId,
      onStatusUpdate,
      onStreamError,
      () => setIsStreaming(false)
    )
    cleanupRef.current = cleanup
  }, [reset])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [stopStream])
  
  return {
    status,
    isStreaming,
    error,
    startStream,
    stopStream,
    reset,
  }
}
