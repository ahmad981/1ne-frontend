import { useState } from 'react'
import {
  Beaker,
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
  Eye,
  Wand2,
  Settings,
  Filter,
  GraduationCap,
  Code,
  Ruler,
  Triangle,
  Square,
  PlayCircle,
  FlaskConical,
  Microscope,
  Atom,
  Rocket,
  Wrench,
  Activity,
  ClipboardCheck,
  Search,
  MessageSquare,
  Globe,
} from 'lucide-react'

interface NGSSInvestigation {
  phenomenon: string
  performanceExpectation: string
  dci: string
  sep: string[]
  ccc: string[]
  investigationPlan: {
    question: string
    hypothesis: string
    materials: string[]
    procedure: string[]
    dataCollection: string
    analysis: string
  }
  assessment: {
    formative: string[]
    summative: string
  }
}

interface EngineeringChallenge {
  problem: string
  constraints: string[]
  criteria: string[]
  designCycle: {
    ask: string[]
    imagine: string[]
    plan: string[]
    create: string[]
    improve: string[]
  }
  realWorldContext: string
  ngssAlignment: string[]
}

interface InquiryGuidance {
  topic: string
  questions: {
    level: 'exploratory' | 'investigative' | 'evaluative'
    question: string
    guidance: string
  }[]
  hypothesisFramework: {
    template: string
    examples: string[]
  }
  experimentalDesign: {
    variables: string
    controls: string
    procedure: string
  }
  dataAnalysis: {
    methods: string[]
    tools: string[]
    interpretation: string
  }
}

const STEMInquiryMentor = () => {
  const [activeTab, setActiveTab] = useState<'investigation' | 'engineering' | 'inquiry' | 'data' | 'assessment' | 'alignment'>('investigation')
  const [gradeLevel, setGradeLevel] = useState('8')
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState<'biology' | 'chemistry' | 'physics' | 'earth-science' | 'engineering'>('biology')
  const [isGenerating, setIsGenerating] = useState(false)
  const [ngssInvestigation, setNGSSInvestigation] = useState<NGSSInvestigation | null>(null)
  const [engineeringChallenge, setEngineeringChallenge] = useState<EngineeringChallenge | null>(null)
  const [inquiryGuidance, setInquiryGuidance] = useState<InquiryGuidance | null>(null)

  const handleNGSSInvestigation = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockInvestigation: NGSSInvestigation = {
        phenomenon: topic || 'Why do some objects float while others sink?',
        performanceExpectation: 'MS-PS1-2: Analyze and interpret data on the properties of substances before and after the substances interact to determine if a chemical reaction has occurred.',
        dci: 'PS1.A: Structure and Properties of Matter - Substances are made from different types of atoms, which combine with one another in various ways.',
        sep: [
          'Asking Questions and Defining Problems',
          'Planning and Carrying Out Investigations',
          'Analyzing and Interpreting Data',
        ],
        ccc: [
          'Patterns',
          'Cause and Effect',
          'Structure and Function',
        ],
        investigationPlan: {
          question: 'How does the density of an object affect whether it floats or sinks in water?',
          hypothesis: 'Objects with a density less than water (1 g/cm³) will float, while objects with a density greater than water will sink.',
          materials: [
            'Various objects (wood, metal, plastic, etc.)',
            'Graduated cylinder',
            'Balance scale',
            'Water',
            'Calculator',
          ],
          procedure: [
            'Measure the mass of each object using the balance scale',
            'Measure the volume of each object using water displacement',
            'Calculate density using the formula: density = mass/volume',
            'Test each object in water and observe whether it floats or sinks',
            'Record observations and compare densities',
          ],
          dataCollection: 'Create a data table with columns for object name, mass (g), volume (cm³), calculated density (g/cm³), and observation (float/sink).',
          analysis: 'Compare the calculated density of each object to the density of water (1 g/cm³). Objects with density < 1 g/cm³ float; objects with density > 1 g/cm³ sink.',
        },
        assessment: {
          formative: [
            'Exit ticket: Explain why a steel ship floats even though steel is denser than water',
            'Think-pair-share: Predict what would happen if we tested objects in saltwater',
            'Quick check: Calculate density of an object with mass 50g and volume 25cm³',
          ],
          summative: 'Design an investigation to determine the density of an unknown liquid and explain how you would use this information to identify the liquid.',
        },
      }
      setNGSSInvestigation(mockInvestigation)
      setIsGenerating(false)
    }, 2000)
  }

  const handleEngineeringChallenge = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockChallenge: EngineeringChallenge = {
        problem: topic || 'Design a water filtration system for a community without access to clean water',
        constraints: [
          'Must use only locally available materials',
          'Cost must be under $10 per unit',
          'Must be able to filter at least 1 liter per hour',
          'Must be portable and easy to assemble',
        ],
        criteria: [
          'Effectiveness: Removes at least 90% of visible particles',
          'Durability: Lasts at least 3 months with daily use',
          'Usability: Can be operated by people with minimal training',
          'Sustainability: Uses renewable or recyclable materials',
        ],
        designCycle: {
          ask: [
            'What contaminants need to be removed?',
            'What materials are available locally?',
            'What is the target user population?',
            'What are the environmental conditions?',
          ],
          imagine: [
            'Research existing filtration methods (sand, charcoal, cloth)',
            'Brainstorm combinations of materials',
            'Consider multi-stage filtration systems',
            'Think about maintenance and replacement needs',
          ],
          plan: [
            'Sketch design with labeled parts',
            'List materials and quantities needed',
            'Create step-by-step assembly instructions',
            'Plan testing procedures',
          ],
          create: [
            'Build prototype following design plan',
            'Document any modifications made during construction',
            'Take photos of each stage',
            'Record initial observations',
          ],
          improve: [
            'Test prototype with contaminated water',
            'Measure effectiveness (particle count, clarity)',
            'Identify weaknesses and failure points',
            'Redesign and rebuild improved version',
            'Compare performance of iterations',
          ],
        },
        realWorldContext: 'Over 2 billion people lack access to safely managed drinking water. This challenge connects to UN Sustainable Development Goal 6: Clean Water and Sanitation.',
        ngssAlignment: [
          'MS-ETS1-1: Define the criteria and constraints of a design problem',
          'MS-ETS1-2: Evaluate competing design solutions',
          'MS-ETS1-3: Analyze data from tests to determine similarities and differences',
          'MS-ETS1-4: Develop a model to generate data for iterative testing',
        ],
      }
      setEngineeringChallenge(mockChallenge)
      setIsGenerating(false)
    }, 2000)
  }

  const handleInquiryGuidance = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockGuidance: InquiryGuidance = {
        topic: topic || 'Plant Growth',
        questions: [
          {
            level: 'exploratory',
            question: 'What factors might affect how fast a plant grows?',
            guidance: 'Encourage students to observe plants in different conditions. Guide them to notice light, water, soil type, temperature, and space as potential factors.',
          },
          {
            level: 'investigative',
            question: 'How does the amount of light affect plant growth rate?',
            guidance: 'Help students design a controlled experiment. They should vary only light (independent variable) while keeping water, soil, temperature constant. Measure growth (dependent variable) over time.',
          },
          {
            level: 'evaluative',
            question: 'Based on your data, what is the optimal amount of light for plant growth? How confident are you in this conclusion?',
            guidance: 'Guide students to analyze their data, identify patterns, and consider limitations. Encourage them to think about sample size, measurement accuracy, and external factors.',
          },
        ],
        hypothesisFramework: {
          template: 'If [independent variable] is [changed in this way], then [dependent variable] will [expected outcome] because [scientific reasoning].',
          examples: [
            'If plants receive more light, then they will grow taller because light is needed for photosynthesis to produce energy for growth.',
            'If the temperature increases, then the rate of chemical reactions will increase because higher temperatures provide more kinetic energy to molecules.',
          ],
        },
        experimentalDesign: {
          variables: 'Independent: Amount of light (0, 4, 8, 12 hours/day)\nDependent: Plant height (cm) measured weekly\nControlled: Type of plant, amount of water, soil type, temperature, pot size',
          controls: 'Control group: Plant with standard light conditions (8 hours)\nPositive control: Plant known to grow well\nNegative control: Plant with no light (to confirm light is necessary)',
          procedure: '1. Plant seeds in identical pots with same soil\n2. Place in same location with controlled temperature\n3. Water all plants with same amount daily\n4. Expose to different light durations (0, 4, 8, 12 hours)\n5. Measure height weekly for 4 weeks\n6. Record data in table',
        },
        dataAnalysis: {
          methods: [
            'Create line graphs showing growth over time for each condition',
            'Calculate average growth rate for each group',
            'Compare final heights using bar graph',
            'Identify trends and patterns',
          ],
          tools: [
            'Graphing software or graph paper',
            'Calculator for averages',
            'Statistical analysis (if appropriate for grade level)',
          ],
          interpretation: 'Guide students to: (1) Describe what the data shows, (2) Identify relationships between variables, (3) Explain the science behind the results, (4) Consider sources of error, (5) Draw evidence-based conclusions.',
        },
      }
      setInquiryGuidance(mockGuidance)
      setIsGenerating(false)
    }, 2000)
  }

  const tabs = [
    { id: 'investigation', label: 'NGSS Investigations', icon: FlaskConical },
    { id: 'engineering', label: 'Engineering Design', icon: Wrench },
    { id: 'inquiry', label: 'Inquiry Guidance', icon: Brain },
    { id: 'data', label: 'Data & Modeling', icon: LineChart },
    { id: 'assessment', label: 'Assessment Tools', icon: ClipboardCheck },
    { id: 'alignment', label: 'NGSS Alignment', icon: Target },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Beaker className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">STEM Inquiry Mentor</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.9★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" /> Premium
                  </span>
                </div>
                <p className="mt-2 text-blue-100">
                  NGSS-aligned investigations, engineering design challenges, and scientific method guidance 
                  for inquiry-based STEM learning.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Target className="h-4 w-4" />
                <span>NGSS-Aligned</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Wrench className="h-4 w-4" />
                <span>Engineering Design</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Brain className="h-4 w-4" />
                <span>Inquiry-Based</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <LineChart className="h-4 w-4" />
                <span>Data Analysis</span>
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
              <p className="text-sm font-medium text-gray-600">Investigations Created</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,847</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FlaskConical className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engineering Challenges</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">623</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
              <Wrench className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students Engaged</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">4,523</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">NGSS Standards</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <GraduationCap className="h-6 w-6" />
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
                      ? 'border-blue-600 text-blue-600'
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
          {/* NGSS Investigations Tab */}
          {activeTab === 'investigation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Area
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as any)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="biology">Biology</option>
                      <option value="chemistry">Chemistry</option>
                      <option value="physics">Physics</option>
                      <option value="earth-science">Earth Science</option>
                      <option value="engineering">Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phenomenon or Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Why do objects float? How do plants grow?"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <button
                    onClick={handleNGSSInvestigation}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Investigation
                      </>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {ngssInvestigation ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-blue-600" />
                          Phenomena
                        </h3>
                        <p className="text-gray-700 text-lg font-medium">{ngssInvestigation.phenomenon}</p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-indigo-600" />
                          NGSS Alignment
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Performance Expectation</p>
                            <p className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded">{ngssInvestigation.performanceExpectation}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Disciplinary Core Idea (DCI)</p>
                            <p className="text-sm text-gray-700">{ngssInvestigation.dci}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Science & Engineering Practices (SEP)</p>
                            <ul className="space-y-1">
                              {ngssInvestigation.sep.map((practice, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span>{practice}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Crosscutting Concepts (CCC)</p>
                            <ul className="space-y-1">
                              {ngssInvestigation.ccc.map((concept, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <Layers className="h-4 w-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                                  <span>{concept}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <FlaskConical className="h-5 w-5 text-green-600" />
                          Investigation Plan
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Research Question</p>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border border-green-200">{ngssInvestigation.investigationPlan.question}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Hypothesis</p>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border border-green-200">{ngssInvestigation.investigationPlan.hypothesis}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Materials</p>
                            <ul className="space-y-1">
                              {ngssInvestigation.investigationPlan.materials.map((material, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2 bg-white p-2 rounded border border-green-200">
                                  <Circle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{material}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Procedure</p>
                            <ol className="space-y-1">
                              {ngssInvestigation.investigationPlan.procedure.map((step, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2 bg-white p-2 rounded border border-green-200">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                                    {idx + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Data Collection</p>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border border-green-200">{ngssInvestigation.investigationPlan.dataCollection}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Analysis</p>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border border-green-200">{ngssInvestigation.investigationPlan.analysis}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <ClipboardCheck className="h-5 w-5 text-purple-600" />
                          Assessment
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Formative Assessment</p>
                            <ul className="space-y-1">
                              {ngssInvestigation.assessment.formative.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Summative Assessment</p>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border border-purple-200">{ngssInvestigation.assessment.summative}</p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Investigation Plan
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Enter a phenomenon or topic to generate an NGSS-aligned investigation plan
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Engineering Design Tab */}
          {activeTab === 'engineering' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Engineering Problem
                    </label>
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Design a water filtration system, Create a bridge that can support weight..."
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleEngineeringChallenge}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Challenge
                      </>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {engineeringChallenge ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Wrench className="h-5 w-5 text-blue-600" />
                          Engineering Problem
                        </h3>
                        <p className="text-gray-700 text-lg font-medium">{engineeringChallenge.problem}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-gray-200 bg-red-50 p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            Constraints
                          </h4>
                          <ul className="space-y-1">
                            {engineeringChallenge.constraints.map((constraint, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-red-600 mt-0.5">•</span>
                                <span>{constraint}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-green-50 p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4 text-green-600" />
                            Success Criteria
                          </h4>
                          <ul className="space-y-1">
                            {engineeringChallenge.criteria.map((criterion, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{criterion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Compass className="h-5 w-5 text-indigo-600" />
                          Engineering Design Cycle
                        </h3>
                        <div className="space-y-4">
                          {Object.entries(engineeringChallenge.designCycle).map(([stage, activities]) => (
                            <div key={stage} className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-4">
                              <h4 className="text-base font-bold text-gray-900 mb-3 capitalize flex items-center gap-2">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                                  {stage === 'ask' ? '1' : stage === 'imagine' ? '2' : stage === 'plan' ? '3' : stage === 'create' ? '4' : '5'}
                                </span>
                                {stage}
                              </h4>
                              <ul className="space-y-1 ml-10">
                                {activities.map((activity, idx) => (
                                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-indigo-600 mt-0.5">•</span>
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Globe className="h-5 w-5 text-teal-600" />
                          Real-World Context
                        </h3>
                        <p className="text-gray-700">{engineeringChallenge.realWorldContext}</p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-purple-600" />
                          NGSS Alignment
                        </h3>
                        <ul className="space-y-1">
                          {engineeringChallenge.ngssAlignment.map((standard, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span className="font-mono">{standard}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Engineering Challenge
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Enter an engineering problem to generate a complete design challenge
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Inquiry Guidance Tab */}
          {activeTab === 'inquiry' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Plant Growth, Chemical Reactions"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleInquiryGuidance}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Guidance
                      </>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {inquiryGuidance ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Brain className="h-5 w-5 text-blue-600" />
                          Inquiry Questions
                        </h3>
                        <div className="space-y-4">
                          {inquiryGuidance.questions.map((q, idx) => {
                            const levelColors = {
                              exploratory: 'bg-green-50 border-green-200',
                              investigative: 'bg-blue-50 border-blue-200',
                              evaluative: 'bg-purple-50 border-purple-200',
                            }
                            return (
                              <div key={idx} className={`rounded-lg border-2 p-4 ${levelColors[q.level]}`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-1 rounded text-xs font-semibold uppercase bg-white">
                                    {q.level}
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mb-2">{q.question}</p>
                                <p className="text-sm text-gray-700">{q.guidance}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-amber-600" />
                          Hypothesis Framework
                        </h3>
                        <div className="space-y-3">
                          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Template</p>
                            <p className="text-sm font-mono text-gray-900">{inquiryGuidance.hypothesisFramework.template}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Examples</p>
                            <ul className="space-y-2">
                              {inquiryGuidance.hypothesisFramework.examples.map((example, idx) => (
                                <li key={idx} className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">
                                  "{example}"
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <FlaskConical className="h-5 w-5 text-green-600" />
                          Experimental Design
                        </h3>
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Variables</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{inquiryGuidance.experimentalDesign.variables}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Controls</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{inquiryGuidance.experimentalDesign.controls}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Procedure</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{inquiryGuidance.experimentalDesign.procedure}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <LineChart className="h-5 w-5 text-indigo-600" />
                          Data Analysis
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Analysis Methods</p>
                            <ul className="space-y-1">
                              {inquiryGuidance.dataAnalysis.methods.map((method, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                  <span>{method}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Tools</p>
                            <ul className="space-y-1">
                              {inquiryGuidance.dataAnalysis.tools.map((tool, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <Wand2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                  <span>{tool}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-indigo-200">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Interpretation Guidance</p>
                            <p className="text-sm text-gray-700">{inquiryGuidance.dataAnalysis.interpretation}</p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Inquiry Guide
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Enter a topic to generate inquiry guidance with questions, hypothesis frameworks, and experimental design
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Data & Modeling Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <LineChart className="h-6 w-6 text-indigo-600" />
                  Data Analysis & Modeling Tools
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  AI-powered tools for data collection, graphing, statistical analysis, and scientific modeling.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Graph Generator', icon: LineChart, description: 'Create line, bar, scatter plots with data analysis' },
                    { name: 'Statistical Analysis', icon: BarChart3, description: 'Calculate mean, median, mode, standard deviation' },
                    { name: 'Data Table Builder', icon: Grid3x3, description: 'Organize and format experimental data' },
                    { name: 'Model Builder', icon: Shapes, description: 'Create mathematical and conceptual models' },
                    { name: 'Trend Analysis', icon: TrendingUp, description: 'Identify patterns and relationships in data' },
                    { name: 'Error Analysis', icon: AlertCircle, description: 'Calculate uncertainty and error propagation' },
                  ].map((tool, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{tool.name}</h4>
                      <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                      <button className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        Launch Tool
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ClipboardCheck className="h-6 w-6 text-purple-600" />
                  Assessment & Feedback Tools
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Create NGSS-aligned assessments with automated feedback and rubric generation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { type: 'Performance Task', icon: Target, description: '3D assessment aligned to performance expectations', color: 'blue' },
                    { type: 'Lab Report Rubric', icon: FileText, description: 'Automated rubric for scientific writing', color: 'green' },
                    { type: 'Claim-Evidence-Reasoning', icon: Brain, description: 'CER framework assessment generator', color: 'purple' },
                    { type: 'Engineering Portfolio', icon: Wrench, description: 'Assess design process documentation', color: 'orange' },
                  ].map((assessment, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${assessment.color}-100 text-${assessment.color}-600 mb-3`}>
                        <assessment.icon className="h-5 w-5" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{assessment.type}</h4>
                      <p className="text-sm text-gray-600 mb-4">{assessment.description}</p>
                      <button className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        Create Assessment
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NGSS Alignment Tab */}
          {activeTab === 'alignment' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-teal-600" />
                  NGSS & Curriculum Alignment Engine
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Automatically align investigations, activities, and assessments with NGSS standards and performance expectations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { feature: 'Performance Expectation Mapping', icon: Target },
                    { feature: '3D Learning Analysis', icon: Layers },
                    { feature: 'Cross-Cutting Concepts', icon: Compass },
                    { feature: 'Science Practices Integration', icon: FlaskConical },
                    { feature: 'Grade Band Alignment', icon: GraduationCap },
                    { feature: 'State Standard Mapping', icon: Globe },
                  ].map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600 mb-3">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900">{item.feature}</h4>
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Advanced AI-Powered Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">NGSS Alignment Engine</h3>
            <p className="text-sm text-gray-600">
              Automatic mapping to performance expectations, DCIs, SEPs, and CCCs with alignment reports.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-cyan-50 to-teal-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 mb-4">
              <Wand2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Inquiry Design Copilot</h3>
            <p className="text-sm text-gray-600">
              AI-assisted generation of phenomena-driven investigations with full lab plans and materials lists.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-teal-50 to-green-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 mb-4">
              <Wrench className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Engineering Challenge Generator</h3>
            <p className="text-sm text-gray-600">
              Create authentic engineering design challenges with constraints, criteria, and design cycle guidance.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-4">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Critical Thinking Coach</h3>
            <p className="text-sm text-gray-600">
              Guide students through hypothesis formation, experimental design, and evidence-based reasoning.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data & Modeling Assistant</h3>
            <p className="text-sm text-gray-600">
              Automated graphing, statistical analysis, and scientific modeling with interpretation guidance.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment Automation</h3>
            <p className="text-sm text-gray-600">
              Generate rubrics, provide automated feedback, and create 3D performance assessments.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Differentiation & Accessibility</h3>
            <p className="text-sm text-gray-600">
              Automatically adapt investigations for diverse learners with multiple entry points and supports.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-4">
              <Settings className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Classroom Integration</h3>
            <p className="text-sm text-gray-600">
              Seamless integration with LMS, gradebooks, and classroom management tools for workflow efficiency.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default STEMInquiryMentor



