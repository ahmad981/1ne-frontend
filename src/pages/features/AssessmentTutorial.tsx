import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Users,
  Target,
  Lightbulb,
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
  Maximize2,
  Settings,
  ClipboardCheck,
  TrendingUp,
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

const AssessmentTutorial = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showTranscript, setShowTranscript] = useState(false)

  const staticTutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: 'Introduction: The Purpose of Assessment',
      duration: '2 min',
      content: {
        type: 'video',
        data: {
          videoUrl: 'https://www.youtube.com/watch?v=D5adh67I4es',
          description: 'Understand the fundamental purposes of assessment and how effective assessments drive student learning.',
          keyPoints: [
            'Assessment informs instruction and guides learning',
            'Formative assessment happens during learning',
            'Summative assessment evaluates learning at the end',
            'Good assessments align with learning objectives',
            'Assessment should be fair, valid, and reliable',
          ],
        },
      },
      keyTakeaways: [
        'Assessment is a tool for learning, not just evaluation',
        'Different types serve different purposes',
        'Alignment with objectives is critical',
      ],
      reflection: 'What is the primary purpose of assessment in your classroom?',
    },
    {
      id: 2,
      title: 'Understanding Assessment Types',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Know when and how to use formative vs summative assessments',
          examples: [
            {
              scenario: 'Formative Assessment Examples',
              assessments: [
                'Exit tickets',
                'Thumbs up/down',
                'Quick quizzes',
                'Observations',
                'Student self-assessments',
                'Peer feedback',
              ],
              purpose: 'To check understanding during instruction and adjust teaching',
            },
            {
              scenario: 'Summative Assessment Examples',
              assessments: [
                'Unit tests',
                'Final projects',
                'End-of-term exams',
                'Portfolio reviews',
                'Performance assessments',
              ],
              purpose: 'To evaluate learning at the end of a unit or period',
            },
          ],
          implementation: [
            'Use formative assessment frequently during instruction',
            'Use summative assessment at natural endpoints',
            'Balance both types throughout the year',
            'Ensure summative assessments reflect what was taught',
          ],
        },
      },
      keyTakeaways: [
        'Formative = during learning, Summative = after learning',
        'Both types are essential',
        'Frequency matters more for formative',
      ],
      reflection: 'What types of assessments do you currently use? Are they balanced?',
    },
    {
      id: 3,
      title: 'Aligning Assessments with Learning Objectives',
      duration: '2 min',
      content: {
        type: 'text',
        data: {
          strategies: [
            'Every assessment should measure specific learning objectives',
            'Match the cognitive level of the objective',
            'If the objective is "analyze," the assessment should require analysis',
            'Use Bloom\'s Taxonomy to ensure alignment',
            'Avoid assessing things you didn\'t teach',
          ],
          tools: [
            'Alignment Checklist:',
            '✓ Does the assessment measure the stated objective?',
            '✓ Is the cognitive level appropriate?',
            '✓ Can students demonstrate mastery through this assessment?',
            '✓ Have students had opportunities to practice this skill?',
            '',
            'Bloom\'s Taxonomy Levels:',
            '- Remember: Multiple choice, fill-in-the-blank',
            '- Understand: Explain, summarize, describe',
            '- Apply: Solve problems, use in new situations',
            '- Analyze: Compare, contrast, examine',
            '- Evaluate: Judge, critique, justify',
            '- Create: Design, construct, produce',
          ],
        },
      },
      keyTakeaways: [
        'Alignment ensures validity',
        'Match cognitive levels',
        'Assess what you taught',
      ],
      reflection: 'Review a recent assessment. Does it align with your learning objectives?',
    },
    {
      id: 4,
      title: 'Creating Effective Questions',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Design questions that accurately measure understanding',
          examples: [
            {
              scenario: 'Multiple Choice Questions',
              good: 'Which of the following best explains why plants need sunlight?',
              bad: 'Do plants need sunlight?',
              tip: 'Avoid yes/no questions. Use "which best" to require deeper thinking',
            },
            {
              scenario: 'Short Answer Questions',
              good: 'Explain how photosynthesis converts sunlight into energy. Include the role of chlorophyll.',
              bad: 'What is photosynthesis?',
              tip: 'Be specific about what you want students to explain',
            },
            {
              scenario: 'Essay Questions',
              good: 'Compare and contrast the water cycle and the carbon cycle. Include at least three similarities and three differences.',
              bad: 'Write about cycles.',
              tip: 'Provide clear structure and expectations',
            },
          ],
          implementation: [
            'Use clear, unambiguous language',
            'Avoid trick questions',
            'Ensure questions are grade-level appropriate',
            'Include specific criteria for open-ended questions',
            'Test one concept per question when possible',
          ],
        },
      },
      keyTakeaways: [
        'Clarity prevents confusion',
        'Specific questions get better answers',
        'Avoid trick questions',
      ],
      reflection: 'Rewrite one of your assessment questions to be more specific and clear.',
    },
    {
      id: 5,
      title: 'Rubric Design Best Practices',
      duration: '2 min',
      content: {
        type: 'text',
        data: {
          strategies: [
            'Rubrics clarify expectations for students and teachers',
            'Use 3-4 performance levels (e.g., Exceeds, Meets, Approaching, Below)',
            'Describe what each level looks like',
            'Focus on learning objectives, not effort or behavior',
            'Use student-friendly language',
            'Share rubrics before assessment',
          ],
          tools: [
            'Rubric Components:',
            '1. Criteria: What is being assessed',
            '2. Performance Levels: Different levels of achievement',
            '3. Descriptors: What each level looks like',
            '',
            'Example Criteria for Writing:',
            '- Content and Ideas',
            '- Organization',
            '- Word Choice',
            '- Conventions',
            '',
            'Performance Level Example:',
            'Meets: "Writing includes clear main idea with supporting details. Organization is logical with transitions."',
          ],
        },
      },
      keyTakeaways: [
        'Rubrics make expectations clear',
        'Focus on learning, not behavior',
        'Share rubrics in advance',
      ],
      reflection: 'Do you use rubrics? How could they improve your assessments?',
    },
    {
      id: 6,
      title: 'Formative Assessment Strategies',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Implement quick, effective formative assessments',
          examples: [
            {
              scenario: 'Quick Checks',
              strategies: [
                'Thumbs up/down/sideways',
                'Traffic light cards (red/yellow/green)',
                'One-minute papers',
                'Think-pair-share',
                'Whiteboard responses',
              ],
            },
            {
              scenario: 'Exit Tickets',
              strategies: [
                'What was the main idea?',
                'What question do you still have?',
                'Rate your understanding 1-5',
                'One thing you learned, one thing you\'re confused about',
              ],
            },
            {
              scenario: 'Self-Assessment',
              strategies: [
                'Rate your confidence level',
                'What did you do well?',
                'What do you need to work on?',
                'Set a goal for next time',
              ],
            },
          ],
          implementation: [
            'Use formative assessment 3-5 times per lesson',
            'Keep it quick (1-3 minutes)',
            'Use the information immediately',
            'Make it low-stakes',
            'Vary your methods',
          ],
        },
      },
      keyTakeaways: [
        'Frequency matters',
        'Keep it quick and simple',
        'Use results to adjust instruction',
      ],
      reflection: 'Which formative assessment strategy will you try this week?',
    },
    {
      id: 7,
      title: 'Summative Assessment Best Practices',
      duration: '2 min',
      content: {
        type: 'text',
        data: {
          strategies: [
            'Summative assessments should reflect cumulative learning',
            'Use a variety of assessment types',
            'Allow students to demonstrate learning in multiple ways',
            'Provide clear instructions and expectations',
            'Ensure assessments are fair and accessible',
            'Give students opportunities to prepare',
          ],
          tools: [
            'Assessment Variety:',
            '- Written tests and quizzes',
            '- Projects and presentations',
            '- Portfolios',
            '- Performance tasks',
            '- Oral assessments',
            '',
            'Fairness Checklist:',
            '✓ All students have access to necessary resources',
            '✓ Instructions are clear and unambiguous',
            '✓ Time limits are reasonable',
            '✓ Accommodations are provided when needed',
            '✓ Assessment measures learning, not test-taking skills',
          ],
        },
      },
      keyTakeaways: [
        'Variety shows different strengths',
        'Fairness is essential',
        'Preparation opportunities matter',
      ],
      reflection: 'How do you ensure your summative assessments are fair?',
    },
    {
      id: 8,
      title: 'Providing Effective Feedback',
      duration: '2 min',
      content: {
        type: 'example',
        data: {
          classroom: {
            grade: 7,
            subject: 'English Language Arts',
            students: 28,
            diversity: 'Mixed abilities, various writing levels',
          },
          challenge: 'Providing feedback that helps students improve without overwhelming them',
          approach: 'Using specific, actionable feedback focused on learning objectives',
        },
      },
      keyTakeaways: [
        'Feedback should be specific and actionable',
        'Focus on learning, not just grades',
        'Timely feedback is more effective',
      ],
      reflection: 'What makes feedback effective in your experience?',
    },
    {
      id: 9,
      title: 'Common Mistakes to Avoid',
      duration: '1 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Learn from common assessment pitfalls',
          steps: [
            'Avoid assessing things you didn\'t teach',
            'Don\'t use trick questions or ambiguous wording',
            'Avoid over-testing or under-assessing',
            'Don\'t rely solely on one assessment type',
            'Avoid grading on effort or behavior instead of learning',
            'Don\'t wait too long to provide feedback',
            'Avoid assessments that only test memorization',
          ],
          resources: [
            'Assessment design checklist',
            'Question quality rubric',
            'Feedback templates',
            'Rubric examples',
          ],
        },
      },
      keyTakeaways: [
        'Learn from mistakes',
        'Keep assessments focused on learning',
        'Balance is key',
      ],
      reflection: 'What assessment mistakes have you made? How will you avoid them in the future?',
    },
  ]

  const contentId =
    (location.state as { contentId?: string } | null)?.contentId ||
    'ui-tutorial-creating-effective-assessments'
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
                    Best practices
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm">15 min</span>
                </div>
                <h1 className="text-3xl font-bold">Creating Effective Assessments</h1>
                <p className="mt-2 text-blue-100">
                  Master the art of designing assessments that accurately measure learning and drive student improvement
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
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

            {currentStepData.content.type === 'interactive' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  {currentStepData.content.data.strategy && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">{currentStepData.content.data.strategy}</h3>
                  )}
                  
                  {currentStepData.content.data.examples && 
                   Array.isArray(currentStepData.content.data.examples) && 
                   currentStepData.content.data.examples.length > 0 &&
                   typeof currentStepData.content.data.examples[0] === 'object' &&
                   currentStepData.content.data.examples[0].scenario && (
                    <div className="space-y-4 mb-6">
                      {currentStepData.content.data.examples.map((example: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-lg p-5 border border-blue-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">{example.scenario}</h4>
                          <div className="space-y-3">
                            {example.assessments && (
                              <div>
                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Examples</p>
                                <ul className="space-y-1">
                                  {example.assessments.map((assessment: string, assIdx: number) => (
                                    <li key={assIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                      <span>{assessment}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {example.purpose && (
                              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs font-semibold text-blue-800 mb-1">Purpose</p>
                                <p className="text-sm text-blue-700">{example.purpose}</p>
                              </div>
                            )}
                            {example.good && (
                              <div>
                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Good Example</p>
                                <div className="p-3 bg-green-50 rounded-lg border border-green-200 mb-2">
                                  <p className="text-sm text-gray-700">{example.good}</p>
                                </div>
                                {example.bad && (
                                  <>
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 mt-3">Poor Example</p>
                                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                      <p className="text-sm text-gray-700">{example.bad}</p>
                                    </div>
                                  </>
                                )}
                                {example.tip && (
                                  <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                    <p className="text-xs font-semibold text-amber-800 mb-1">💡 Tip</p>
                                    <p className="text-sm text-amber-700">{example.tip}</p>
                                  </div>
                                )}
                              </div>
                            )}
                            {example.strategies && (
                              <div>
                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Strategies</p>
                                <ul className="space-y-1">
                                  {example.strategies.map((strategy: string, stratIdx: number) => (
                                    <li key={stratIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                      <span>{strategy}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStepData.content.data.implementation && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Implementation Steps</h4>
                      <ul className="space-y-2">
                        {currentStepData.content.data.implementation.map((step: string, stepIdx: number) => (
                          <li key={stepIdx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
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
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                              {stepIdx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {currentStepData.content.data.resources && (
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Resources</h4>
                      <ul className="space-y-2">
                        {currentStepData.content.data.resources.map((resource: string, resIdx: number) => (
                          <li key={resIdx} className="flex items-center gap-2 text-sm text-gray-700">
                            <Download className="h-4 w-4 text-blue-600" />
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
                  <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tools & Examples</h3>
                    <div className="space-y-2 text-sm text-gray-700 whitespace-pre-line">
                      {currentStepData.content.data.tools.map((tool: string, idx: number) => (
                        <p key={idx}>{tool}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Key Takeaways */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {currentStepData.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reflection */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  Reflection
                </h3>
                <p className="text-sm text-gray-700">{currentStepData.reflection}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Complete tutorial' : 'Next step'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssessmentTutorial



