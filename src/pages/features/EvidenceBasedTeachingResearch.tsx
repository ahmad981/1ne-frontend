import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  Lightbulb,
  Target,
  Star,
  Download,
  Share2,
  Bookmark,
  TrendingUp,
  Award,
  Eye,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react'

interface TeachingStrategy {
  strategy: string
  effectSize: number
  category: 'High Impact' | 'Medium Impact' | 'Low Impact'
  description: string
  practicalApplications: string[]
  researchEvidence: string
}

const EvidenceBasedTeachingResearch = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<'overview' | 'high-impact' | 'medium-impact' | 'low-impact' | 'implementation'>('overview')

  const teachingStrategies: TeachingStrategy[] = [
    {
      strategy: 'Collective Teacher Efficacy',
      effectSize: 1.57,
      category: 'High Impact',
      description: 'The collective belief of teachers in their ability to positively affect students.',
      practicalApplications: [
        'Build collaborative planning time',
        'Share success stories and student growth data',
        'Create professional learning communities',
        'Celebrate team achievements',
      ],
      researchEvidence: 'When teachers believe they can make a difference together, student achievement increases dramatically.',
    },
    {
      strategy: 'Self-Reported Grades',
      effectSize: 1.33,
      category: 'High Impact',
      description: 'Students predict their own performance before assessment.',
      practicalApplications: [
        'Have students predict test scores before taking tests',
        'Ask students to set learning goals',
        'Use self-assessment rubrics',
        'Encourage reflection on learning progress',
      ],
      researchEvidence: 'Students are remarkably accurate at predicting their performance, and this metacognitive awareness drives improvement.',
    },
    {
      strategy: 'Teacher Credibility',
      effectSize: 1.09,
      category: 'High Impact',
      description: 'Students perceive teacher as trustworthy, competent, and caring.',
      practicalApplications: [
        'Be consistent and fair',
        'Demonstrate expertise in your subject',
        'Show genuine care for students',
        'Admit when you don\'t know something',
      ],
      researchEvidence: 'Students learn more from teachers they trust and respect.',
    },
    {
      strategy: 'Feedback',
      effectSize: 0.75,
      category: 'High Impact',
      description: 'Information provided to learners about their performance.',
      practicalApplications: [
        'Provide specific, actionable feedback',
        'Focus on the task, not the person',
        'Give feedback during learning, not just after',
        'Involve students in feedback processes',
      ],
      researchEvidence: 'Effective feedback can double the speed of learning when done correctly.',
    },
    {
      strategy: 'Metacognitive Strategies',
      effectSize: 0.69,
      category: 'High Impact',
      description: 'Teaching students to think about their own thinking.',
      practicalApplications: [
        'Teach students to plan, monitor, and evaluate their learning',
        'Use think-alouds to model thinking',
        'Encourage reflection journals',
        'Ask "How did you figure that out?" questions',
      ],
      researchEvidence: 'Students who understand how they learn become more effective learners.',
    },
    {
      strategy: 'Classroom Discussion',
      effectSize: 0.82,
      category: 'High Impact',
      description: 'Structured dialogue between teacher and students.',
      practicalApplications: [
        'Use Socratic questioning',
        'Implement think-pair-share',
        'Facilitate structured debates',
        'Create discussion protocols',
      ],
      researchEvidence: 'Discussion helps students process and deepen understanding.',
    },
    {
      strategy: 'Direct Instruction',
      effectSize: 0.59,
      category: 'Medium Impact',
      description: 'Explicit teaching of concepts and skills.',
      practicalApplications: [
        'Clear learning objectives',
        'Modeled examples',
        'Guided practice',
        'Independent practice',
      ],
      researchEvidence: 'Structured, explicit instruction is effective for skill building.',
    },
    {
      strategy: 'Problem-Based Learning',
      effectSize: 0.15,
      category: 'Low Impact',
      description: 'Learning through solving authentic problems.',
      practicalApplications: [
        'Present real-world problems',
        'Guide inquiry process',
        'Facilitate collaboration',
        'Connect to multiple subjects',
      ],
      researchEvidence: 'While engaging, PBL requires careful implementation to be effective.',
    },
  ]

  const highImpactStrategies = teachingStrategies.filter(s => s.category === 'High Impact')
  const mediumImpactStrategies = teachingStrategies.filter(s => s.category === 'Medium Impact')
  const lowImpactStrategies = teachingStrategies.filter(s => s.category === 'Low Impact')

  const getEffectSizeColor = (effectSize: number) => {
    if (effectSize >= 0.6) return 'text-green-600 bg-green-100'
    if (effectSize >= 0.4) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getEffectSizeIcon = (effectSize: number) => {
    if (effectSize >= 0.6) return <ArrowUp className="h-4 w-4" />
    if (effectSize >= 0.4) return <Minus className="h-4 w-4" />
    return <ArrowDown className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
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
                    Research Insight
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm">Evidence-based teaching</span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    5 min read
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Hattie's Visible Learning: Effect Sizes That Matter</h1>
                <p className="mt-2 text-blue-100">
                  Which teaching strategies have the highest impact? Simplified breakdown of meta-analyses.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Evidence-Based</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 w-4" />
                <span>Meta-Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 w-4" />
                <span>High Impact</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Bookmark className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Sections</h3>
            <div className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'high-impact', label: 'High Impact', icon: TrendingUp },
                { id: 'medium-impact', label: 'Medium Impact', icon: BarChart3 },
                { id: 'low-impact', label: 'Low Impact', icon: Target },
                { id: 'implementation', label: 'Implementation', icon: Zap },
              ].map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full text-left p-3 rounded-lg transition flex items-center gap-2 ${
                      activeSection === section.id
                        ? 'bg-blue-50 border-2 border-blue-300 text-blue-900'
                        : 'border-2 border-transparent hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Effect Sizes</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    John Hattie's Visible Learning research synthesizes over 1,400 meta-analyses involving millions of students. 
                    Effect sizes help us understand which teaching strategies have the greatest impact on student learning.
                  </p>
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">What is an Effect Size?</h3>
                    <p className="text-gray-700 mb-4">
                      Effect size measures the magnitude of difference between two groups. In education, it compares 
                      students who received a particular intervention to those who did not.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <ArrowUp className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-gray-900">d ≥ 0.6</span>
                        </div>
                        <p className="text-sm text-gray-700">High Impact - Significant positive effect</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Minus className="h-5 w-5 text-yellow-600" />
                          <span className="font-semibold text-gray-900">0.4 ≤ d &lt; 0.6</span>
                        </div>
                        <p className="text-sm text-gray-700">Medium Impact - Moderate positive effect</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <ArrowDown className="h-5 w-5 text-red-600" />
                          <span className="font-semibold text-gray-900">d &lt; 0.4</span>
                        </div>
                        <p className="text-sm text-gray-700">Low Impact - Small or negative effect</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Findings</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Most teaching strategies have a positive effect, but magnitude varies significantly</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Effect sizes above 0.6 represent a year's worth of growth in half a year</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Context matters - what works in one situation may not work in another</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Teacher expertise and implementation quality significantly influence outcomes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* High Impact Strategies */}
            {activeSection === 'high-impact' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">High Impact Strategies (Effect Size ≥ 0.6)</h2>
                  <p className="text-gray-700 mb-6">
                    These strategies have the strongest evidence for improving student learning outcomes. 
                    Focus your professional development and classroom practice on these high-leverage approaches.
                  </p>
                  <div className="space-y-4">
                    {highImpactStrategies.map((strategy, idx) => (
                      <div key={idx} className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{strategy.strategy}</h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getEffectSizeColor(strategy.effectSize)}`}>
                                {getEffectSizeIcon(strategy.effectSize)}
                                d = {strategy.effectSize}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-4">{strategy.description}</p>
                            <div className="bg-white rounded-lg p-4 border border-green-100 mb-4">
                              <p className="text-sm font-semibold text-gray-900 mb-2">Research Evidence:</p>
                              <p className="text-sm text-gray-700">{strategy.researchEvidence}</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-2">Practical Applications:</p>
                              <ul className="space-y-2">
                                {strategy.practicalApplications.map((app, appIdx) => (
                                  <li key={appIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>{app}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Medium Impact Strategies */}
            {activeSection === 'medium-impact' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Medium Impact Strategies (0.4 ≤ Effect Size &lt; 0.6)</h2>
                  <p className="text-gray-700 mb-6">
                    These strategies have moderate positive effects and can be valuable components of a comprehensive teaching approach.
                  </p>
                  <div className="space-y-4">
                    {mediumImpactStrategies.map((strategy, idx) => (
                      <div key={idx} className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{strategy.strategy}</h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getEffectSizeColor(strategy.effectSize)}`}>
                                {getEffectSizeIcon(strategy.effectSize)}
                                d = {strategy.effectSize}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-4">{strategy.description}</p>
                            <div className="bg-white rounded-lg p-4 border border-yellow-100 mb-4">
                              <p className="text-sm font-semibold text-gray-900 mb-2">Research Evidence:</p>
                              <p className="text-sm text-gray-700">{strategy.researchEvidence}</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-2">Practical Applications:</p>
                              <ul className="space-y-2">
                                {strategy.practicalApplications.map((app, appIdx) => (
                                  <li key={appIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle2 className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <span>{app}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Low Impact Strategies */}
            {activeSection === 'low-impact' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Low Impact Strategies (Effect Size &lt; 0.4)</h2>
                  <p className="text-gray-700 mb-6">
                    These strategies show smaller effects but may still have value in specific contexts. 
                    Consider implementation carefully and monitor effectiveness.
                  </p>
                  <div className="space-y-4">
                    {lowImpactStrategies.map((strategy, idx) => (
                      <div key={idx} className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{strategy.strategy}</h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getEffectSizeColor(strategy.effectSize)}`}>
                                {getEffectSizeIcon(strategy.effectSize)}
                                d = {strategy.effectSize}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-4">{strategy.description}</p>
                            <div className="bg-white rounded-lg p-4 border border-red-100 mb-4">
                              <p className="text-sm font-semibold text-gray-900 mb-2">Research Evidence:</p>
                              <p className="text-sm text-gray-700">{strategy.researchEvidence}</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-2">Practical Applications:</p>
                              <ul className="space-y-2">
                                {strategy.practicalApplications.map((app, appIdx) => (
                                  <li key={appIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle2 className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <span>{app}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Implementation Section */}
            {activeSection === 'implementation' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Implementation Guide</h2>
                  <p className="text-gray-700 mb-6">
                    Effect sizes tell us what works on average, but successful implementation requires careful consideration of your context.
                  </p>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Principles for Implementation</h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <h4 className="font-semibold text-gray-900 mb-2">1. Start with High-Impact Strategies</h4>
                        <p className="text-sm text-gray-700">
                          Focus your energy on strategies with effect sizes above 0.6. These give you the biggest return on investment.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <h4 className="font-semibold text-gray-900 mb-2">2. Consider Your Context</h4>
                        <p className="text-sm text-gray-700">
                          What works in one classroom may not work in another. Consider your students, subject, and school culture.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <h4 className="font-semibold text-gray-900 mb-2">3. Implement with Fidelity</h4>
                        <p className="text-sm text-gray-700">
                          High-impact strategies require proper implementation. Invest in professional development and ongoing support.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <h4 className="font-semibold text-gray-900 mb-2">4. Monitor and Adjust</h4>
                        <p className="text-sm text-gray-700">
                          Collect data on student outcomes and adjust your approach based on what you observe.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <h4 className="font-semibold text-gray-900 mb-2">5. Build Collective Efficacy</h4>
                        <p className="text-sm text-gray-700">
                          Work with colleagues to implement strategies together. Collective teacher efficacy has the highest effect size.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Action Steps</h3>
                    <ol className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                        <span>Identify 2-3 high-impact strategies that align with your teaching context</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                        <span>Learn about these strategies through professional development or research</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">3</span>
                        <span>Start with one strategy and implement it consistently</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">4</span>
                        <span>Collect evidence of impact through student work and assessments</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">5</span>
                        <span>Share successes and challenges with colleagues</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EvidenceBasedTeachingResearch



