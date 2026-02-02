/**
 * Processing Status Card - Real-time status display with progress bar
 */
import React, { useEffect } from 'react'
import { useDocumentStatusStream } from '../../hooks/useDocumentStatusStream'
import { StepIndicator } from './StepIndicator'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface ProcessingStatusCardProps {
  documentId: string
  onComplete?: () => void
  onError?: (error: string) => void
}

const PROCESSING_STEPS = [
  { name: 'uploaded', label: 'Uploaded' },
  { name: 'text_extracting', label: 'Extracting Text' },
  { name: 'ocr_running', label: 'Running OCR' },
  { name: 'normalizing', label: 'Normalizing' },
  { name: 'chunking', label: 'Chunking' },
  { name: 'embedding', label: 'Generating Embeddings' },
  { name: 'indexing', label: 'Indexing' },
  { name: 'qa_validation', label: 'QA Validation' },
  { name: 'published', label: 'Published' },
]

export const ProcessingStatusCard = ({
  documentId,
  onComplete,
  onError,
}: ProcessingStatusCardProps) => {
  const { status, isStreaming, error, startStream, stopStream } = useDocumentStatusStream()
  
  useEffect(() => {
    if (documentId) {
      try {
        startStream(documentId)
      } catch (error) {
        console.error('Error starting status stream:', error)
        if (onError) onError(new Error('Failed to start status stream'))
      }
    }
    return () => {
      try {
        stopStream()
      } catch (error) {
        console.error('Error stopping status stream:', error)
      }
    }
  }, [documentId, startStream, stopStream, onError])
  
  useEffect(() => {
    if (status?.status === 'published') {
      if (onComplete) {
        try {
          onComplete()
        } catch (error) {
          console.error('Error in onComplete callback:', error)
        }
      }
    } else if (status?.status === 'failed') {
      if (onError) {
        try {
          onError(status.error_message || 'Processing failed')
        } catch (error) {
          console.error('Error in onError callback:', error)
        }
      }
    }
  }, [status, onComplete, onError])
  
  if (!status && !error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Connecting to status stream...</span>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start space-x-3 text-red-600">
          <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold">Connection Error</p>
            <p className="text-sm text-gray-600 mt-1">{error}</p>
            <p className="text-sm text-gray-500 mt-2">
              If you just uploaded the document, the server may still be starting. Click Retry to try again.
            </p>
            <button
              type="button"
              onClick={() => {
                startStream(documentId)
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  const currentStatus = status?.status || 'uploaded'
  const progress = status?.progress
  
  // Build steps with status
  const steps = PROCESSING_STEPS.map((step) => {
    const stepIndex = PROCESSING_STEPS.findIndex((s) => s.name === step.name)
    const currentIndex = PROCESSING_STEPS.findIndex((s) => s.name === currentStatus)
    
    let stepStatus: 'pending' | 'in_progress' | 'completed' | 'failed' = 'pending'
    if (currentStatus === 'failed' && stepIndex <= currentIndex) {
      stepStatus = 'failed'
    } else if (stepIndex < currentIndex) {
      stepStatus = 'completed'
    } else if (stepIndex === currentIndex) {
      stepStatus = 'in_progress'
    }
    
    return {
      ...step,
      status: stepStatus,
    }
  })
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Processing Status
        </h3>
        
        {status?.status === 'published' ? (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Document Published Successfully!</span>
          </div>
        ) : status?.status === 'failed' ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">Processing Failed</p>
                {status.error_message && (
                  <p className="text-sm text-red-700 mt-1">{status.error_message}</p>
                )}
                {status.remediation_hint && (
                  <p className="text-sm text-red-600 mt-2">
                    <strong>Hint:</strong> {status.remediation_hint}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">
              {progress?.step || currentStatus.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          </div>
        )}
      </div>
      
      {progress && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          {progress.completed > 0 && progress.total > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {progress.completed} / {progress.total} completed
            </p>
          )}
        </div>
      )}
      
      <StepIndicator steps={steps} currentStep={currentStatus} />
    </div>
  )
}
