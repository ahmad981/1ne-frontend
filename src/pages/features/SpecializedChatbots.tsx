import {
  Bot,
  Filter,
  Plus,
  Search,
  Sparkles,
  BookOpen,
  Atom,
  Beaker,
  Palette,
  Globe,
  Star,
  Brain,
  Code,
  Briefcase,
  Music,
  Camera,
  Lock,
  CheckCircle2,
  Shield,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'

// FREE Chat Bot
const freeChatBot = {
  name: 'General Teaching Assistant',
  description: 'Your versatile AI companion for lesson planning, assessment ideas, and classroom management support. Perfect for getting started with AI-powered teaching tools.',
  icon: Bot,
  access: 'FREE',
  features: [
    'Lesson planning assistance',
    'Assessment ideas generation',
    'Classroom management tips',
    'Quick Q&A support',
  ],
}

// Large Language Models (Subscription)
const largeLanguageModels = [
  {
    name: 'GPT-4 Teaching Assistant',
    description: 'Powered by OpenAI GPT-4. Advanced reasoning and creative lesson design with deep pedagogical understanding.',
    icon: Brain,
    model: 'GPT-4',
    rating: '4.9★',
  },
  {
    name: 'Claude Education Pro',
    description: 'Anthropic Claude optimized for education. Excellent at curriculum alignment and ethical AI practices.',
    icon: Brain,
    model: 'Claude 3.5',
    rating: '4.8★',
  },
  {
    name: 'Gemini Education Suite',
    description: 'Google Gemini fine-tuned for K-12 education. Strong multilingual support and multimodal capabilities.',
    icon: Brain,
    model: 'Gemini Pro',
    rating: '4.7★',
  },
]

// Platform Data Trained Chatbots by Subject (Subscription)
const subjectBots = {
  English: [
    {
      name: 'Literacy Lab Coach',
      description: 'Guided reading strategies, text complexity analysis, and writing feedback tailored to grade levels.',
      icon: BookOpen,
      rating: '4.9★',
    },
    {
      name: 'Grammar & Writing Mentor',
      description: 'Grammar instruction, writing workshop facilitation, and peer review guidance.',
      icon: BookOpen,
      rating: '4.8★',
    },
    {
      name: 'Literature Analysis Expert',
      description: 'Literary analysis, theme exploration, and discussion prompts for classic and contemporary texts.',
      icon: BookOpen,
      rating: '4.7★',
    },
    {
      name: 'Advanced Knowledge and Skills Coach',
      description: 'This tool will increase teachers\' knowledge and skills on modern pedagogical methods.',
      icon: BookOpen,
      rating: '4.9★',
    },
    {
      name: 'UNEC Academic Development & Innovation',
      description: 'Comprehensive program for syllabus design, assessment, digital literacy, AI integration, and student-centered teaching methods.',
      icon: BookOpen,
      rating: '5.0★',
    },
  ],
  Mathematics: [
    {
      name: 'Adaptive Math Strategist',
      description: 'Differentiated problem sets, step-by-step modeling, and conceptual understanding support.',
      icon: Atom,
      rating: '4.9★',
    },
    {
      name: 'Problem-Solving Coach',
      description: 'Real-world math applications, word problem strategies, and mathematical reasoning development.',
      icon: Atom,
      rating: '4.8★',
    },
    {
      name: 'Algebra & Geometry Tutor',
      description: 'Visual explanations, proof strategies, and scaffolded practice for advanced mathematics.',
      icon: Atom,
      rating: '4.7★',
    },
  ],
  Sciences: [
    {
      name: 'STEM Inquiry Mentor',
      description: 'NGSS-aligned investigations, engineering design challenges, and scientific method guidance.',
      icon: Beaker,
      rating: '4.9★',
    },
    {
      name: 'Lab Safety & Protocol Advisor',
      description: 'Safety protocols, experiment design, and hands-on activity planning for science labs.',
      icon: Beaker,
      rating: '4.8★',
    },
    {
      name: 'Environmental Science Guide',
      description: 'Climate education, sustainability projects, and ecological systems understanding.',
      icon: Beaker,
      rating: '4.7★',
    },
  ],
  Business: [
    {
      name: 'Business Studies Mentor',
      description: 'Entrepreneurship, economics, financial literacy, and real-world business scenarios.',
      icon: Briefcase,
      rating: '4.8★',
    },
    {
      name: 'Career Readiness Coach',
      description: 'Resume building, interview prep, professional skills, and industry insights.',
      icon: Briefcase,
      rating: '4.7★',
    },
    {
      name: 'Marketing & Branding Strategist',
      description: 'Marketing fundamentals, branding strategies, digital marketing, and market research.',
      icon: Briefcase,
      rating: '4.8★',
    },
  ],
  Arts: [
    {
      name: 'Visual Arts Studio Assistant',
      description: 'Art history, technique guidance, portfolio development, and creative project ideas.',
      icon: Palette,
      rating: '4.8★',
    },
    {
      name: 'Music & Performance Coach',
      description: 'Music theory, composition, performance techniques, and ensemble coordination.',
      icon: Music,
      rating: '4.7★',
    },
    {
      name: 'Drama & Theater Director',
      description: 'Script analysis, character development, stage direction, and production planning.',
      icon: Camera,
      rating: '4.6★',
    },
  ],
  Technology: [
    {
      name: 'Coding & Programming Tutor',
      description: 'Programming concepts, debugging help, project-based learning, and computational thinking.',
      icon: Code,
      rating: '4.9★',
    },
    {
      name: 'Digital Literacy Advisor',
      description: 'Digital citizenship, online safety, media literacy, and technology integration strategies.',
      icon: Code,
      rating: '4.8★',
    },
    {
      name: 'AI & Machine Learning Educator',
      description: 'AI concepts for students, ethical AI discussions, and hands-on ML projects.',
      icon: Brain,
      rating: '4.7★',
    },
  ],
}

const SpecializedChatbots = () => {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-sky-500 px-8 py-10 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              <Sparkles className="h-4 w-4" /> AI Teaching Assistants
            </div>
            <h1 className="text-3xl font-semibold lg:text-4xl">Meet your specialised AI co-teachers.</h1>
            <p className="text-white/80">
              Choose from free general assistance or premium subject-specific bots trained on curriculum data and
              pedagogical best practices.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm transition hover:bg-primary-50">
                <Plus className="h-4 w-4" /> Start a new chat
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-white/50 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                View release notes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Controls */}
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search by subject, standard, or teaching goal"
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-200 hover:text-primary-600">
            <Filter className="h-4 w-4" /> All bots
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-200 hover:text-primary-600">
            <Star className="h-4 w-4 text-amber-500" /> Favorites
          </button>
        </div>
      </section>

      {/* FREE Chat Bot Section */}
      <section className="rounded-3xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-gray-900">FREE Plan Access</h2>
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  FREE
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Start with our general teaching assistant at no cost</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border-2 border-green-300 bg-white p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <freeChatBot.icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-900">{freeChatBot.name}</h3>
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  <Star className="h-3 w-3" /> 4.8★
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{freeChatBot.description}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {freeChatBot.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    {feature}
                  </div>
                ))}
              </div>
              <Link
                to="/dashboard/chatbots/general-teaching-assistant"
                className="mt-6 inline-block rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-500 transition"
              >
                Start chatting (FREE)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Large Language Models Section */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-gray-900">Large Language Models</h2>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  <Lock className="inline h-3 w-3" /> Subscription
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Access premium AI models from leading providers, optimized for education
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {largeLanguageModels.map((model, idx) => {
            const Icon = model.icon
            const isGPT4 = model.name === 'GPT-4 Teaching Assistant'
            const isClaude = model.name === 'Claude Education Pro'
            const isGemini = model.name === 'Gemini Education Suite'
            
            return (
              <div
                key={idx}
                className={`group relative rounded-2xl border-2 transition-all duration-300 ${
                  isGPT4
                    ? 'border-amber-300 bg-gradient-to-br from-amber-50 via-white to-purple-50 shadow-xl hover:shadow-2xl hover:border-amber-400 p-7'
                    : isClaude
                    ? 'border-blue-300 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-xl hover:shadow-2xl hover:border-blue-400 p-7'
                    : isGemini
                    ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-xl hover:shadow-2xl hover:border-emerald-400 p-7'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg p-6'
                }`}
              >
                {!isGPT4 && !isClaude && !isGemini && (
                  <div className="absolute right-4 top-4">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                
                {/* Icon Section */}
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl mb-4 ${
                  isGPT4
                    ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg ring-2 ring-amber-100'
                    : isClaude
                    ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 shadow-lg ring-2 ring-blue-100'
                    : isGemini
                    ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-lg ring-2 ring-emerald-100'
                    : 'bg-indigo-100 text-indigo-600'
                }`}>
                  <Icon className={`h-7 w-7 ${(isGPT4 || isClaude || isGemini) ? 'text-white' : ''}`} />
                </div>

                {/* Content Section */}
                <div className="space-y-3">
                  {/* Title and Badges */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-xl font-bold ${(isGPT4 || isClaude || isGemini) ? 'text-gray-900' : 'text-gray-900'}`}>
                        {model.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        {model.rating}
                      </span>
                      {isGPT4 && (
                        <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                          <Star className="h-3.5 w-3.5" />
                          PREMIUM
                        </span>
                      )}
                      {isClaude && (
                        <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                          <Shield className="h-3.5 w-3.5" />
                          ETHICAL AI
                        </span>
                      )}
                      {isGemini && (
                        <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                          <Globe className="h-3.5 w-3.5" />
                          MULTILINGUAL
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed ${
                    (isGPT4 || isClaude || isGemini) ? 'text-gray-700' : 'text-gray-600'
                  }`}>
                    {model.description}
                  </p>

                </div>

                {/* Action Button */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  {isGPT4 ? (
                    <Link
                      to="/dashboard/chatbots/gpt4-teaching-assistant"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-amber-500 bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-sm font-bold text-white hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Sparkles className="h-4 w-4" />
                      Start Chatting (Premium)
                    </Link>
                  ) : isClaude ? (
                    <Link
                      to="/dashboard/chatbots/claude-education-pro"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-blue-500 bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 text-sm font-bold text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Shield className="h-4 w-4" />
                      Start Chatting (Premium)
                    </Link>
                  ) : isGemini ? (
                    <Link
                      to="/dashboard/chatbots/gemini-education-suite"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-500 bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-bold text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Sparkles className="h-4 w-4" />
                      Start Chatting (Premium)
                    </Link>
                  ) : (
                    <button className="w-full rounded-xl border-2 border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 transition">
                      Upgrade to access
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Platform Data Trained Chatbots by Subject */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-gray-900">Subject-Specific Specialists</h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                <Lock className="inline h-3 w-3" /> Subscription
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Platform-trained bots with deep curriculum knowledge and pedagogical expertise for each subject area
            </p>
          </div>
        </div>

        {Object.entries(subjectBots).map(([subject, bots]) => {
          const subjectIcons: Record<string, any> = {
            English: BookOpen,
            Mathematics: Atom,
            Sciences: Beaker,
            Business: Briefcase,
            Arts: Palette,
            Technology: Code,
          }
          const SubjectIcon = subjectIcons[subject] || Bot
          const subjectColors: Record<string, string> = {
            English: 'bg-blue-50 text-blue-600 border-blue-200',
            Mathematics: 'bg-green-50 text-green-600 border-green-200',
            Sciences: 'bg-purple-50 text-purple-600 border-purple-200',
            Business: 'bg-amber-50 text-amber-600 border-amber-200',
            Arts: 'bg-pink-50 text-pink-600 border-pink-200',
            Technology: 'bg-indigo-50 text-indigo-600 border-indigo-200',
          }

          return (
            <div
              key={subject}
              className="rounded-3xl border border-gray-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-6 shadow-md"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${subjectColors[subject]}`}>
                    <SubjectIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{subject}</h3>
                    <p className="text-sm text-gray-600">{bots.length} specialized bots available</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bots.map((bot, idx) => {
                  const Icon = bot.icon
                  return (
                    <div
                      key={idx}
                      className="group relative rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-primary-200 hover:shadow-md"
                    >
                      <div className="absolute right-4 top-4">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{bot.name}</p>
                            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                              {bot.rating}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">{bot.description}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        {bot.name === 'Literacy Lab Coach' ? (
                          <Link
                            to="/dashboard/chatbots/literacy-lab-coach"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Literature Analysis Expert' ? (
                          <Link
                            to="/dashboard/chatbots/literature-analysis-expert"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Grammar & Writing Mentor' ? (
                          <Link
                            to="/dashboard/chatbots/grammar-writing-mentor"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Advanced Knowledge and Skills Coach' ? (
                          <Link
                            to="/dashboard/chatbots/advanced-knowledge-skills-coach"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'UNEC Academic Development & Innovation' ? (
                          <Link
                            to="/dashboard/chatbots/unec-academic-development"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Adaptive Math Strategist' ? (
                          <Link
                            to="/dashboard/chatbots/adaptive-math-strategist"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Algebra & Geometry Tutor' ? (
                          <Link
                            to="/dashboard/chatbots/algebra-geometry-tutor"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'STEM Inquiry Mentor' ? (
                          <Link
                            to="/dashboard/chatbots/stem-inquiry-mentor"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Problem-Solving Coach' ? (
                          <Link
                            to="/dashboard/chatbots/problem-solving-coach"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Coding & Programming Tutor' ? (
                          <Link
                            to="/dashboard/chatbots/coding-programming-tutor"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Visual Arts Studio Assistant' ? (
                          <Link
                            to="/dashboard/chatbots/visual-arts-studio-assistant"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Business Studies Mentor' ? (
                          <Link
                            to="/dashboard/chatbots/business-studies-mentor"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Career Readiness Coach' ? (
                          <Link
                            to="/dashboard/chatbots/career-readiness-coach"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Lab Safety & Protocol Advisor' ? (
                          <Link
                            to="/dashboard/chatbots/lab-safety-protocol-advisor"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Environmental Science Guide' ? (
                          <Link
                            to="/dashboard/chatbots/environmental-science-guide"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Music & Performance Coach' ? (
                          <Link
                            to="/dashboard/chatbots/music-performance-coach"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Drama & Theater Director' ? (
                          <Link
                            to="/dashboard/chatbots/drama-theater-director"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Digital Literacy Advisor' ? (
                          <Link
                            to="/dashboard/chatbots/digital-literacy-advisor"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'AI & Machine Learning Educator' ? (
                          <Link
                            to="/dashboard/chatbots/ai-machine-learning-educator"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : bot.name === 'Marketing & Branding Strategist' ? (
                          <Link
                            to="/dashboard/chatbots/marketing-branding-strategist"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                          >
                            View details
                          </Link>
                        ) : (
                          <button className="text-xs font-semibold text-primary-600 hover:text-primary-500">
                            View details
                          </button>
                        )}
                        <button className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                          Upgrade
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>

      {/* Subscription CTA */}
      <section className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8 shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-900">Unlock premium AI teaching assistants</h2>
            <p className="mt-2 text-sm text-gray-600">
              Get access to all subject-specific bots, large language models, and advanced features. Start your free
              trial today.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600" /> 50+ specialized bots
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600" /> Premium AI models
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600" /> Advanced analytics
              </div>
            </div>
          </div>
          <button className="rounded-full bg-amber-600 px-8 py-3 text-sm font-semibold text-white hover:bg-amber-500">
            Start free trial
          </button>
        </div>
      </section>
    </div>
  )
}

export default SpecializedChatbots
