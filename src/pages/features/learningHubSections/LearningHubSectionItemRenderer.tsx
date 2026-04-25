import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSectionItemBySlug, LearningHubSectionKey, resolveAiGuidedTutorialShell } from '../../../features/learningHub'
import { LessonPlannerTutorialView } from '../LessonPlannerTutorial'
import { AssessmentTutorialView } from '../AssessmentTutorial'
import { DifferentiationTutorialView } from '../DifferentiationTutorial'
import { ResearchInsightArticleView } from './ResearchInsightArticleView'
import { SpecialistDeepDiveTrackRenderer } from './SpecialistDeepDiveTrackRenderer'
import axiosInstance from '../../../redux/http'

interface LearningHubSectionItemRendererProps {
  sectionKey: LearningHubSectionKey
}

const LearningHubSectionItemRenderer = ({ sectionKey }: LearningHubSectionItemRendererProps) => {
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
        setDetailError('This page was opened without backend identifiers. Open it from Learning Hub cards to load the latest item.')
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
        const base = {
          id: data.content_id,
          slug: slug || data.content_id,
          title: data.title,
          subtitle: data.subtitle,
          shortDescription: data.summary,
          duration: data.estimated_duration_min ? `${data.estimated_duration_min} min` : undefined,
          sectionKey,
        }
        setBackendItem({
          ...base,
          aiGuidedTutorialContent: payload.aiGuidedTutorialContent || payload.ai_guided_tutorial_content,
          researchInsightContent: payload.researchInsightContent || payload.research_insight_content,
          specialistDeepDiveContent: payload.specialistDeepDiveContent || payload.specialist_deep_dive_content,
        })
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
  }, [assignmentId, contentId, sectionKey, slug])

  const item = backendItem || getSectionItemBySlug(sectionKey, slug)

  if (loading) {
    return <div className='p-6 text-sm text-gray-500'>Loading content...</div>
  }

  if (!item) {
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

  if (item.aiGuidedTutorialContent) {
    switch (resolveAiGuidedTutorialShell(item.aiGuidedTutorialContent.renderProfile)) {
      case 'lesson-planner':
        return <LessonPlannerTutorialView item={item} />
      case 'assessment-best-practices':
        return <AssessmentTutorialView item={item} />
      case 'differentiation-case-study':
        return <DifferentiationTutorialView item={item} />
    }
  }

  if (item.researchInsightContent) {
    return <ResearchInsightArticleView item={item} />
  }

  if (item.specialistDeepDiveContent) {
    return <SpecialistDeepDiveTrackRenderer item={item} />
  }

  const ItemComponent = item.component
  if (!ItemComponent) {
    return <Navigate to='/learning-hub' replace />
  }
  return <ItemComponent />
}

export default LearningHubSectionItemRenderer

