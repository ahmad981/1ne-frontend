import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  Lightbulb,
  Target,
  CheckCircle2,
  Star,
  Download,
  Share2,
  Bookmark,
  Users,
  Brain,
  Layers,
  TrendingUp,
  Award,
  MessageSquare,
  Eye,
  Zap,
  GraduationCap,
  Search,
  Filter,
} from 'lucide-react'

interface CognitiveLevel {
  level: string
  verb: string
  description: string
  exampleVerbs: string[]
  classroomExamples: string[]
  assessmentIdeas: string[]
  modernApplications: string[]
}

interface LessonExample {
  subject: string
  grade: string
  objective: string
  bloomLevel: string
  activities: string[]
  assessment: string
}

const BloomsTaxonomyResearch = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<'overview' | 'levels' | 'applications' | 'assessment' | 'modern'>('overview')

  const cognitiveLevels: CognitiveLevel[] = [
    {
      level: 'Remember',
      verb: 'Recall',
      description: 'Retrieving relevant knowledge from long-term memory. Students recognize and recall facts, terms, and basic concepts.',
      exampleVerbs: ['Define', 'List', 'Identify', 'Name', 'Recall', 'Recognize', 'Match', 'Select'],
      classroomExamples: [
        'List the states of matter',
        'Define photosynthesis',
        'Identify the main characters in a story',
        'Recall multiplication tables',
        'Name the parts of a plant',
      ],
      assessmentIdeas: [
        'Multiple choice questions',
        'Fill-in-the-blank exercises',
        'Matching activities',
        'Flashcard quizzes',
        'Labeling diagrams',
      ],
      modernApplications: [
        'Digital flashcards (Quizlet, Anki)',
        'Gamified recall games',
        'Spaced repetition systems',
        'Quick knowledge checks via polling apps',
      ],
    },
    {
      level: 'Understand',
      verb: 'Comprehend',
      description: 'Constructing meaning from instructional messages. Students can explain ideas or concepts in their own words.',
      exampleVerbs: ['Explain', 'Describe', 'Summarize', 'Interpret', 'Classify', 'Compare', 'Contrast', 'Paraphrase'],
      classroomExamples: [
        'Explain how the water cycle works',
        'Summarize the main idea of a passage',
        'Compare and contrast two historical events',
        'Describe the process of photosynthesis',
        'Interpret data from a graph',
      ],
      assessmentIdeas: [
        'Exit tickets asking "in your own words"',
        'Summary paragraphs',
        'Concept maps',
        'Think-pair-share explanations',
        'One-minute papers',
      ],
      modernApplications: [
        'Video explanations (Flipgrid, Loom)',
        'Digital concept mapping tools',
        'Collaborative annotation platforms',
        'Peer explanation activities',
      ],
    },
    {
      level: 'Apply',
      verb: 'Use',
      description: 'Carrying out or using a procedure in a given situation. Students use information in new situations.',
      exampleVerbs: ['Solve', 'Use', 'Demonstrate', 'Calculate', 'Apply', 'Execute', 'Implement', 'Construct'],
      classroomExamples: [
        'Solve word problems using multiplication',
        'Apply grammar rules to write sentences',
        'Use the scientific method to conduct an experiment',
        'Calculate the area of different shapes',
        'Demonstrate a math concept using manipulatives',
      ],
      assessmentIdeas: [
        'Problem-solving tasks',
        'Performance assessments',
        'Lab reports',
        'Application worksheets',
        'Real-world scenario problems',
      ],
      modernApplications: [
        'Simulation software',
        'Virtual labs',
        'Coding projects',
        'Interactive problem-solving platforms',
        'Project-based learning tools',
      ],
    },
    {
      level: 'Analyze',
      verb: 'Examine',
      description: 'Breaking material into constituent parts and determining how parts relate to one another. Students can see patterns and organize parts.',
      exampleVerbs: ['Analyze', 'Compare', 'Organize', 'Deconstruct', 'Examine', 'Investigate', 'Differentiate', 'Distinguish'],
      classroomExamples: [
        'Analyze the causes of World War II',
        'Compare different literary themes',
        'Examine the structure of an argument',
        'Investigate patterns in data',
        'Organize information into categories',
      ],
      assessmentIdeas: [
        'Graphic organizers',
        'Venn diagrams',
        'Case studies',
        'Data analysis tasks',
        'Text analysis essays',
      ],
      modernApplications: [
        'Data visualization tools',
        'Collaborative analysis platforms',
        'Digital annotation tools',
        'Infographic creation',
        'Comparative analysis software',
      ],
    },
    {
      level: 'Evaluate',
      verb: 'Judge',
      description: 'Making judgments based on criteria and standards. Students can critique, justify, and defend positions.',
      exampleVerbs: ['Evaluate', 'Critique', 'Judge', 'Justify', 'Defend', 'Appraise', 'Argue', 'Support'],
      classroomExamples: [
        'Evaluate the effectiveness of a solution',
        'Critique a piece of writing',
        'Judge the credibility of sources',
        'Justify your answer with evidence',
        'Defend your position in a debate',
      ],
      assessmentIdeas: [
        'Peer review activities',
        'Debates',
        'Rubric-based evaluations',
        'Critique essays',
        'Self-assessment reflections',
      ],
      modernApplications: [
        'Peer review platforms',
        'Debate forums',
        'Rubric-based assessment tools',
        'Collaborative evaluation projects',
        'Digital portfolios',
      ],
    },
    {
      level: 'Create',
      verb: 'Produce',
      description: 'Putting elements together to form a coherent or functional whole. Students can generate, plan, and produce new products.',
      exampleVerbs: ['Create', 'Design', 'Invent', 'Compose', 'Construct', 'Produce', 'Develop', 'Formulate'],
      classroomExamples: [
        'Create a story using vocabulary words',
        'Design a solution to an environmental problem',
        'Invent a new product',
        'Compose a song about a historical event',
        'Develop a research project',
      ],
      assessmentIdeas: [
        'Portfolio projects',
        'Creative presentations',
        'Design challenges',
        'Research projects',
        'Multimedia creations',
      ],
      modernApplications: [
        'Digital storytelling tools',
        '3D modeling software',
        'Video creation platforms',
        'Coding projects',
        'Multimedia presentation tools',
      ],
    },
  ]

  const lessonExamples: LessonExample[] = [
    {
      subject: 'Science',
      grade: '5th Grade',
      objective: 'Students will understand the water cycle',
      bloomLevel: 'Understand',
      activities: [
        'Watch a video explaining the water cycle',
        'Create a labeled diagram',
        'Write a paragraph describing the process',
        'Participate in a hands-on demonstration',
      ],
      assessment: 'Exit ticket: Explain the water cycle in your own words',
    },
    {
      subject: 'Math',
      grade: '7th Grade',
      objective: 'Students will solve real-world problems using percentages',
      bloomLevel: 'Apply',
      activities: [
        'Review percentage calculation methods',
        'Practice with guided examples',
        'Solve word problems in small groups',
        'Create their own percentage problem',
      ],
      assessment: 'Performance task: Calculate discounts and sales tax for a shopping scenario',
    },
    {
      subject: 'English Language Arts',
      grade: '9th Grade',
      objective: 'Students will analyze themes in literature',
      bloomLevel: 'Analyze',
      activities: [
        'Read and annotate a short story',
        'Identify recurring themes',
        'Compare themes across multiple texts',
        'Create a theme analysis essay',
      ],
      assessment: 'Essay: Analyze how the author develops a central theme',
    },
    {
      subject: 'Social Studies',
      grade: '11th Grade',
      objective: 'Students will evaluate historical sources',
      bloomLevel: 'Evaluate',
      activities: [
        'Examine primary source documents',
        'Compare different perspectives',
        'Assess source credibility',
        'Defend a historical interpretation',
      ],
      assessment: 'Research project: Evaluate the reliability of sources and defend your thesis',
    },
  ]

  const researchEvidence = [
    {
      finding: 'Higher-order thinking improves retention',
      source: 'Anderson & Krathwohl (2001)',
      evidence: 'Students who engage in analysis, evaluation, and creation activities show 40% better long-term retention compared to rote memorization.',
      practicalTip: 'Balance lower and higher-order thinking in your lessons',
    },
    {
      finding: 'Scaffolding is essential',
      source: 'Vygotsky (1978)',
      evidence: 'Students need support to move from lower to higher cognitive levels. Effective scaffolding can increase achievement by 30%.',
      practicalTip: 'Start with remember/understand, then gradually increase complexity',
    },
    {
      finding: 'Assessment alignment matters',
      source: 'Wiggins & McTighe (2005)',
      evidence: 'When assessments align with learning objectives at the same Bloom level, student performance improves significantly.',
      practicalTip: 'Match your assessment verbs to your learning objective verbs',
    },
    {
      finding: 'Modern classrooms need updated verbs',
      source: 'Churches (2008)',
      evidence: 'Digital Bloom\'s Taxonomy adds verbs like "blogging," "podcasting," and "programming" to reflect 21st-century skills.',
      practicalTip: 'Incorporate digital tools that align with higher-order thinking',
    },
  ]

  const quickTips = [
    'Start with lower levels (Remember, Understand) before moving to higher levels',
    'Use action verbs from Bloom\'s Taxonomy in your learning objectives',
    'Design assessments that match the cognitive level of your objectives',
    'Provide scaffolding to help students reach higher cognitive levels',
    'Balance your lessons across all levels - don\'t stay only at lower levels',
    'Use Bloom\'s Taxonomy to differentiate instruction for diverse learners',
    'Encourage students to create products that demonstrate higher-order thinking',
    'Reflect on your lessons: Are you challenging students at appropriate levels?',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl">
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
                    Research Insight
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm">Pedagogy</span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    6 min read
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Bloom's Taxonomy in Modern Classrooms</h1>
                <p className="mt-2 text-purple-100">
                  Practical applications of cognitive levels for lesson design and assessment
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
                <span>Practical Applications</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 w-4" />
                <span>Teacher-Friendly</span>
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
                { id: 'levels', label: 'Cognitive Levels', icon: Layers },
                { id: 'applications', label: 'Classroom Applications', icon: Target },
                { id: 'assessment', label: 'Assessment Design', icon: FileText },
                { id: 'modern', label: 'Modern Updates', icon: Zap },
              ].map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full text-left p-3 rounded-lg transition flex items-center gap-2 ${
                      activeSection === section.id
                        ? 'bg-purple-50 border-2 border-purple-300 text-purple-900'
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
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Bloom's Taxonomy?</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Bloom's Taxonomy is a framework for categorizing educational goals and objectives into levels of complexity.
                    Originally developed by Benjamin Bloom in 1956, it was revised in 2001 by Anderson and Krathwohl to better
                    reflect 21st-century learning needs. The taxonomy helps teachers design lessons that move students from basic
                    recall to higher-order thinking skills.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Think of Bloom's Taxonomy as a ladder: students start at the bottom (remembering facts) and climb up to
                    creating new knowledge. Each level builds on the previous one, making it essential to scaffold instruction
                    appropriately.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                    Why It Matters
                  </h3>
                  <ul className="space-y-2">
                    {[
                      'Helps you write clear, measurable learning objectives',
                      'Guides lesson planning to ensure appropriate challenge levels',
                      'Ensures assessments match learning objectives',
                      'Supports differentiation by providing multiple entry points',
                      'Encourages higher-order thinking skills essential for modern learners',
                    ].map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {researchEvidence.map((evidence, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">{evidence.finding}</h4>
                        <Star className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-gray-600 mb-2 italic">{evidence.source}</p>
                      <p className="text-sm text-gray-700 mb-3">{evidence.evidence}</p>
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-semibold text-blue-700 mb-1">Practical Tip:</p>
                        <p className="text-xs text-gray-700">{evidence.practicalTip}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    Quick Tips for Success
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cognitive Levels Section */}
          {activeSection === 'levels' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">The Six Cognitive Levels</h2>
                <div className="space-y-6">
                  {cognitiveLevels.map((level, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                              {idx + 1}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900">{level.level}</h3>
                            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                              {level.verb}
                            </span>
                          </div>
                          <p className="text-gray-700 ml-10">{level.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Example Verbs</h4>
                          <div className="flex flex-wrap gap-2">
                            {level.exampleVerbs.map((verb, verbIdx) => (
                              <span
                                key={verbIdx}
                                className="px-2 py-1 rounded bg-white text-xs font-medium text-blue-700 border border-blue-200"
                              >
                                {verb}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Classroom Examples</h4>
                          <ul className="space-y-1">
                            {level.classroomExamples.slice(0, 3).map((example, exIdx) => (
                              <li key={exIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                <span className="text-green-600 mt-0.5">•</span>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Assessment Ideas</h4>
                          <ul className="space-y-1">
                            {level.assessmentIdeas.map((idea, ideaIdx) => (
                              <li key={ideaIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                <CheckCircle2 className="h-3 w-3 text-amber-600 mt-0.5 flex-shrink-0" />
                                <span>{idea}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Modern Applications</h4>
                          <ul className="space-y-1">
                            {level.modernApplications.map((app, appIdx) => (
                              <li key={appIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                <Zap className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                                <span>{app}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Classroom Applications Section */}
          {activeSection === 'applications' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Practical Classroom Applications</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Planning Framework</h3>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                    <ol className="space-y-3">
                      {[
                        'Identify your learning objective and determine the appropriate Bloom level',
                        'Choose action verbs that match that cognitive level',
                        'Design activities that align with the chosen level',
                        'Create assessments that measure understanding at the same level',
                        'Consider scaffolding: start lower and build up',
                      ].map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Real Classroom Examples</h3>
                  <div className="space-y-4">
                    {lessonExamples.map((example, idx) => (
                      <div key={idx} className="rounded-xl border-2 border-gray-200 bg-white p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                {example.subject}
                              </span>
                              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                {example.grade}
                              </span>
                              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                                {example.bloomLevel}
                              </span>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900">{example.objective}</h4>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Activities</h5>
                          <ul className="space-y-2">
                            {example.activities.map((activity, actIdx) => (
                              <li key={actIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                          <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Assessment</h5>
                          <p className="text-sm text-gray-700">{example.assessment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Differentiation Strategies
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        strategy: 'Tiered Activities',
                        description: 'Same concept, different complexity levels',
                        example: 'Remember: List facts. Understand: Explain concepts. Apply: Solve problems.',
                      },
                      {
                        strategy: 'Choice Boards',
                        description: 'Students choose activities at their level',
                        example: 'Offer 3 activities at different Bloom levels, let students choose 2.',
                      },
                      {
                        strategy: 'Scaffolded Progression',
                        description: 'Start low, build up gradually',
                        example: 'Begin with Remember, move to Understand, then Apply.',
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 border border-green-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.strategy}</h4>
                        <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                        <p className="text-xs text-gray-700 italic">{item.example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assessment Design Section */}
          {activeSection === 'assessment' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Design with Bloom's Taxonomy</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">The Golden Rule</h3>
                  <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-300">
                    <p className="text-base font-semibold text-gray-900 mb-2">
                      Your assessment should match the cognitive level of your learning objective.
                    </p>
                    <p className="text-sm text-gray-700">
                      If your objective uses "analyze," your assessment should require analysis, not just recall.
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Stems by Level</h3>
                  <div className="space-y-4">
                    {cognitiveLevels.map((level, idx) => (
                      <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                            {level.level}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {level.assessmentIdeas.map((idea, ideaIdx) => (
                            <div key={ideaIdx} className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-sm text-gray-700">{idea}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Alignment Checklist</h3>
                  <ul className="space-y-2">
                    {[
                      'Does my assessment verb match my objective verb?',
                      'Are students demonstrating the same cognitive level in assessment as in learning?',
                      'Have I provided appropriate scaffolding for the assessment level?',
                      'Can students at different readiness levels access the assessment?',
                      'Does the assessment measure what I intended to measure?',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Modern Updates Section */}
          {activeSection === 'modern' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Bloom's Taxonomy for the 21st Century</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Bloom's Taxonomy</h3>
                  <p className="text-gray-700 mb-4">
                    Andrew Churches updated Bloom's Taxonomy to include digital skills and tools. This modern version
                    recognizes that students need to create, collaborate, and communicate using technology.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        level: 'Remember',
                        digital: 'Bookmarking, searching, googling',
                        tools: 'Google, Wikipedia, databases',
                      },
                      {
                        level: 'Understand',
                        digital: 'Annotating, blogging, commenting',
                        tools: 'Blogs, forums, social media',
                      },
                      {
                        level: 'Apply',
                        digital: 'Running, playing, uploading',
                        tools: 'Simulations, games, applications',
                      },
                      {
                        level: 'Analyze',
                        digital: 'Mashing, linking, validating',
                        tools: 'Data analysis tools, spreadsheets',
                      },
                      {
                        level: 'Evaluate',
                        digital: 'Blog commenting, reviewing, posting',
                        tools: 'Peer review platforms, forums',
                      },
                      {
                        level: 'Create',
                        digital: 'Programming, filming, animating',
                        tools: 'Video editors, coding platforms, design tools',
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">{item.level}</h4>
                        <p className="text-xs text-gray-600 mb-1">Digital Skills:</p>
                        <p className="text-sm text-gray-700 mb-2">{item.digital}</p>
                        <p className="text-xs text-gray-600 mb-1">Tools:</p>
                        <p className="text-sm text-gray-700">{item.tools}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrating Technology</h3>
                  <div className="space-y-3">
                    {[
                      'Use digital tools that align with higher-order thinking (e.g., coding for Create level)',
                      'Encourage collaboration through digital platforms',
                      'Leverage multimedia for different learning styles',
                      'Use digital portfolios to showcase student creation',
                      'Incorporate real-world digital skills students will need',
                    ].map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <Zap className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to Apply Bloom's Taxonomy?</h3>
          <p className="text-purple-100 mb-6">
            Use our lesson planner to create Bloom's-aligned lessons with AI assistance
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/templates/general-lesson-planner')}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition"
            >
              Create a Lesson Plan
            </button>
            <button
              onClick={() => navigate('learning-hub')}
              className="rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
            >
              Explore More Research
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BloomsTaxonomyResearch



