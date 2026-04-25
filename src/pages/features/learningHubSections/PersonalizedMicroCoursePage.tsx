import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSectionItemBySlug } from '../../../features/learningHub'
import { useLearningHubRouteScrollToTop } from '../../../features/learningHub/useLearningHubScrollToTop'
import PersonalizedMicroCourseRenderer from './PersonalizedMicroCourseRenderer'
import axiosInstance from '../../../redux/http'

const PersonalizedMicroCoursePage = () => {
  useLearningHubRouteScrollToTop()
  const { slug } = useParams()
  const location = useLocation()
  const [backendItem, setBackendItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [detailError, setDetailError] = useState<string | null>(null)
  const contentId = (location?.state as any)?.content_id
  const assignmentId = (location?.state as any)?.assignment_id

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!contentId) {
        setDetailError('This page was opened without a backend content identifier. Open it from the Learning Hub to load the latest personalized content.')
        setLoading(false)
        return
      }
      try {
        const { data } = await axiosInstance.get(
          `/api/v1/learning-hub/content/${encodeURIComponent(contentId)}/detail`,
          { params: assignmentId ? { assignment_id: assignmentId } : undefined },
        )
        if (!mounted) return
        const payload = data?.detail_payload || {}
        const micro = payload?.personalizedMicroCourseContent || payload?.personalized_micro_course_content
        if (micro) {
          setBackendItem({
            id: data.content_id,
            slug: slug || data.content_id,
            title: data.title,
            subtitle: data.subtitle,
            duration: data.estimated_duration_min ? `${data.estimated_duration_min} min` : undefined,
            sectionKey: 'personalized-micro-courses',
            ctaLabel: 'Start',
            personalizedMicroCourseContent: micro,
          })
        }
      } catch {
        setDetailError('This item is still generating or unavailable right now.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [assignmentId, contentId, slug])

  const item = backendItem || getSectionItemBySlug('personalized-micro-courses', slug)

  if (loading) {
    return <div className='p-6 text-sm text-gray-500'>Loading personalized course...</div>
  }

  if (!item || !item.personalizedMicroCourseContent) {
    if (detailError) {
      return (
        <div className='p-6 space-y-3'>
          <p className='text-sm text-amber-700'>{detailError}</p>
          <button
            type='button'
            onClick={() => window.history.back()}
            className='rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:bg-gray-50'
          >
            Back
          </button>
        </div>
      )
    }
    return <Navigate to='/learning-hub' replace />
  }

  return <PersonalizedMicroCourseRenderer item={item} />
}

export default PersonalizedMicroCoursePage

