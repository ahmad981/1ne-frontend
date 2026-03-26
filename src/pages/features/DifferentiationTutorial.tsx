import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Users,
  Target,
  Lightbulb,
  Brain,
  BookOpen,
  FileText,
  Video,
  Download,
  Share2,
  Star,
  MessageSquare,
  Eye,
  BarChart3,
  Award,
  X,
  SkipForward,
  SkipBack,
  Volume2,
  AlertTriangle,
} from 'lucide-react'
import { useTutorialProgress } from '../../hooks/useTutorialProgress'
import { TutorialMediaEmbed } from '../../components/learningHub/TutorialMediaEmbed'
import axiosInstance from '../../redux/http'
import { parseTutorialStepsFromRegistry } from '../../utils/learningHubGeneratedContent'

interface TutorialStep {
  id: number
  title: string
  duration: string
  content: {
    type: 'video' | 'text' | 'interactive' | 'example'
    data: any
  }
  keyTakeaways: string[]
  reflection: string
}

interface ClassroomExample {
  scenario: string
  challenge: string
  differentiationStrategy: string
  implementation: string[]
  results: string
  studentFeedback: string[]
}

const DifferentiationTutorial = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const contentId =
    (location.state as { contentId?: string } | null)?.contentId ||
    'ui-tutorial-differentiation-in-action'
  const [showTranscript, setShowTranscript] = useState(false)

  const staticTutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: 'Introduction: Understanding Differentiation',
      duration: '3 min',
      content: {
        type: 'video',
        data: {
          videoUrl: 'https://www.youtube.com/watch?v=J1uh-BzOSxw',
          description: 'Learn the fundamentals of differentiation and why it matters in today\'s diverse classrooms.',
          keyPoints: [
            'Differentiation is not about creating different lessons for each student',
            'It\'s about providing multiple pathways to learning',
            'Focus on content, process, product, and learning environment',
            'All students work toward the same learning goals',
          ],
        },
      },
      keyTakeaways: [
        'Differentiation is a mindset, not a set of activities',
        'It requires knowing your students deeply',
        'Flexibility and responsiveness are key',
      ],
      reflection: 'Think about a time when you adjusted your teaching for a student. What did you change and why?',
    },
    {
      id: 2,
      title: 'Case Study: Ms. Rodriguez\'s 5th Grade Class',
      duration: '5 min',
      content: {
        type: 'example',
        data: {
          classroom: {
            grade: 5,
            subject: 'Mathematics - Fractions',
            students: 24,
            diversity: 'Mixed ability levels, 3 ELL students, 2 students with IEPs',
          },
          challenge: 'Teaching equivalent fractions to a class with varying levels of understanding',
          approach: 'Tiered activities with multiple entry points',
        },
      },
      keyTakeaways: [
        'Start with pre-assessment to understand student readiness',
        'Design activities at 3-4 different complexity levels',
        'All students work on the same concept but at appropriate levels',
      ],
      reflection: 'How would you assess student readiness before planning differentiated activities?',
    },
    {
      id: 3,
      title: 'Strategy 1: Content Differentiation',
      duration: '4 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Varying what students learn based on readiness, interest, or learning profile',
          examples: [
            {
              scenario: 'Teaching the American Revolution',
              tier1: 'Students read simplified text with key vocabulary highlighted',
              tier2: 'Students read grade-level text with guided questions',
              tier3: 'Students read primary source documents and analyze multiple perspectives',
            },
          ],
          implementation: [
            'Use pre-assessment to determine student readiness',
            'Create materials at different complexity levels',
            'Ensure all materials address the same learning objectives',
            'Provide choice when possible',
          ],
        },
      },
      keyTakeaways: [
        'Content differentiation doesn\'t mean different topics',
        'Use varied texts, resources, and materials',
        'Maintain high expectations for all students',
      ],
      reflection: 'What resources do you currently use that could be adapted for different readiness levels?',
    },
    {
      id: 4,
      title: 'Strategy 2: Process Differentiation',
      duration: '4 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Varying how students make sense of the content',
          examples: [
            {
              scenario: 'Learning about the water cycle',
              visual: 'Students create diagrams and flowcharts',
              kinesthetic: 'Students act out the water cycle process',
              auditory: 'Students listen to and discuss a podcast',
              reading: 'Students read and annotate scientific articles',
            },
          ],
          implementation: [
            'Identify multiple ways to explore the same concept',
            'Provide learning centers or stations',
            'Offer choice in how students process information',
            'Use flexible grouping strategies',
          ],
        },
      },
      keyTakeaways: [
        'Different learning styles require different processes',
        'Flexible grouping allows for peer learning',
        'Process differentiation increases engagement',
      ],
      reflection: 'Which learning styles are most common in your classroom? How can you address them?',
    },
    {
      id: 5,
      title: 'Strategy 3: Product Differentiation',
      duration: '3 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Varying how students demonstrate their learning',
          examples: [
            'Written essay or report',
            'Multimedia presentation',
            'Artistic representation',
            'Oral presentation or debate',
            'Performance or demonstration',
            'Portfolio of work',
          ],
          rubrics: 'Use the same rubric criteria but allow different formats',
        },
      },
      keyTakeaways: [
        'Product differentiation honors different strengths',
        'Students can demonstrate understanding in authentic ways',
        'Clear rubrics ensure fairness across different products',
      ],
      reflection: 'What product options could you offer for your next unit?',
    },
    {
      id: 6,
      title: 'Real Classroom Implementation',
      duration: '5 min',
      content: {
        type: 'example',
        data: {
          examples: [
            {
              scenario: 'Teaching persuasive writing',
              challenge: 'Students have varying writing abilities and interests',
              differentiationStrategy: 'Tiered writing prompts with choice',
              implementation: [
                'Tier 1: Write a letter to the principal about a school issue',
                'Tier 2: Write an opinion article for the school newspaper',
                'Tier 3: Write a persuasive speech on a current event',
              ],
              results: '95% of students met or exceeded learning objectives',
              studentFeedback: [
                'I liked choosing my own topic',
                'The prompts helped me know what to write',
                'I felt challenged but not overwhelmed',
              ],
            },
            {
              scenario: 'Science experiment on plant growth',
              challenge: 'Mixed ability levels and language barriers',
              differentiationStrategy: 'Multiple entry points and language supports',
              implementation: [
                'Visual instructions with pictures for all students',
                'Simplified data collection sheets for emerging learners',
                'Extended analysis questions for advanced learners',
                'Bilingual vocabulary cards available',
              ],
              results: 'All students successfully completed the experiment',
              studentFeedback: [
                'The pictures helped me understand',
                'I could work at my own pace',
                'I learned new vocabulary',
              ],
            },
          ],
        },
      },
      keyTakeaways: [
        'Differentiation works best when planned intentionally',
        'Student choice increases motivation',
        'Multiple entry points ensure all students can participate',
      ],
      reflection: 'Which of these strategies could you implement in your classroom this week?',
    },
    {
      id: 7,
      title: 'Assessment and Monitoring',
      duration: '3 min',
      content: {
        type: 'text',
        data: {
          strategies: [
            'Use ongoing formative assessment to adjust instruction',
            'Track individual student progress toward learning goals',
            'Use exit tickets to check understanding',
            'Confer with students regularly',
            'Adjust groups and activities based on data',
          ],
          tools: [
            'Pre-assessments before new units',
            'Quick checks during lessons',
            'Student self-assessments',
            'Portfolio reviews',
            'Observation notes',
          ],
        },
      },
      keyTakeaways: [
        'Assessment drives differentiation decisions',
        'Regular check-ins help adjust instruction',
        'Students should be involved in monitoring their progress',
      ],
      reflection: 'How do you currently assess student understanding? How could you make it more frequent?',
    },
    {
      id: 8,
      title: 'Common Challenges and Solutions',
      duration: '4 min',
      content: {
        type: 'text',
        data: {
          challenges: [
            {
              challenge: 'Time management',
              solution: 'Start small with one subject or one strategy. Use station rotations to manage multiple activities.',
            },
            {
              challenge: 'Planning complexity',
              solution: 'Use templates and frameworks. Plan with colleagues. Reuse and adapt successful activities.',
            },
            {
              challenge: 'Student resistance',
              solution: 'Explain the "why" behind differentiation. Start with choice to build buy-in.',
            },
            {
              challenge: 'Grading fairness',
              solution: 'Use clear rubrics with the same criteria. Focus on growth and progress.',
            },
          ],
        },
      },
      keyTakeaways: [
        'Start small and build gradually',
        'Collaborate with colleagues',
        'Be transparent with students about differentiation',
      ],
      reflection: 'What challenges do you anticipate? How will you address them?',
    },
    {
      id: 9,
      title: 'Action Plan: Your Next Steps',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          steps: [
            'Identify one unit or lesson to differentiate',
            'Choose one differentiation strategy to try',
            'Plan activities for 2-3 readiness levels',
            'Prepare materials and resources',
            'Implement and observe',
            'Reflect and adjust',
          ],
          resources: [
            'Differentiation planning template',
            'Pre-assessment examples',
            'Tiered activity examples',
            'Rubric templates',
          ],
        },
      },
      keyTakeaways: [
        'Start with one strategy in one subject',
        'Reflection is key to improvement',
        'Build your differentiation toolkit gradually',
      ],
      reflection: 'What is your first step toward implementing differentiation in your classroom?',
    },
  ]

  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>(staticTutorialSteps)

  useEffect(() => {
    const shouldFetch = typeof contentId === 'string' && contentId.startsWith('factory-')
    if (!shouldFetch) {
      setTutorialSteps(staticTutorialSteps)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/content-registry/by-content-id/${encodeURIComponent(contentId)}`)
        const parsed = parseTutorialStepsFromRegistry(res?.data)
        if (!cancelled && Array.isArray(parsed) && parsed.length > 0) {
          setTutorialSteps(parsed as TutorialStep[])
        } else if (!cancelled) {
          setTutorialSteps(staticTutorialSteps)
        }
      } catch {
        if (!cancelled) setTutorialSteps(staticTutorialSteps)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [contentId])

  const {
    currentStep,
    completedSteps,
    hydrated,
    setStep,
    goNext,
    goPrev,
    finishTutorial,
  } = useTutorialProgress({
    contentId,
    contentType: 'ai_guided_tutorial',
    totalSteps: tutorialSteps.length,
  })

  const currentStepData = tutorialSteps[currentStep]
  const progress = ((completedSteps.length + (currentStep > 0 ? 1 : 0)) / tutorialSteps.length) * 100

  const handleNext = () => {
    if (currentStep >= tutorialSteps.length - 1) {
      void finishTutorial().then(() => navigate('/learning-hub'))
      return
    }
    goNext()
  }

  const handlePrevious = () => {
    goPrev()
  }

  const handleStepClick = (stepIndex: number) => {
    setStep(stepIndex)
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-600">
        Restoring your tutorial progress…
      </div>
    )
  }

  return (
    <div className="space-y-6" data-page-kind="tutorial" data-content-id={contentId || ''} data-content-type="ai_guided_tutorial">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/learning-hub')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    Case Study
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm">{currentStepData.duration}</span>
                </div>
                <h1 className="text-3xl font-bold">Real Classroom: Differentiation in Action</h1>
                <p className="mt-2 text-blue-100">
                  Step-by-step walkthrough showing how to implement differentiation strategies effectively
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Progress: {Math.round(progress)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Step Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Tutorial Steps</h3>
            <div className="space-y-2">
              {tutorialSteps.map((step, idx) => {
                const isActive = idx === currentStep
                const isCompleted = completedSteps.includes(idx)

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(idx)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      isActive
                        ? 'bg-blue-50 border-2 border-blue-300'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-semibold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${
                          isActive ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{step.duration}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {/* Step Header */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
                    <span>•</span>
                    <span>{currentStepData.duration}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Based on Type */}
            {currentStepData.content.type === 'video' && (
              <div className="space-y-6">
                <TutorialMediaEmbed
                  videoUrl={currentStepData.content.data.videoUrl}
                  title={currentStepData.title}
                />

                {currentStepData.content.data.description && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Video</h3>
                    <p className="text-sm text-gray-700">{currentStepData.content.data.description}</p>
                  </div>
                )}

                {currentStepData.content.data.keyPoints && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {currentStepData.content.data.keyPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {currentStepData.content.type === 'example' && (
              <div className="space-y-6">
                {currentStepData.content.data.examples ? (
                  currentStepData.content.data.examples.map((example: ClassroomExample, idx: number) => (
                    <div key={idx} className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{example.scenario}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full bg-white text-indigo-700 text-xs font-semibold">
                            {example.challenge}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Differentiation Strategy</h4>
                        <p className="text-gray-900 font-medium">{example.differentiationStrategy}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Implementation</h4>
                        <ul className="space-y-2">
                          {example.implementation.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                                {itemIdx + 1}
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-4 bg-white rounded-lg p-4 border border-indigo-200">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Results</h4>
                        <p className="text-gray-900">{example.results}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Student Feedback</h4>
                        <div className="space-y-2">
                          {example.studentFeedback.map((feedback, feedbackIdx) => (
                            <div key={feedbackIdx} className="bg-white rounded-lg p-3 border border-indigo-200">
                              <div className="flex items-start gap-2">
                                <MessageSquare className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700 italic">"{feedback}"</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Classroom Context</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Grade</p>
                          <p className="text-sm font-semibold text-gray-900">{currentStepData.content.data.classroom.grade}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Subject</p>
                          <p className="text-sm font-semibold text-gray-900">{currentStepData.content.data.classroom.subject}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Students</p>
                          <p className="text-sm font-semibold text-gray-900">{currentStepData.content.data.classroom.students}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Diversity</p>
                          <p className="text-sm font-semibold text-gray-900">{currentStepData.content.data.classroom.diversity}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Challenge</h3>
                      <p className="text-gray-700">{currentStepData.content.data.challenge}</p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Approach</h3>
                      <p className="text-gray-700">{currentStepData.content.data.approach}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStepData.content.type === 'interactive' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  {currentStepData.content.data.strategy && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">{currentStepData.content.data.strategy}</h3>
                  )}
                  
                  {/* Handle examples that are objects (with scenario property) */}
                  {currentStepData.content.data.examples && 
                   Array.isArray(currentStepData.content.data.examples) && 
                   currentStepData.content.data.examples.length > 0 &&
                   typeof currentStepData.content.data.examples[0] === 'object' &&
                   currentStepData.content.data.examples[0].scenario && (
                    <div className="space-y-4 mb-6">
                      {currentStepData.content.data.examples.map((example: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-lg p-5 border border-purple-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">{example.scenario}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {example.tier1 && (
                              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <p className="text-xs font-semibold text-blue-700 mb-1">Tier 1</p>
                                <p className="text-sm text-gray-700">{example.tier1}</p>
                              </div>
                            )}
                            {example.tier2 && (
                              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <p className="text-xs font-semibold text-green-700 mb-1">Tier 2</p>
                                <p className="text-sm text-gray-700">{example.tier2}</p>
                              </div>
                            )}
                            {example.tier3 && (
                              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                <p className="text-xs font-semibold text-purple-700 mb-1">Tier 3</p>
                                <p className="text-sm text-gray-700">{example.tier3}</p>
                              </div>
                            )}
                            {example.visual && (
                              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                                <p className="text-xs font-semibold text-amber-700 mb-1">Visual Learner</p>
                                <p className="text-sm text-gray-700">{example.visual}</p>
                              </div>
                            )}
                            {example.kinesthetic && (
                              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                                <p className="text-xs font-semibold text-red-700 mb-1">Kinesthetic Learner</p>
                                <p className="text-sm text-gray-700">{example.kinesthetic}</p>
                              </div>
                            )}
                            {example.auditory && (
                              <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                                <p className="text-xs font-semibold text-cyan-700 mb-1">Auditory Learner</p>
                                <p className="text-sm text-gray-700">{example.auditory}</p>
                              </div>
                            )}
                            {example.reading && (
                              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                                <p className="text-xs font-semibold text-indigo-700 mb-1">Reading/Writing Learner</p>
                                <p className="text-sm text-gray-700">{example.reading}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Handle examples that are strings (product options) */}
                  {currentStepData.content.data.examples && 
                   Array.isArray(currentStepData.content.data.examples) && 
                   currentStepData.content.data.examples.length > 0 &&
                   typeof currentStepData.content.data.examples[0] === 'string' && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Product Options</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {currentStepData.content.data.examples.map((option: string, optIdx: number) => (
                          <div key={optIdx} className="bg-white rounded-lg p-4 border border-purple-200 text-sm text-gray-700 shadow-sm hover:shadow-md transition">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                              <span>{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rubrics info */}
                  {currentStepData.content.data.rubrics && (
                    <div className="mb-6 bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Rubric Guidelines</h4>
                      <p className="text-sm text-gray-700">{currentStepData.content.data.rubrics}</p>
                    </div>
                  )}

                  {currentStepData.content.data.implementation && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Implementation Steps</h4>
                      <ul className="space-y-2">
                        {currentStepData.content.data.implementation.map((step: string, stepIdx: number) => (
                          <li key={stepIdx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentStepData.content.data.steps && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Action Steps</h4>
                      <ol className="space-y-2">
                        {currentStepData.content.data.steps.map((step: string, stepIdx: number) => (
                          <li key={stepIdx} className="flex items-start gap-3 text-sm text-gray-700">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                              {stepIdx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {currentStepData.content.data.resources && (
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Resources</h4>
                      <ul className="space-y-2">
                        {currentStepData.content.data.resources.map((resource: string, resIdx: number) => (
                          <li key={resIdx} className="flex items-center gap-2 text-sm text-gray-700">
                            <Download className="h-4 w-4 text-purple-600" />
                            <span>{resource}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStepData.content.type === 'text' && (
              <div className="space-y-6">
                {currentStepData.content.data.strategies && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategies</h3>
                    <ul className="space-y-3">
                      {currentStepData.content.data.strategies.map((strategy: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentStepData.content.data.tools && (
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Tools</h3>
                    <ul className="space-y-2">
                      {currentStepData.content.data.tools.map((tool: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span>{tool}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentStepData.content.data.challenges && (
                  <div className="space-y-4">
                    {currentStepData.content.data.challenges.map((challenge: any, idx: number) => (
                      <div key={idx} className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                        <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                          {challenge.challenge}
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-amber-200 mt-3">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Solution:</p>
                          <p className="text-sm text-gray-700">{challenge.solution}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!currentStepData.content.data.strategies && 
                 !currentStepData.content.data.tools && 
                 !currentStepData.content.data.challenges && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                    <p className="text-sm text-gray-600">Content coming soon...</p>
                  </div>
                )}
              </div>
            )}

            {/* Fallback for any unhandled content types */}
            {currentStepData.content.type !== 'video' && 
             currentStepData.content.type !== 'example' && 
             currentStepData.content.type !== 'interactive' && 
             currentStepData.content.type !== 'text' && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <p className="text-sm text-gray-600">Content type not recognized. Please contact support.</p>
              </div>
            )}

            {/* Key Takeaways */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                Key Takeaways
              </h3>
              <ul className="space-y-2">
                {currentStepData.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reflection Prompt */}
            <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                Reflection
              </h3>
              <p className="text-gray-700 mb-4">{currentStepData.reflection}</p>
              <textarea
                placeholder="Type your reflection here..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Star className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Complete tutorial' : 'Next step'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Completion Message */}
          {currentStep === tutorialSteps.length - 1 && completedSteps.includes(currentStep) && (
            <div className="mt-6 rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h3>
              <p className="text-gray-700 mb-6">You've completed the Differentiation in Action tutorial.</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate('/learning-hub')}
                  className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Back to Learning Hub
                </button>
                <button className="rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Download Certificate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DifferentiationTutorial

