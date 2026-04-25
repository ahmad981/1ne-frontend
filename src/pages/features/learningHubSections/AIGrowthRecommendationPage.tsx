// @ts-nocheck
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSectionItemBySlug } from '../../../features/learningHub'
import { useLearningHubRouteScrollToTop } from '../../../features/learningHub/useLearningHubScrollToTop'
import AIGrowthRecommendationRenderer from './AIGrowthRecommendationRenderer'
import axiosInstance from '../../../redux/http'

const AIGrowthRecommendationPage = () => {
  useLearningHubRouteScrollToTop()
  const { slug } = useParams()
  const location = useLocation()
  const [backendItem, setBackendItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [detailError, setDetailError] = useState<string | null>(null)
  const contentId = location?.state?.content_id
  const assignmentId = location?.state?.assignment_id

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!contentId) {
        setDetailError('This page was opened without a backend content identifier. Open it from the Learning Hub to load the latest personalized path.')
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
        const rich = payload?.aiGrowthRecommendationContent || payload?.ai_growth_recommendation_content || null
        if (rich) {
          setBackendItem({
            title: data.title || location?.state?.title || 'AI Growth Recommendation',
            section: 'ai-growth-recommendations',
            slug: slug || data.content_id,
            aiGrowthRecommendationContent: rich,
          })
        }
      } catch {
        setDetailError('This growth recommendation is still generating or unavailable right now.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [assignmentId, contentId, location?.state?.title, slug])

  const item = contentId ? backendItem : getSectionItemBySlug('ai-growth-recommendations', slug)

  if (loading) {
    return <div className='p-6 text-sm text-gray-500'>Loading personalized growth path...</div>
  }
  if (!item || !item.aiGrowthRecommendationContent) {
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

  return <AIGrowthRecommendationRenderer item={item} />
}

export default AIGrowthRecommendationPage

