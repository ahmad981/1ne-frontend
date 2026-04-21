/**
 * Content Packs Management Page
 */
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, Search, Upload, CheckCircle, Edit, AlertCircle, Loader2 } from 'lucide-react'
import { fetchContentPacks, createContentPack, deleteContentPack, updateContentPack, ContentPack, ContentPackCreate } from '../../api/contentIngestion'
import { ContentPackCard } from '../../components/contentIngestion/ContentPackCard'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useNavigate, useLocation } from 'react-router-dom'

export const ContentPacksManagement = () => {
  const [packs, setPacks] = useState<ContentPack[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPack, setEditingPack] = useState<ContentPack | null>(null)
  const [createdPack, setCreatedPack] = useState<ContentPack | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [packToDelete, setPackToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useSnackbar()
  const navigate = useNavigate()
  const location = useLocation()
  const isLoadingRef = useRef(false)
  const hasLoadedRef = useRef(false) // Track if we've already loaded once
  
  // Define loadPacks BEFORE useEffect hooks that use it
  // Use ref for toast to prevent recreation of function
  const toastRef = useRef(toast)
  useEffect(() => {
    toastRef.current = toast
  }, [toast])
  
  const loadPacks = useCallback(async () => {
    // Prevent multiple simultaneous calls using ref
    if (isLoadingRef.current) {
      console.log('[ContentPacksManagement] Already loading, skipping...')
      return
    }
    
    try {
      console.log('[ContentPacksManagement] ===== STARTING LOAD PACKS =====')
      isLoadingRef.current = true
      setLoading(true)
      setError(null)
      
      console.log('[ContentPacksManagement] Calling fetchContentPacks...')
      const data = await fetchContentPacks({ is_active: true })
      
      console.log('[ContentPacksManagement] ✅ Packs loaded successfully:', data?.length || 0, 'packs')
      setPacks(data || [])
      hasLoadedRef.current = true // Mark as loaded
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load content packs'
      console.error('[ContentPacksManagement] ❌ Error loading packs:', error)
      setError(errorMessage)
      toastRef.current.error(errorMessage)
      setPacks([]) // Set empty array on error
      hasLoadedRef.current = true // Mark as loaded even on error
    } finally {
      console.log('[ContentPacksManagement] ===== FINALLY BLOCK =====')
      setLoading(false)
      isLoadingRef.current = false
      console.log('[ContentPacksManagement] Loading state set to false')
    }
  }, []) // Empty dependencies - toast accessed via ref
  
  // Initial load - only run once on mount
  useEffect(() => {
    // Only load if we haven't loaded before
    if (!hasLoadedRef.current && !isLoadingRef.current) {
      console.log('[ContentPacksManagement] Component mounted, loading packs (first time)')
      loadPacks()
    } else {
      console.log('[ContentPacksManagement] Component mounted but already loaded, skipping')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount - DO NOT add loadPacks to dependencies
  
  const handleCreatePack = async (data: ContentPackCreate) => {
    try {
      const newPack = await createContentPack(data)
      toast.success('Content pack created successfully')
      setShowCreateModal(false)
      setCreatedPack(newPack) // Show success modal
      // Reload packs after creation
      await loadPacks()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create content pack')
    }
  }
  
  const handleUploadDocuments = () => {
    if (createdPack?.id) {
      navigate(`/admin/documents/upload?pack_id=${createdPack.id}`)
      setCreatedPack(null)
    }
  }
  
  const handleCloseSuccessModal = () => {
    setCreatedPack(null)
  }
  
  const handleDeleteClick = (pack: ContentPack) => {
    setPackToDelete({ id: pack.id, name: pack.name })
    setShowDeleteModal(true)
  }
  
  const handleConfirmDelete = async () => {
    if (!packToDelete || isDeleting) return
    
    try {
      setIsDeleting(true)
      await deleteContentPack(packToDelete.id)
      toast.success('Content pack deleted successfully')
      
      // Close modal immediately
      setShowDeleteModal(false)
      setPackToDelete(null)
      
      // Refresh the list
      await loadPacks()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete content pack')
      // Don't navigate on error - stay on page
    } finally {
      setIsDeleting(false)
    }
  }
  
  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setPackToDelete(null)
  }
  
  const handleEditPack = (pack: ContentPack) => {
    setEditingPack(pack)
    setShowEditModal(true)
  }
  
  const handleUpdatePack = async (data: ContentPackCreate) => {
    if (!editingPack?.id) return
    
    try {
      await updateContentPack(editingPack.id, data)
      toast.success('Content pack updated successfully')
      setShowEditModal(false)
      setEditingPack(null)
      // Use setTimeout to avoid race conditions
      setTimeout(() => {
        loadPacks()
      }, 100)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update content pack')
    }
  }
  
  const filteredPacks = (packs || []).filter((pack) =>
    pack?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pack?.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Packs</h1>
            <p className="text-gray-600 mt-1">Manage curriculum content packs</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>Create Pack</span>
          </button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search packs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-semibold">Error loading content packs</p>
            <p className="text-red-600 text-sm mt-1 whitespace-pre-line">{error}</p>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 text-sm font-semibold mb-2">Troubleshooting:</p>
              <ul className="text-yellow-700 text-sm list-disc list-inside space-y-1">
                <li>Ensure backend is running (check http://127.0.0.1:8000/health)</li>
                <li>If testing locally, set VITE_USE_LOCAL=true in .env file</li>
                <li>Restart backend server to load new routes</li>
                <li>Check browser console for detailed error messages</li>
                <li>Verify you are logged in with proper permissions</li>
              </ul>
            </div>
            <button
              onClick={() => {
                setError(null)
                loadPacks()
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPacks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No content packs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacks.map((pack) => (
              <ContentPackCard
                key={pack.id}
                pack={pack}
                onClick={() => {
                  const path = `/admin/content-packs/${pack.id}`
                  console.log('[ContentPacksManagement] Click detected, navigating to:', path)
                  console.log('[ContentPacksManagement] Pack ID:', pack.id)
                  console.log('[ContentPacksManagement] Current location:', window.location.pathname)
                  try {
                    navigate(path, { replace: false })
                    console.log('[ContentPacksManagement] Navigation called successfully')
                  } catch (error) {
                    console.error('[ContentPacksManagement] Navigation error:', error)
                    toast.error('Failed to navigate to pack details')
                  }
                }}
                onDelete={handleDeleteClick}
                onEdit={handleEditPack}
              />
            ))}
          </div>
        )}
        
        {showCreateModal && (
          <CreatePackModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreatePack}
          />
        )}
        
        {createdPack && (
          <SuccessModal
            pack={createdPack}
            onUploadDocuments={handleUploadDocuments}
            onClose={handleCloseSuccessModal}
          />
        )}
        
        {showEditModal && editingPack && (
          <EditPackModal
            pack={editingPack}
            onClose={() => {
              setShowEditModal(false)
              setEditingPack(null)
            }}
            onSubmit={handleUpdatePack}
          />
        )}
        
        {/* Professional Delete Confirmation Modal */}
        {showDeleteModal && packToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Content Pack</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  Are you sure you want to delete <strong>"{packToDelete.name}"</strong>?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This will deactivate the content pack and hide it from the list. All associated documents will remain but will be unlinked from this pack.
                </p>
              </div>
              
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[100px] justify-center"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Create Pack Modal Component
interface CreatePackModalProps {
  onClose: () => void
  onSubmit: (data: ContentPackCreate) => void
}

const CreatePackModal = ({ onClose, onSubmit }: CreatePackModalProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
  const [curriculum, setCurriculum] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      description: description || null,
      subject: subject || null,
      grade: grade || null,
      curriculum: curriculum || null,
    })
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create Content Pack</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Curriculum
            </label>
            <input
              type="text"
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Cambridge, IB, CCSS"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Success Modal - shown after creating a pack
interface SuccessModalProps {
  pack: ContentPack
  onUploadDocuments: () => void
  onClose: () => void
}

const SuccessModal = ({ pack, onUploadDocuments, onClose }: SuccessModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pack created</h2>
            <p className="text-gray-600 text-sm">Your content pack was created successfully.</p>
          </div>
        </div>
        <p className="text-gray-700 mb-6">
          <span className="font-medium">{pack.name}</span>
          {pack.subject && (
            <span className="text-gray-500 text-sm block mt-1">
              {pack.subject}{pack.grade ? ` · ${pack.grade}` : ''}
            </span>
          )}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onUploadDocuments}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Documents
          </button>
        </div>
      </div>
    </div>
  )
}

// Edit Pack Modal Component
interface EditPackModalProps {
  pack: ContentPack
  onClose: () => void
  onSubmit: (data: ContentPackCreate) => void
}

const EditPackModal = ({ pack, onClose, onSubmit }: EditPackModalProps) => {
  const [name, setName] = useState(pack.name || '')
  const [description, setDescription] = useState(pack.description || '')
  const [subject, setSubject] = useState(pack.subject || '')
  const [grade, setGrade] = useState(pack.grade || '')
  const [curriculum, setCurriculum] = useState(pack.curriculum || '')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      description: description || null,
      subject: subject || null,
      grade: grade || null,
      curriculum: curriculum || null,
    })
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Content Pack</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Curriculum
            </label>
            <input
              type="text"
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Cambridge, IB, CCSS"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
