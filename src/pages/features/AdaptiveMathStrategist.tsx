import { useState } from 'react'
import {
  Calculator,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  Circle,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Award,
  Clock,
  Star,
  Lock,
  Layers,
  Brain,
  Zap,
  Compass,
  Puzzle,
  LineChart,
  PieChart,
  Grid3x3,
  Shapes,
  BookOpen,
  FileText,
  PlayCircle,
  Eye,
  Wand2,
  Settings,
  Filter,
  GraduationCap,
} from 'lucide-react'

interface ProblemSet {
  problems: {
    id: number
    question: string
    difficulty: 'emerging' | 'on-level' | 'advanced'
    solution: string
    steps: string[]
    visualAid?: string
    realWorldContext?: string
  }[]
  learningObjective: string
  standard: string
}

interface AdaptivePath {
  studentLevel: string
  currentTopic: string
  recommendedPath: {
    step: number
    activity: string
    duration: string
    resources: string[]
  }[]
  masteryCheckpoints: {
    checkpoint: string
    status: 'not-started' | 'in-progress' | 'mastered'
  }[]
}

interface ConceptualUnderstanding {
  concept: string
  explanation: string
  visualRepresentations: {
    type: string
    description: string
    example: string
  }[]
  commonMisconceptions: {
    misconception: string
    correction: string
    strategy: string
  }[]
  realWorldConnections: string[]
}

interface InterventionStrategy {
  area: string
  diagnostic: string
  strategies: {
    strategy: string
    description: string
    activities: string[]
  }[]
  progressMonitoring: string[]
}

const AdaptiveMathStrategist = () => {
  const [activeTab, setActiveTab] = useState<'problems' | 'adaptive' | 'concepts' | 'intervention' | 'visual' | 'assessment'>('problems')
  const [gradeLevel, setGradeLevel] = useState('5')
  const [topic, setTopic] = useState('')
  const [standard, setStandard] = useState('')
  const [studentLevel, setStudentLevel] = useState('on-level')
  const [isGenerating, setIsGenerating] = useState(false)
  const [problemSet, setProblemSet] = useState<ProblemSet | null>(null)
  const [adaptivePath, setAdaptivePath] = useState<AdaptivePath | null>(null)
  const [conceptualUnderstanding, setConceptualUnderstanding] = useState<ConceptualUnderstanding | null>(null)
  const [interventionStrategy, setInterventionStrategy] = useState<InterventionStrategy | null>(null)

  const handleGenerateProblems = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockProblemSet: ProblemSet = {
        learningObjective: `Students will ${topic} with accuracy and understanding`,
        standard: standard || 'CCSS.MATH.CONTENT.5.NBT.B.5',
        problems: [
          {
            id: 1,
            question: 'Sarah has 3 bags of apples. Each bag has 12 apples. How many apples does Sarah have in total?',
            difficulty: 'emerging',
            solution: '36 apples',
            steps: [
              'Identify what we know: 3 bags, 12 apples per bag',
              'Use repeated addition: 12 + 12 + 12 = 36',
              'Or use multiplication: 3 × 12 = 36',
            ],
            visualAid: 'Visual representation with 3 groups of 12',
            realWorldContext: 'Grocery shopping scenario',
          },
          {
            id: 2,
            question: 'A rectangular garden is 8 meters long and 5 meters wide. What is the area of the garden?',
            difficulty: 'on-level',
            solution: '40 square meters',
            steps: [
              'Identify the formula: Area = length × width',
              'Substitute values: Area = 8 × 5',
              'Calculate: Area = 40',
              'Include units: 40 square meters',
            ],
            visualAid: 'Grid diagram showing 8 by 5 rectangle',
            realWorldContext: 'Gardening and landscaping',
          },
          {
            id: 3,
            question: 'A store offers a 20% discount on all items. If a jacket originally costs $75, what is the sale price?',
            difficulty: 'advanced',
            solution: '$60',
            steps: [
              'Calculate discount amount: 20% of $75 = 0.20 × 75 = $15',
              'Subtract discount from original: $75 - $15 = $60',
              'Alternative: Calculate 80% of original (100% - 20%): 0.80 × 75 = $60',
            ],
            visualAid: 'Percentage bar model showing 100% to 80%',
            realWorldContext: 'Shopping and financial literacy',
          },
        ],
      }
      setProblemSet(mockProblemSet)
      setIsGenerating(false)
    }, 2000)
  }

  const handleGenerateAdaptivePath = async () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockPath: AdaptivePath = {
        studentLevel: studentLevel,
        currentTopic: topic || 'Multiplication',
        recommendedPath: [
          {
            step: 1,
            activity: 'Diagnostic Assessment',
            duration: '10 min',
            resources: ['Pre-assessment quiz', 'Skill inventory', 'Learning style survey'],
          },
          {
            step: 2,
            activity: 'Conceptual Introduction',
            duration: '15 min',
            resources: ['Visual models', 'Manipulatives', 'Real-world examples'],
          },
          {
            step: 3,
            activity: 'Guided Practice',
            duration: '20 min',
            resources: ['Scaffolded problems', 'Step-by-step solutions', 'Peer collaboration'],
          },
          {
            step: 4,
            activity: 'Independent Practice',
            duration: '15 min',
            resources: ['Differentiated problem sets', 'Self-checking tools', 'Hints available'],
          },
          {
            step: 5,
            activity: 'Mastery Check',
            duration: '10 min',
            resources: ['Quick assessment', 'Exit ticket', 'Self-reflection'],
          },
        ],
        masteryCheckpoints: [
          { checkpoint: 'Understands concept', status: 'in-progress' },
          { checkpoint: 'Can solve with support', status: 'not-started' },
          { checkpoint: 'Can solve independently', status: 'not-started' },
          { checkpoint: 'Can apply to new situations', status: 'not-started' },
        ],
      }
      setAdaptivePath(mockPath)
      setIsGenerating(false)
    }, 2000)
  }

  const handleConceptualUnderstanding = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockConcept: ConceptualUnderstanding = {
        concept: topic || 'Fractions',
        explanation: 'Fractions represent parts of a whole. The numerator (top number) tells us how many parts we have, and the denominator (bottom number) tells us how many equal parts the whole is divided into.',
        visualRepresentations: [
          {
            type: 'Area Model',
            description: 'Shading parts of a rectangle or circle',
            example: 'A circle divided into 4 equal parts with 3 parts shaded represents 3/4',
          },
          {
            type: 'Number Line',
            description: 'Placing fractions on a number line to show relative size',
            example: '1/2 is halfway between 0 and 1 on a number line',
          },
          {
            type: 'Set Model',
            description: 'Showing fractions as parts of a set of objects',
            example: '3 out of 5 apples are red, representing 3/5',
          },
        ],
        commonMisconceptions: [
          {
            misconception: 'Larger denominator means larger fraction',
            correction: 'Actually, larger denominator means smaller parts (1/8 < 1/4)',
            strategy: 'Use visual models and number lines to compare fractions',
          },
          {
            misconception: 'Only whole numbers can be added',
            correction: 'Fractions can be added by finding common denominators',
            strategy: 'Use manipulatives and visual representations to show addition',
          },
        ],
        realWorldConnections: [
          'Cooking: Measuring ingredients (1/2 cup flour, 1/4 teaspoon salt)',
          'Time: Quarter past the hour, half an hour',
          'Money: Quarters (1/4 dollar), dimes (1/10 dollar)',
          'Sports: Game scores, statistics (3 out of 5 shots made)',
        ],
      }
      setConceptualUnderstanding(mockConcept)
      setIsGenerating(false)
    }, 2000)
  }

  const handleInterventionStrategy = async () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockIntervention: InterventionStrategy = {
        area: 'Place Value Understanding',
        diagnostic: 'Student struggles with regrouping in multi-digit addition and subtraction. Assessment shows difficulty understanding that 10 ones = 1 ten, 10 tens = 1 hundred.',
        strategies: [
          {
            strategy: 'Base-10 Manipulatives',
            description: 'Use physical or digital base-10 blocks to model place value',
            activities: [
              'Build numbers using blocks (e.g., 234 = 2 hundreds, 3 tens, 4 ones)',
              'Exchange activities (10 ones for 1 ten)',
              'Compare numbers using blocks',
            ],
          },
          {
            strategy: 'Visual Place Value Charts',
            description: 'Use place value charts to show the value of each digit',
            activities: [
              'Fill in place value charts for given numbers',
              'Identify the value of underlined digits',
              'Write numbers in expanded form',
            ],
          },
          {
            strategy: 'Real-World Context',
            description: 'Connect place value to money, measurement, and counting',
            activities: [
              'Count money (dollars, dimes, pennies)',
              'Measure objects and discuss units',
              'Count collections of objects by grouping',
            ],
          },
        ],
        progressMonitoring: [
          'Weekly place value assessment',
          'Observation checklist during activities',
          'Exit tickets after each lesson',
          'Student self-reflection journal',
        ],
      }
      setInterventionStrategy(mockIntervention)
      setIsGenerating(false)
    }, 2000)
  }

  const tabs = [
    { id: 'problems', label: 'Differentiated Problems', icon: Puzzle },
    { id: 'adaptive', label: 'Adaptive Learning Paths', icon: Compass },
    { id: 'concepts', label: 'Conceptual Understanding', icon: Brain },
    { id: 'intervention', label: 'Intervention Strategies', icon: Target },
    { id: 'visual', label: 'Visual Representations', icon: Eye },
    { id: 'assessment', label: 'Assessment Tools', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">Adaptive Math Strategist</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.9★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" /> Premium
                  </span>
                </div>
                <p className="mt-2 text-green-100">
                  AI-powered adaptive learning with differentiated problem sets, step-by-step modeling, 
                  conceptual understanding support, and personalized intervention strategies.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Differentiated Problems</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Compass className="h-4 w-4" />
                <span>Adaptive Learning Paths</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Brain className="h-4 w-4" />
                <span>Conceptual Understanding</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>Real-Time Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Problems Generated</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3,247</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <Puzzle className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students Supported</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,892</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mastery Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">87%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <Award className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Improvement</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">+23%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Differentiated Problems Tab */}
          {activeTab === 'problems' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Math Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Multiplication, Fractions, Algebra"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Standard (Optional)
                    </label>
                    <input
                      type="text"
                      value={standard}
                      onChange={(e) => setStandard(e.target.value)}
                      placeholder="e.g., CCSS.MATH.CONTENT.5.NBT.B.5"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Problems
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100">
                      <option>3 (One per level)</option>
                      <option>6 (Two per level)</option>
                      <option>9 (Three per level)</option>
                      <option>12 (Four per level)</option>
                    </select>
                  </div>
                  <button
                    onClick={handleGenerateProblems}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Problem Set
                      </>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {problemSet ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Objective</h3>
                          <p className="text-sm text-gray-700">{problemSet.learningObjective}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard</h3>
                          <p className="text-sm text-gray-700 font-mono">{problemSet.standard}</p>
                        </div>
                      </div>

                      {problemSet.problems.map((problem, idx) => {
                        const difficultyColors = {
                          emerging: 'bg-blue-50 border-blue-200 text-blue-700',
                          'on-level': 'bg-green-50 border-green-200 text-green-700',
                          advanced: 'bg-purple-50 border-purple-200 text-purple-700',
                        }
                        const difficultyLabels = {
                          emerging: 'Emerging',
                          'on-level': 'On-Level',
                          advanced: 'Advanced',
                        }

                        return (
                          <div
                            key={problem.id}
                            className={`rounded-2xl border-2 p-6 ${difficultyColors[problem.difficulty]}`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                                problem.difficulty === 'emerging'
                                  ? 'bg-blue-100'
                                  : problem.difficulty === 'on-level'
                                  ? 'bg-green-100'
                                  : 'bg-purple-100'
                              }`}>
                                {difficultyLabels[problem.difficulty]}
                              </span>
                              <span className="text-sm font-medium">Problem {idx + 1}</span>
                            </div>

                            <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Question:</h4>
                              <p className="text-gray-700 mb-3">{problem.question}</p>
                              {problem.realWorldContext && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Lightbulb className="h-3 w-3" />
                                  <span>Context: {problem.realWorldContext}</span>
                                </div>
                              )}
                            </div>

                            <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Solution:</h4>
                              <p className="text-gray-700 font-semibold mb-3">{problem.solution}</p>
                              <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Step-by-Step:</p>
                                <ol className="space-y-1">
                                  {problem.steps.map((step, stepIdx) => (
                                    <li key={stepIdx} className="text-sm text-gray-700 flex items-start gap-2">
                                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-semibold">
                                        {stepIdx + 1}
                                      </span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </div>

                            {problem.visualAid && (
                              <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                  <Eye className="h-4 w-4 text-green-600" />
                                  <span className="font-medium">Visual Aid:</span>
                                  <span>{problem.visualAid}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Problem Set
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Puzzle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Enter a math topic and generate differentiated problem sets at multiple levels
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Adaptive Learning Paths Tab */}
          {activeTab === 'adaptive' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Level
                    </label>
                    <select
                      value={studentLevel}
                      onChange={(e) => setStudentLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    >
                      <option value="emerging">Emerging</option>
                      <option value="on-level">On-Level</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Fractions, Algebra, Geometry"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                  <button
                    onClick={handleGenerateAdaptivePath}
                    disabled={isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Learning Path
                      </>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {adaptivePath ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Compass className="h-5 w-5 text-green-600" />
                          Personalized Learning Path
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Student Level</p>
                            <p className="text-base font-semibold text-gray-900 capitalize">{adaptivePath.studentLevel}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Current Topic</p>
                            <p className="text-base font-semibold text-gray-900">{adaptivePath.currentTopic}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {adaptivePath.recommendedPath.map((step, idx) => (
                          <div key={idx} className="rounded-xl border-2 border-green-200 bg-white p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                                {step.step}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-base font-semibold text-gray-900 mb-2">{step.activity}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                  <Clock className="h-4 w-4" />
                                  <span>{step.duration}</span>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Resources:</p>
                                  <ul className="space-y-1">
                                    {step.resources.map((resource, resIdx) => (
                                      <li key={resIdx} className="text-sm text-gray-700 flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>{resource}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          Mastery Checkpoints
                        </h3>
                        <div className="space-y-3">
                          {adaptivePath.masteryCheckpoints.map((checkpoint, idx) => {
                            const statusColors = {
                              'not-started': 'bg-gray-100 text-gray-600',
                              'in-progress': 'bg-amber-100 text-amber-700',
                              mastered: 'bg-green-100 text-green-700',
                            }
                            const statusIcons = {
                              'not-started': <Circle className="h-4 w-4" />,
                              'in-progress': <Clock className="h-4 w-4" />,
                              mastered: <CheckCircle2 className="h-4 w-4" />,
                            }

                            return (
                              <div
                                key={idx}
                                className={`flex items-center gap-3 p-3 rounded-lg ${statusColors[checkpoint.status]}`}
                              >
                                {statusIcons[checkpoint.status]}
                                <span className="text-sm font-medium">{checkpoint.checkpoint}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Learning Path
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Compass className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Generate personalized adaptive learning paths based on student level
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Conceptual Understanding Tab */}
          {activeTab === 'concepts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Math Concept
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Fractions, Place Value, Multiplication"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleConceptualUnderstanding}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Analyze Concept
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {conceptualUnderstanding ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Brain className="h-5 w-5 text-green-600" />
                          {conceptualUnderstanding.concept}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{conceptualUnderstanding.explanation}</p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Eye className="h-5 w-5 text-blue-600" />
                          Visual Representations
                        </h3>
                        <div className="space-y-4">
                          {conceptualUnderstanding.visualRepresentations.map((visual, idx) => (
                            <div key={idx} className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">{visual.type}</h4>
                              <p className="text-sm text-gray-700 mb-2">{visual.description}</p>
                              <p className="text-xs text-gray-600 italic">Example: {visual.example}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                          Common Misconceptions
                        </h3>
                        <div className="space-y-4">
                          {conceptualUnderstanding.commonMisconceptions.map((misconception, idx) => (
                            <div key={idx} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                              <div className="mb-2">
                                <p className="text-sm font-semibold text-red-700 mb-1">✗ Misconception:</p>
                                <p className="text-sm text-gray-700">{misconception.misconception}</p>
                              </div>
                              <div className="mb-2">
                                <p className="text-sm font-semibold text-green-700 mb-1">✓ Correction:</p>
                                <p className="text-sm text-gray-700">{misconception.correction}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-blue-700 mb-1">💡 Teaching Strategy:</p>
                                <p className="text-sm text-gray-700">{misconception.strategy}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-purple-600" />
                          Real-World Connections
                        </h3>
                        <ul className="space-y-2">
                          {conceptualUnderstanding.realWorldConnections.map((connection, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span>{connection}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Concept Guide
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Enter a math concept to explore visual representations, misconceptions, and real-world connections
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Intervention Strategies Tab */}
          {activeTab === 'intervention' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-red-50 to-orange-50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Target className="h-6 w-6 text-red-600" />
                      Intervention Strategy Generator
                    </h3>
                    <p className="text-sm text-gray-600">
                      Generate targeted intervention strategies for students struggling with specific math concepts.
                    </p>
                  </div>
                  <button
                    onClick={handleInterventionStrategy}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Strategy
                      </>
                    )}
                  </button>
                </div>

                {interventionStrategy && (
                  <div className="space-y-6 bg-white rounded-xl p-6 border border-red-200">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Area of Need</h4>
                      <p className="text-gray-700">{interventionStrategy.area}</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Diagnostic Assessment</h4>
                      <p className="text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-200">{interventionStrategy.diagnostic}</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Intervention Strategies</h4>
                      <div className="space-y-4">
                        {interventionStrategy.strategies.map((strategy, idx) => (
                          <div key={idx} className="rounded-lg border border-red-200 bg-red-50 p-5">
                            <h5 className="text-base font-semibold text-gray-900 mb-2">{strategy.strategy}</h5>
                            <p className="text-sm text-gray-700 mb-3">{strategy.description}</p>
                            <div>
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Activities:</p>
                              <ul className="space-y-1">
                                {strategy.activities.map((activity, actIdx) => (
                                  <li key={actIdx} className="text-sm text-gray-700 flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Progress Monitoring</h4>
                      <ul className="space-y-2">
                        {interventionStrategy.progressMonitoring.map((monitor, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <BarChart3 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{monitor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Intervention Plan
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visual Representations Tab */}
          {activeTab === 'visual' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="h-6 w-6 text-blue-600" />
                  Visual Representation Generator
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Generate visual models, diagrams, and manipulatives to support mathematical understanding.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { type: 'Number Line', icon: LineChart, color: 'blue' },
                    { type: 'Area Model', icon: Grid3x3, color: 'green' },
                    { type: 'Bar Model', icon: BarChart3, color: 'purple' },
                    { type: 'Fraction Circles', icon: PieChart, color: 'pink' },
                    { type: 'Base-10 Blocks', icon: Shapes, color: 'orange' },
                    { type: 'Coordinate Plane', icon: Compass, color: 'teal' },
                  ].map((visual, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${visual.color}-100 text-${visual.color}-600 mb-4`}>
                        <visual.icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{visual.type}</h4>
                      <button className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        Generate
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Assessment Tools Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-indigo-600" />
                  Assessment Tools
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Create formative and summative assessments aligned with learning objectives.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { type: 'Quick Check', description: '5-minute exit tickets', icon: Zap },
                    { type: 'Diagnostic', description: 'Pre-assessment to identify gaps', icon: Target },
                    { type: 'Formative', description: 'Ongoing progress monitoring', icon: TrendingUp },
                    { type: 'Summative', description: 'End-of-unit assessments', icon: Award },
                  ].map((assessment, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                          <assessment.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-gray-900">{assessment.type}</h4>
                          <p className="text-xs text-gray-600">{assessment.description}</p>
                        </div>
                      </div>
                      <button className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        Create Assessment
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Advanced AI-Powered Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Progress Monitoring</h3>
            <p className="text-sm text-gray-600">
              Track student performance in real-time with intuitive dashboards and automated progress reports.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptive Difficulty Adjustment</h3>
            <p className="text-sm text-gray-600">
              AI automatically adjusts problem difficulty based on student performance and mastery.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Learning Paths</h3>
            <p className="text-sm text-gray-600">
              Each student receives a customized learning path based on their strengths and areas for growth.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 mb-4">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Modal Representations</h3>
            <p className="text-sm text-gray-600">
              Visual, auditory, and kinesthetic learning supports for diverse learning styles.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-World Applications</h3>
            <p className="text-sm text-gray-600">
              Connect abstract math concepts to practical, everyday situations students can relate to.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Standards Alignment</h3>
            <p className="text-sm text-gray-600">
              All content aligned with Common Core, state standards, and international curricula.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdaptiveMathStrategist

