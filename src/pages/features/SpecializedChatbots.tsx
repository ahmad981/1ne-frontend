import {
  Bot,
  Filter,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  BookOpen,
  Atom,
  Beaker,
  Palette,
  BarChart3,
  Globe,
  HeartPulse,
  GraduationCap,
  Star,
  Lightbulb,
  ClipboardList,
  Zap,
  Brain,
  Code,
  Briefcase,
  Music,
  Camera,
  Lock,
  CheckCircle2,
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
              <button className="mt-6 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-500">
                Start chatting (FREE)
              </button>
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

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {largeLanguageModels.map((model, idx) => {
            const Icon = model.icon
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 transition hover:border-indigo-300 hover:shadow-lg"
              >
                <div className="absolute right-4 top-4">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                    <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      {model.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">{model.model}</p>
                  <p className="mt-2 text-sm text-gray-600">{model.description}</p>
                </div>
                <button className="mt-6 w-full rounded-full border-2 border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100">
                  Upgrade to access
                </button>
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
                {subject === 'English' && (
                  <Link
                    to="/dashboard/chatbots/core-academics"
                    className="text-xs font-semibold uppercase tracking-wide text-primary-600 underline underline-offset-4 hover:text-primary-500"
                  >
                    Explore more
                  </Link>
                )}
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
                        <button className="text-xs font-semibold text-primary-600 hover:text-primary-500">
                          View details
                        </button>
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
