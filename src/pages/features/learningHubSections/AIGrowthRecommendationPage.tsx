import { Navigate, useParams } from 'react-router-dom'
import { getSectionItemBySlug } from '../../../features/learningHub'
import { useLearningHubRouteScrollToTop } from '../../../features/learningHub/useLearningHubScrollToTop'
import AIGrowthRecommendationRenderer from './AIGrowthRecommendationRenderer'

const AIGrowthRecommendationPage = () => {
  useLearningHubRouteScrollToTop()
  const { slug } = useParams()
  const item = getSectionItemBySlug('ai-growth-recommendations', slug)

  if (!item || !item.aiGrowthRecommendationContent) {
    return <Navigate to='/learning-hub' replace />
  }

  return <AIGrowthRecommendationRenderer item={item} />
}

export default AIGrowthRecommendationPage

