/**
 * Document Details Page
 */
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'
import {
  getDocument,
  retryDocumentProcessing,
  runQAValidation,
  publishDocument,
  Document,
} from '../../api/contentIngestion'
import { ProcessingStatusCard } from '../../components/contentIngestion/ProcessingStatusCard'
import { QAValidationResults } from '../../components/contentIngestion/QAValidationResults'
import { useSnackbar } from '../../hooks/useSnackbar'

export const DocumentDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [document, setDocument] = useState<Document | null>(null)
  const [qaResults, setQAResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useSnackbar()
  
  useEffect(() => {
    if (id) {
      loadDocument()
    }
  }, [id])
  
  const loadDocument = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      const data = await getDocument(id)
      setDocument(data)
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load document'
      toast.error(errorMessage)
      console.error('Error loading document:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleRetry = async () => {
    if (!id) return
    
    try {
      setActionLoading(true)
      await retryDocumentProcessing(id)
      toast.success('Document processing restarted')
      loadDocument()
    } catch (error: any) {
      toast.error(error.message || 'Failed to retry processing')
    } finally {
      setActionLoading(false)
    }
  }
  
  const handleRunQA = async () => {
    if (!id) return
    
    try {
      setActionLoading(true)
      const results = await runQAValidation(id)
      setQAResults(results)
      toast.success('QA validation completed')
      loadDocument()
    } catch (error: any) {
      toast.error(error.message || 'Failed to run QA validation')
    } finally {
      setActionLoading(false)
    }
  }
  
  const handlePublish = async () => {
    if (!id) return
    
    try {
      setActionLoading(true)
      await publishDocument(id, false)
      toast.success('Document published successfully')
      loadDocument()
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish document')
    } finally {
      setActionLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600">Document not found</p>
        </div>
      </div>
    )
  }
  
  const isProcessing = !['published', 'failed'].includes(document.status)
  const canPublish = document.status === 'qa_validation' || document.status === 'published'
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/admin/documents')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Documents</span>
        </button>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{document.filename}</h1>
              {document.title && (
                <p className="text-gray-600 mt-1">{document.title}</p>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              document.status === 'published'
                ? 'bg-green-100 text-green-800'
                : document.status === 'failed'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {document.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">File Size:</span>{' '}
              <span className="font-medium">
                {document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Pages:</span>{' '}
              <span className="font-medium">{document.total_pages || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Uploaded:</span>{' '}
              <span className="font-medium">
                {new Date(document.created_at).toLocaleString()}
              </span>
            </div>
            {document.processed_at && (
              <div>
                <span className="text-gray-600">Processed:</span>{' '}
                <span className="font-medium">
                  {new Date(document.processed_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {isProcessing && (
          <div className="mb-6">
            <ProcessingStatusCard
              documentId={document.id}
              onComplete={loadDocument}
              onError={(error) => {
                toast.error(`Processing error: ${error}`)
                loadDocument()
              }}
            />
          </div>
        )}
        
        {document.status === 'failed' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-2">Processing Failed</h3>
                {document.error_message && (
                  <p className="text-red-700 mb-2">{document.error_message}</p>
                )}
                {document.remediation_hint && (
                  <p className="text-sm text-red-600 mb-4">
                    <strong>Hint:</strong> {document.remediation_hint}
                  </p>
                )}
                <button
                  onClick={handleRetry}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Retry Processing
                </button>
              </div>
            </div>
          </div>
        )}
        
        {document.status === 'qa_validation' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">QA Validation</h3>
              <div className="space-x-3">
                <button
                  onClick={handleRunQA}
                  disabled={actionLoading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Run QA
                </button>
                {qaResults && qaResults.qa_status === 'passed' && (
                  <button
                    onClick={handlePublish}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Publish
                  </button>
                )}
              </div>
            </div>
            {qaResults && <QAValidationResults qaResults={qaResults} />}
          </div>
        )}
        
        {document.status === 'published' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 text-green-600 mb-4">
              <CheckCircle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Document Published</h3>
            </div>
            <p className="text-gray-600">
              This document is now available for worksheet generation.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
