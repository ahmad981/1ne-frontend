import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Play,
  Pause,
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
  PlayCircle,
  SkipForward,
  SkipBack,
  Volume2,
  Maximize2,
  Settings,
  Sparkles,
  Layers,
} from 'lucide-react'

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

const LessonPlannerTutorial = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showTranscript, setShowTranscript] = useState(false)

  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: 'Introduction: Getting Started with the Lesson Planner',
      duration: '2 min',
      content: {
        type: 'video',
        data: {
          description: 'Learn how the AI-powered lesson planner can save you time while creating high-quality, standards-aligned lesson plans.',
          keyPoints: [
            'The lesson planner uses AI to generate comprehensive lesson plans',
            'You provide key information and the AI creates structured, detailed plans',
            'All plans are aligned to curriculum standards and frameworks',
            'You can customize and refine the generated plans',
          ],
        },
      },
      keyTakeaways: [
        'The planner is a tool to enhance your teaching, not replace your expertise',
        'The more specific your inputs, the better the output',
        'Always review and personalize AI-generated content',
      ],
      reflection: 'What aspects of lesson planning take you the most time? How could AI help streamline your process?',
    },
    {
      id: 2,
      title: 'Step 1: Basic Information',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Start with the fundamentals: grade, subject, topic, and duration',
          examples: [
            {
              scenario: 'Planning a Science Lesson',
              grade: 'Grade 5',
              subject: 'Science',
              topic: 'Water Cycle',
              duration: '45 minutes',
              tip: 'Be specific with topics. "Water Cycle" is better than "Science"',
            },
            {
              scenario: 'Planning a Math Lesson',
              grade: 'Grade 3',
              subject: 'Mathematics',
              topic: 'Multiplication Tables (2s and 5s)',
              duration: '30 minutes',
              tip: 'Include specific learning focus in the topic field',
            },
          ],
          implementation: [
            'Select or enter the grade level',
            'Choose the subject from the dropdown',
            'Enter a specific topic (not just the subject name)',
            'Set the lesson duration',
            'Choose your curriculum profile (e.g., US Common Core, UK National Curriculum)',
          ],
        },
      },
      keyTakeaways: [
        'Specific topics generate better lesson plans',
        'Duration affects the depth and number of activities',
        'Curriculum profile ensures standards alignment',
      ],
      reflection: 'Think of an upcoming lesson. What specific topic will you enter?',
    },
    {
      id: 3,
      title: 'Step 2: Learning Objectives',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Define clear, measurable learning objectives',
          examples: [
            {
              scenario: 'Good Learning Objectives',
              objectives: [
                'Students will explain the stages of the water cycle',
                'Students will identify the role of evaporation and condensation',
                'Students will create a diagram showing the water cycle process',
              ],
            },
            {
              scenario: 'Weak Learning Objectives',
              objectives: [
                'Students will learn about the water cycle',
                'Students will understand science',
                'Students will do activities',
              ],
            },
          ],
          implementation: [
            'Start with action verbs (explain, identify, create, analyze)',
            'Make objectives specific and measurable',
            'Align objectives with curriculum standards',
            'Include 2-4 objectives per lesson',
            'Use Bloom\'s Taxonomy levels appropriately',
          ],
        },
      },
      keyTakeaways: [
        'Use action verbs from Bloom\'s Taxonomy',
        'Objectives should be observable and measurable',
        'Fewer, clearer objectives are better than many vague ones',
      ],
      reflection: 'Write 2-3 learning objectives for your next lesson. Are they specific and measurable?',
    },
    {
      id: 4,
      title: 'Step 3: Prior Knowledge & Teaching Methods',
      duration: '2 min',
      content: {
        type: 'text',
        data: {
          strategies: [
            'Prior Knowledge: Describe what students already know or should know',
            'This helps the AI create appropriate scaffolding and connections',
            'Be specific: "Students know basic addition facts" is better than "Students know math"',
            'Teaching Methods: Choose the approach that fits your lesson',
            'Options include: inquiry-based, direct instruction, project-based, collaborative, etc.',
          ],
          tools: [
            'Prior Knowledge Examples:',
            '- "Students can identify nouns and verbs"',
            '- "Students understand that plants need water and sunlight"',
            '- "Students have practiced addition with regrouping"',
            '',
            'Teaching Method Selection:',
            '- Inquiry-based: For exploration and discovery',
            '- Direct instruction: For introducing new concepts',
            '- Project-based: For extended, real-world applications',
            '- Collaborative: For group work and peer learning',
          ],
        },
      },
      keyTakeaways: [
        'Prior knowledge helps AI create appropriate content',
        'Teaching method selection influences activity types',
        'Be honest about what students know',
      ],
      reflection: 'What prior knowledge do your students have for your next lesson?',
    },
    {
      id: 5,
      title: 'Step 4: Materials & Student Grouping',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Specify available materials and preferred grouping strategies',
          examples: [
            {
              scenario: 'Materials Available',
              materials: ['Whiteboard', 'Chart paper', 'Markers', 'Internet access', 'Tablets'],
              tip: 'List what you actually have access to',
            },
            {
              scenario: 'Student Grouping Options',
              options: [
                'Whole class',
                'Pairs',
                'Groups of 3-4',
                'Individual work',
                'Flexible grouping',
              ],
            },
          ],
          implementation: [
            'List all materials you have available',
            'Be realistic about technology access',
            'Choose grouping that supports your learning objectives',
            'Consider your classroom space and management',
            'You can mix grouping strategies within one lesson',
          ],
        },
      },
      keyTakeaways: [
        'Realistic material lists prevent impractical suggestions',
        'Grouping affects activity design',
        'Consider your classroom context',
      ],
      reflection: 'What materials do you typically have available? How do you usually group students?',
    },
    {
      id: 6,
      title: 'Step 5: Differentiation Options',
      duration: '2 min',
      content: {
        type: 'text',
        data: {
          strategies: [
            'Enable differentiation if you have diverse learners',
            'The AI will suggest strategies for emerging and advanced learners',
            'Differentiation can include: content, process, product, or environment',
            'Even if you don\'t enable it, you can add differentiation later',
          ],
          tools: [
            'When to Enable Differentiation:',
            '- Mixed ability levels in your class',
            '- Students with IEPs or 504 plans',
            '- English language learners',
            '- Students who need enrichment',
            '',
            'What Gets Generated:',
            '- Support strategies for struggling learners',
            '- Extension activities for advanced learners',
            '- Multiple entry points for activities',
            '- Varied assessment options',
          ],
        },
      },
      keyTakeaways: [
        'Differentiation makes lessons accessible to all learners',
        'You can always add more differentiation manually',
        'Consider your specific student needs',
      ],
      reflection: 'Do you have students who would benefit from differentiated instruction?',
    },
    {
      id: 7,
      title: 'Step 6: Generating & Reviewing Your Lesson Plan',
      duration: '2 min',
      content: {
        type: 'example',
        data: {
          classroom: {
            grade: 5,
            subject: 'Science',
            students: 24,
            diversity: 'Mixed abilities, 2 ELL students',
          },
          challenge: 'Creating a comprehensive lesson plan that meets all students\' needs',
          approach: 'Using AI to generate a draft, then personalizing it',
        },
      },
      keyTakeaways: [
        'Review the generated plan carefully',
        'Check alignment with your objectives',
        'Personalize activities for your students',
        'Adjust timing if needed',
      ],
      reflection: 'What will you look for when reviewing an AI-generated lesson plan?',
    },
    {
      id: 8,
      title: 'Best Practices & Pro Tips',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Maximize the effectiveness of your AI-generated lesson plans',
          steps: [
            'Always review and edit the generated plan',
            'Add personal touches and connections to your students',
            'Verify that activities match your available time',
            'Check that assessments align with learning objectives',
            'Customize differentiation for your specific students',
            'Save successful plans as templates for future use',
            'Iterate and refine based on what works',
          ],
          resources: [
            'Lesson plan template library',
            'Standards alignment guide',
            'Differentiation strategy bank',
            'Assessment rubric examples',
          ],
        },
      },
      keyTakeaways: [
        'AI is a starting point, not the final product',
        'Your expertise makes the plan effective',
        'Save and reuse successful elements',
        'Continuous improvement is key',
      ],
      reflection: 'What is your action plan for using the lesson planner effectively?',
    },
  ]

  const currentStepData = tutorialSteps[currentStep]
  const progress = ((completedSteps.length + (currentStep > 0 ? 1 : 0)) / tutorialSteps.length) * 100

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep])
    }
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/dashboard/learning-hub')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    Step-by-step walkthrough
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm">12 min</span>
                </div>
                <h1 className="text-3xl font-bold">Mastering the Lesson Planner Template</h1>
                <p className="mt-2 text-amber-100">
                  Learn how to use the AI-powered lesson planner to create comprehensive, standards-aligned lesson plans efficiently
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
                        ? 'bg-amber-50 border-2 border-amber-300'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-amber-100 text-amber-600'
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
                          isActive ? 'text-amber-900' : 'text-gray-900'
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
                <div className="relative aspect-video rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
                    >
                      {isPlaying ? (
                        <Pause className="h-10 w-10" />
                      ) : (
                        <Play className="h-10 w-10 ml-1" />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-1/3 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-white text-xs">
                      <span>0:00</span>
                      <span>{currentStepData.duration}</span>
                    </div>
                  </div>
                </div>

                {currentStepData.content.data.description && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Video</h3>
                    <p className="text-sm text-gray-700">{currentStepData.content.data.description}</p>
                  </div>
                )}

                {currentStepData.content.data.keyPoints && (
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {currentStepData.content.data.keyPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
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
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
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
                        <div key={idx} className="bg-white rounded-lg p-5 border border-amber-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">{example.scenario}</h4>
                          <div className="space-y-2">
                            {example.grade && (
                              <p className="text-sm text-gray-700"><span className="font-semibold">Grade:</span> {example.grade}</p>
                            )}
                            {example.subject && (
                              <p className="text-sm text-gray-700"><span className="font-semibold">Subject:</span> {example.subject}</p>
                            )}
                            {example.topic && (
                              <p className="text-sm text-gray-700"><span className="font-semibold">Topic:</span> {example.topic}</p>
                            )}
                            {example.duration && (
                              <p className="text-sm text-gray-700"><span className="font-semibold">Duration:</span> {example.duration}</p>
                            )}
                            {example.tip && (
                              <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                <p className="text-xs font-semibold text-amber-800 mb-1">💡 Tip</p>
                                <p className="text-sm text-amber-700">{example.tip}</p>
                              </div>
                            )}
                            {example.objectives && (
                              <div className="mt-3">
                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Learning Objectives</p>
                                <ul className="space-y-1">
                                  {example.objectives.map((obj: string, objIdx: number) => (
                                    <li key={objIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                      <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                      <span>{obj}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {example.options && (
                              <div className="mt-3">
                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Options</p>
                                <div className="space-y-1">
                                  {example.options.map((opt: string, optIdx: number) => (
                                    <p key={optIdx} className="text-sm text-gray-700">• {opt}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                            {example.materials && (
                              <div className="mt-3">
                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Materials</p>
                                <div className="flex flex-wrap gap-2">
                                  {example.materials.map((mat: string, matIdx: number) => (
                                    <span key={matIdx} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">{mat}</span>
                                  ))}
                                </div>
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
                            <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
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
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                              {stepIdx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {currentStepData.content.data.resources && (
                    <div className="bg-white rounded-lg p-4 border border-amber-200">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Resources</h4>
                      <ul className="space-y-2">
                        {currentStepData.content.data.resources.map((resource: string, resIdx: number) => (
                          <li key={resIdx} className="flex items-center gap-2 text-sm text-gray-700">
                            <Download className="h-4 w-4 text-amber-600" />
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
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategies</h3>
                    <ul className="space-y-3">
                      {currentStepData.content.data.strategies.map((strategy: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span>{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentStepData.content.data.tools && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
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
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {currentStepData.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reflection */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
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
                disabled={currentStep === tutorialSteps.length - 1}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white text-sm font-semibold rounded-full hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Complete Tutorial' : 'Next Step'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonPlannerTutorial



