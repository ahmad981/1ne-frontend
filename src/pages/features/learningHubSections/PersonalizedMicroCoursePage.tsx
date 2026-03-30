import { Navigate, useParams } from 'react-router-dom'
import { getSectionItemBySlug } from '../../../features/learningHub'
import { useLearningHubRouteScrollToTop } from '../../../features/learningHub/useLearningHubScrollToTop'
import PersonalizedMicroCourseRenderer from './PersonalizedMicroCourseRenderer'

const PersonalizedMicroCoursePage = () => {
  useLearningHubRouteScrollToTop()
  const { slug } = useParams()
  const item = getSectionItemBySlug('personalized-micro-courses', slug)

  if (!item || !item.personalizedMicroCourseContent) {
    return <Navigate to='/learning-hub' replace />
  }

  return <PersonalizedMicroCourseRenderer item={item} />
}

export default PersonalizedMicroCoursePage

