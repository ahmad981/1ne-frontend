import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  BookOpen,
  Play,
  Award,
  Users,
  Sparkles,
  Target,
  FileText,
  GraduationCap,
  CheckCircle2,
  Zap,
  Info,
} from 'lucide-react'
import { fetchLearningHubHome } from '../../redux/features/learningHub/learningHubSlice'
import {
  recordRecommendationEvent,
  startLearningSession,
  recordLearningEvent,
} from '../../redux/features/learningProgress/learningProgressSlice'
import { fetchRecentSessions } from '../../redux/features/learningProgress/learningProgressSlice'
import { resolveHubCardRoute } from '../../utils/learningHubDelivery'

function persistHubRouteState(route: string, contentId: string, contentType: string) {
  if (!route || !contentId) return
  try {
    sessionStorage.setItem(`learningHubRouteState:${route}`, JSON.stringify({ contentId, contentType }))
  } catch {
    // Best-effort only; never block navigation.
  }
}

// Static data: backend does not yet provide this. Kept for UI; pending backend integration.
const researchInsights = [
  {
    title: "Hattie's Visible Learning: Effect sizes that matter",
    summary: 'Which teaching strategies have the highest impact? Simplified breakdown of meta-analyses.',
    readTime: '5 min',
    topic: 'Evidence-based teaching',
  },
  {
    title: "Bloom's taxonomy in modern classrooms",
    summary: 'Practical applications of cognitive levels for lesson design and assessment.',
    readTime: '6 min',
    topic: 'Pedagogy',
  },
  {
    title: 'Formative assessment: What research says',
    summary: 'Key findings from Black & Wiliam and how to implement feedback loops effectively.',
    readTime: '7 min',
    topic: 'Assessment',
  },
  {
    title: 'SEL & behavior: Restorative practices',
    summary: 'Evidence-backed approaches to building classroom community and addressing conflicts.',
    readTime: '8 min',
    topic: 'SEL & Behavior',
  },
  {
    title: 'Growth mindset: Dweck\'s research in practice',
    summary: 'How to cultivate a growth mindset in students and transform their approach to learning challenges.',
    readTime: '6 min',
    topic: 'Student motivation',
  },
  {
    title: 'Cognitive load theory: Optimizing learning',
    summary: 'Understanding how students process information and designing lessons that reduce cognitive overload.',
    readTime: '7 min',
    topic: 'Learning science',
  },
  {
    title: 'Metacognition: Teaching students to think about thinking',
    summary: 'Research-backed strategies for developing metacognitive skills that improve learning outcomes.',
    readTime: '8 min',
    topic: 'Learning strategies',
  },
  {
    title: 'Scaffolding instruction: Vygotsky\'s zone of proximal development',
    summary: 'Practical ways to provide just-right support that helps students reach their potential.',
    readTime: '6 min',
    topic: 'Instructional design',
  },
]

// Static data: backend does not yet provide specialist tracks. Kept for UI; pending backend integration.
const specialistTracks = [
  {
    title: 'STEM Mastery',
    description: 'NGSS alignment, engineering design, computational thinking, and lab safety protocols.',
    modules: 8,
    duration: '12 hours',
    enrolled: false,
  },
  {
    title: 'Literacy Expert',
    description: 'Phonics instruction, guided reading, writing workshop, and multilingual supports.',
    modules: 10,
    duration: '15 hours',
    enrolled: true,
  },
  {
    title: 'AI in Education',
    description: 'Ethical AI use, prompt engineering, personalized learning, and student data privacy.',
    modules: 6,
    duration: '10 hours',
    enrolled: false,
  },
  {
    title: 'Behavior Management Pro',
    description: 'Restorative practices, trauma-informed care, positive behavior supports, and family partnerships.',
    modules: 7,
    duration: '11 hours',
    enrolled: false,
  },
]

const ProfessionalLearningHub = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    microCourses = [],
    tutorials = [],
    aiRecommendations = [],
    certificates = [],
    progressStats = {
      coursesCompleted: 0,
      hoursLogged: 0,
      certificatesEarned: 0,
      currentStreak: 0,
    },
    loading = false,
    error = null,
    home = null,
  } = useSelector((state: any) => state.learningHub) ?? {}

  const { activeSessionsByContentId = {}, inProgressContent = [] } = useSelector((state: any) => state.learningProgress) ?? {}

  useEffect(() => {
    dispatch(fetchLearningHubHome())
    dispatch(fetchRecentSessions())
  }, [dispatch])

  // Fire a best-effort single \"shown\" recommendation event per item
  const shownSetRef = useRef<Set<string> | null>(null)
  if (!shownSetRef.current) {
    shownSetRef.current = new Set()
  }
  useEffect(() => {
    const shown = shownSetRef.current!
    const items = [...(microCourses || []), ...(tutorials || [])]
    items.forEach((item: any) => {
      const cid = item?.contentId
      if (!cid || shown.has(cid)) return
      shown.add(cid)
      dispatch(
        recordRecommendationEvent({
          content_id: cid,
          content_type:
            item?.contentType ||
            (item?.route?.includes('tutorial') ? 'ai_guided_tutorial' : 'micro_course'),
          recommendation_source: 'learning_hub_home',
          event_type: 'shown',
        })
      )
    })
  }, [dispatch, microCourses, tutorials])

  const handleCourseStart = (course: {
    title: string
    route?: string
    contentId?: string
    contentType?: string
    contentSlug?: string | null
    delivery?: Record<string, unknown> | null
  }) => {
    const contentId = course.contentId
    const contentType = course.contentType || 'micro_course'
    if (contentId) {
      const existing = (activeSessionsByContentId as any)[contentId]
      if (!existing) {
        dispatch(
          startLearningSession({
            contentId,
            contentType,
          })
        )
      } else {
        dispatch(
          recordLearningEvent({
            session_id: existing.sessionId,
            content_id: contentId,
            event_type: 'content_opened',
          })
        )
      }
      dispatch(
        recordRecommendationEvent({
          content_id: contentId,
          content_type: contentType,
          recommendation_source: 'learning_hub_home',
          event_type: 'clicked',
        })
      )
    }
    const target = resolveHubCardRoute(course)
    // Persist mapping so Continue / Start path still works if `location.state` is missing.
    persistHubRouteState(target, contentId, contentType)
    navigate(target, {
      state: {
        contentId,
        contentType,
      },
    })
  }

  const handleTutorialWatch = (tutorial: {
    title: string
    route?: string
    contentId?: string
    contentType?: string
    contentSlug?: string | null
    delivery?: Record<string, unknown> | null
  }) => {
    const contentId = tutorial.contentId
    const contentType = tutorial.contentType || 'ai_guided_tutorial'
    if (contentId) {
      const existing = (activeSessionsByContentId as any)[contentId]
      if (!existing) {
        dispatch(
          startLearningSession({
            contentId,
            contentType,
          })
        )
      } else {
        dispatch(
          recordLearningEvent({
            session_id: existing.sessionId,
            content_id: contentId,
            event_type: 'content_opened',
          })
        )
      }
      dispatch(
        recordRecommendationEvent({
          content_id: contentId,
          content_type: contentType,
          recommendation_source: 'learning_hub_home',
          event_type: 'clicked',
        })
      )
    }
    const target = resolveHubCardRoute(tutorial)
    persistHubRouteState(target, contentId, contentType)
    navigate(target, {
      state: {
        contentId,
        contentType,
      },
    })
  }

  const resolveContinueRoute = (contentId: string, recommendationMatch: any) => {
    if (!contentId || contentId.startsWith('learning-hub:')) return '/learning-hub'
    return resolveHubCardRoute(recommendationMatch || { contentId })
  }

  const continueItems = (inProgressContent || [])
    .map((item: any) => {
      const recommendationMatch =
        [...microCourses, ...tutorials].find((candidate: any) => candidate?.contentId === item.contentId) || null
      const route = resolveContinueRoute(item.contentId, recommendationMatch)
      return {
        ...item,
        title: recommendationMatch?.title || 'Continue learning',
        category: recommendationMatch?.category || '',
        difficulty: recommendationMatch?.difficulty || '',
        duration: recommendationMatch?.duration || '',
        contentType: item.contentType || recommendationMatch?.contentType || 'micro_course',
        route,
      }
    })
    .filter(Boolean)

  // Only show Continue Learning entries that still exist in the Learning Hub recommendations.
  const knownHubContentIds = new Set(
    [...(microCourses || []), ...(tutorials || [])]
      .map((c: any) => c?.contentId)
      .filter((id: any) => typeof id === 'string' && id.trim())
  )
  const filteredContinueItems = continueItems.filter(
    (c: any) => c?.contentId && knownHubContentIds.has(c.contentId)
  )

  const learningHubMode = home?.mode || 'cold_start'

  const handleResearchReadMore = (researchTitle: string) => {
    const researchRoutes: Record<string, string> = {
      "Hattie's Visible Learning: Effect sizes that matter": '/learning-hub/evidence-based-teaching',
      "Bloom's taxonomy in modern classrooms": '/learning-hub/blooms-taxonomy',
      'Formative assessment: What research says': '/learning-hub/assessment-research',
      'SEL & behavior: Restorative practices': '/learning-hub/sel-behavior-research',
      'Growth mindset: Dweck\'s research in practice': '/learning-hub/growth-mindset-research',
      'Cognitive load theory: Optimizing learning': '/learning-hub/cognitive-load-research',
      'Metacognition: Teaching students to think about thinking': '/learning-hub/metacognition-research',
      'Scaffolding instruction: Vygotsky\'s zone of proximal development': '/learning-hub/scaffolding-research',
    }
    const route = researchRoutes[researchTitle]
    if (route) {
      navigate(route)
    }
  }

  const handleStartPath = (rec: any) => {
    const allCards = [...(microCourses || []), ...(tutorials || [])]
    const fallbackCard = allCards[0] || null
    const mappedCard = rec?.contentId
      ? allCards.find((item: any) => item?.contentId === rec.contentId) || null
      : null
    const targetSource = mappedCard || rec || fallbackCard || {}
    const target = resolveHubCardRoute(targetSource)

    const contentId = mappedCard?.contentId || rec?.contentId
    const contentType = mappedCard?.contentType || rec?.contentType || 'micro_course'
    if (contentId) {
      const existing = (activeSessionsByContentId as any)[contentId]
      if (!existing) {
        dispatch(
          startLearningSession({
            contentId,
            contentType,
          })
        )
      } else {
        dispatch(
          recordLearningEvent({
            session_id: existing.sessionId,
            content_id: contentId,
            event_type: 'content_opened',
          })
        )
      }
      dispatch(
        recordRecommendationEvent({
          content_id: contentId,
          content_type: contentType,
          recommendation_source: 'learning_hub_growth_recommendations',
          event_type: 'clicked',
          event_metadata: {
            source_skill: rec?.skill || '',
          },
        })
      )
    }

    const targetRoute = target || '/learning-hub'
    if (contentId) persistHubRouteState(targetRoute, contentId, contentType)
    navigate(targetRoute, {
      state: {
        contentId: contentId || undefined,
        contentType,
      },
    })
  }

  const handleEnrollTrack = (trackTitle: string) => {
    if (trackTitle === 'STEM Mastery') {
      navigate('/learning-hub/stem-mastery')
    } else if (trackTitle === 'Literacy Expert') {
      navigate('/learning-hub/literacy-expert')
    }
  }

  return (
    <div className="space-y-10">
      {learningHubMode !== 'personalized' && (
        <section
          className={`rounded-3xl border p-4 shadow-sm ${
            learningHubMode === 'cold_start'
              ? 'border-amber-200 bg-amber-50'
              : 'border-blue-200 bg-blue-50'
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Info className={`mt-0.5 h-5 w-5 ${learningHubMode === 'cold_start' ? 'text-amber-600' : 'text-blue-600'}`} />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {learningHubMode === 'cold_start'
                    ? 'Tell us a bit about your teaching to personalize your learning.'
                    : 'We’re personalizing your Learning Hub based on your profile.'}
                </p>
                {learningHubMode === 'cold_start' && (
                  <p className="mt-1 text-sm text-gray-600">
                    Complete your teaching profile to unlock better recommendations.
                  </p>
                )}
              </div>
            </div>
            {learningHubMode === 'cold_start' && (
              <button
                onClick={() => navigate('/profile')}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-700 border border-amber-200 hover:bg-amber-100"
              >
                Complete profile
              </button>
            )}
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-8 py-10 text-white shadow-xl">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              <Sparkles className="h-4 w-4" /> Growth Hub
            </div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Grow as fast as your students — with the world's smartest professional learning hub for teachers.
            </h1>
            <p className="text-sm text-white/80">
              A personalized learning space where teachers access micro-courses, tutorials, research insights, and
              AI-driven growth recommendations — all tailored to your role, subject, and experience.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wide">
              <span className="rounded-full bg-white/15 px-3 py-1">Learn fast. Apply instantly.</span>
              <span className="rounded-full bg-white/15 px-3 py-1">Evidence-backed</span>
              <span className="rounded-full bg-white/15 px-3 py-1">AI-personalized</span>
            </div>
          </div>

          <div className="grid w-full max-w-md gap-4 rounded-2xl bg-white/10 p-6 text-white backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Your progress</p>
              <p className="mt-2 text-3xl font-semibold">{loading ? '—' : progressStats.coursesCompleted} courses</p>
              <p className="text-xs text-white/70">{loading ? 'Loading...' : `${progressStats.hoursLogged} PD hours completed`}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Certificates earned</p>
              <p className="mt-2 text-3xl font-semibold">{loading ? '—' : progressStats.certificatesEarned}</p>
              <p className="text-xs text-white/70">Ready for appraisals & portfolios</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Learning streak</p>
              <p className="mt-2 text-3xl font-semibold">{loading ? '—' : progressStats.currentStreak} days</p>
              <p className="text-xs text-white/70">Keep the momentum going!</p>
            </div>
          </div>
        </div>
      </section>

      {filteredContinueItems.length > 0 && (
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Zap className="h-5 w-5 text-amber-500" /> Continue Learning
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Pick up where you left off.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {filteredContinueItems.map((item: any) => (
              <div
                key={item.contentId}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-amber-200 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {item.category && (
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                          {item.category}
                        </p>
                      )}
                      {item.duration && <span className="text-xs text-gray-500">• {item.duration}</span>}
                      {item.difficulty && <span className="text-xs text-gray-500">• {item.difficulty}</span>}
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">{item.title}</h3>
                    <div className="mt-3">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-amber-500 transition-all"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{Math.round(item.progressPercent)}% complete</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!item.contentId || item.contentId.startsWith('learning-hub:')) {
                        navigate('/learning-hub')
                        return
                      }
                      const target = item.route || '/learning-hub'
                      if (item.contentId) {
                        persistHubRouteState(target, item.contentId, item.contentType || 'micro_course')
                      }
                      navigate(target, {
                        state: {
                          contentId: item.contentId,
                          contentType: item.contentType || 'micro_course',
                        },
                      })
                    }}
                    className="rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-100 transition"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Zap className="h-5 w-5 text-amber-500" /> Personalized micro-courses
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Short 5–10 minute learning units generated by AI, aligned to your needs.
                </p>
              </div>
              <button className="text-xs font-semibold uppercase tracking-wide text-amber-600 hover:text-amber-500">
                View all
              </button>
            </div>

            {error && (
              <p className="mt-2 text-sm text-amber-600">{error}</p>
            )}
            <div className="mt-6 space-y-4">
              {loading && microCourses.length === 0 ? (
                <p className="text-sm text-gray-500">Loading recommendations...</p>
              ) : (
                microCourses.map((course) => (
                  <div
                    key={course.contentId || course.title}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-amber-200 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">{course.category}</p>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{course.duration}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{course.difficulty}</span>
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">{course.title}</h3>
                        {course.progress > 0 && (
                          <div className="mt-3">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full bg-amber-500 transition-all"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">{course.progress}% complete</p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleCourseStart(course)}
                        className="rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-100 transition"
                      >
                        {course.progress === 0 ? 'Start' : course.progress === 100 ? 'Review' : 'Continue'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Play className="h-5 w-5 text-blue-500" /> AI-guided tutorials & demonstrations
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Step-by-step walkthroughs showing how to use templates effectively and apply best practices.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {loading && tutorials.length === 0 ? (
                <p className="text-sm text-gray-500">Loading tutorials...</p>
              ) : (
                tutorials.map((tutorial) => (
                  <div
                    key={tutorial.contentId || tutorial.title}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Play className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{tutorial.type}</p>
                        <h3 className="mt-1 text-sm font-semibold text-gray-900">{tutorial.title}</h3>
                        <p className="mt-1 text-xs text-gray-500">{tutorial.duration}</p>
                      </div>
                    </div>
                    {tutorial.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <button
                        onClick={() => handleTutorialWatch(tutorial)}
                        className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
                      >
                        Watch
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                <Target className="h-4 w-4 text-amber-500" /> AI growth recommendations
              </h3>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Based on your usage, here are the 3 skills that will improve your teaching impact right now.
            </p>

            {loading && aiRecommendations.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">Loading recommendations...</p>
            ) : (
            <div className="mt-4 space-y-4">
              {aiRecommendations.map((rec, idx) => (
                <div key={idx} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Skill {idx + 1}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        rec.impact === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {rec.impact} impact
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-gray-900">{rec.skill}</h4>
                  <p className="mt-1 text-xs text-gray-600">{rec.reason}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{rec.estimatedTime}</span>
                    <button
                      onClick={() => handleStartPath(rec)}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-500 transition"
                    >
                      Start path
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                <Award className="h-4 w-4 text-green-500" /> Certificates & progress
              </h3>
            </div>

            <div className="mt-4 space-y-3">
              {certificates.length === 0 && !loading ? (
                <p className="text-xs text-gray-500">No certificates yet. Complete courses to earn them.</p>
              ) : (
              certificates.map((cert) => (
                <div key={cert.name} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{cert.badge}</p>
                      <h4 className="mt-1 text-sm font-semibold text-gray-900">{cert.name}</h4>
                      <p className="mt-1 text-xs text-gray-500">
                        {cert.date} • {cert.hours} PD hours
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-green-500" />
                  </div>
                </div>
              ))
              )}
            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Yearly growth report</p>
              <p className="mt-2 text-sm text-gray-700">
                Download your complete evidence log of completed training for appraisals and portfolios.
              </p>
              <button className="mt-3 w-full rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-gray-800">
                Export report
              </button>
            </div>
          </div>
        </aside>
      </section>

      {/* Research insights library - Full width section */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FileText className="h-5 w-5 text-purple-500" /> Research insights library
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Simplified, teacher-friendly summaries of top educational research — evidence-backed teaching in
              minutes.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {researchInsights.map((insight) => (
            <div
              key={insight.title}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-purple-200 hover:shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">{insight.topic}</p>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">{insight.title}</h3>
              <p className="mt-2 text-xs text-gray-600">{insight.summary}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">{insight.readTime} read</span>
                <button
                  onClick={() => handleResearchReadMore(insight.title)}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-500 transition"
                >
                  Read more
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <GraduationCap className="h-5 w-5 text-indigo-500" /> Specialist deep-dive tracks
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Advanced structured tracks for building niche expertise. Build a niche. Grow your expertise.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {specialistTracks.map((track) => (
            <div
              key={track.title}
              className={`rounded-2xl border p-4 transition ${
                track.enrolled
                  ? 'border-indigo-200 bg-indigo-50'
                  : 'border-gray-100 bg-gray-50 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Specialist track</p>
                {track.enrolled && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                    Enrolled
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">{track.title}</h3>
              <p className="mt-2 text-xs text-gray-600">{track.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>{track.modules} modules</span>
                <span>{track.duration}</span>
              </div>
              <button
                onClick={() => handleEnrollTrack(track.title)}
                className={`mt-4 w-full rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  track.enrolled
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                {track.enrolled ? 'Continue track' : 'Enroll now'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Coming soon</p>
            <h2 className="text-2xl font-semibold">Community Q&A</h2>
            <p className="text-sm text-white/75">
              Teachers can ask questions, share tips, get solutions — AI moderates and assists. Connect with educators
              worldwide.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:bg-white/10">
            <Users className="h-4 w-4" /> Join waitlist
          </button>
        </div>
      </section>
    </div>
  )
}

export default ProfessionalLearningHub
