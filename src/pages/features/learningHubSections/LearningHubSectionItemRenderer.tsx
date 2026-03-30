import { Navigate, useParams } from 'react-router-dom'
import { getSectionItemBySlug, LearningHubSectionKey, resolveAiGuidedTutorialShell } from '../../../features/learningHub'
import { LessonPlannerTutorialView } from '../LessonPlannerTutorial'
import { AssessmentTutorialView } from '../AssessmentTutorial'
import { DifferentiationTutorialView } from '../DifferentiationTutorial'
import { ResearchInsightArticleView } from './ResearchInsightArticleView'
import { SpecialistDeepDiveTrackRenderer } from './SpecialistDeepDiveTrackRenderer'

interface LearningHubSectionItemRendererProps {
  sectionKey: LearningHubSectionKey
}

const LearningHubSectionItemRenderer = ({ sectionKey }: LearningHubSectionItemRendererProps) => {
  const { slug } = useParams()
  const item = getSectionItemBySlug(sectionKey, slug)

  if (!item) {
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

