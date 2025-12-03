import {
  Lightbulb,
  Users,
  Beaker,
  ClipboardCheck,
  HeartPulse,
  Globe,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'

const instructionalTracks = [
  {
    title: 'Inquiry-Based Science',
    description: 'Guide students through NGSS-aligned phenomena investigations with scaffolded prompts and data tools.',
    icon: Beaker,
    highlights: [
      'Generate lab setups with differentiation for lab/no-lab environments',
      'Create claim-evidence reasoning rubrics tailored to each investigation',
      'Summarize student data and suggest next-lesson interventions',
    ],
  },
  {
    title: 'Literacy Workshop',
    description: 'Build reading and writing cycles that embed conferencing, feedback, and authentic publishing moments.',
    icon: Lightbulb,
    highlights: [
      'Plan mini-lessons driven by qualitative and quantitative text complexity',
      'Develop conferring notes and personalized feedback stems',
      'Offer family communication blurbs that recap weekly literacy goals',
    ],
  },
  {
    title: 'Project-Based Humanities',
    description: 'Launch interdisciplinary projects with community partnerships and real audiences.',
    icon: Globe,
    highlights: [
      'Draft driving questions and milestone rubrics',
      'Align tasks to social studies and ELA standards simultaneously',
      'Share exhibition logistics and student reflection prompts',
    ],
  },
]

const quickIdeas = [
  {
    icon: Users,
    title: 'Co-teaching & inclusion',
    description: 'Coordinate shared lesson plans, accommodations, and progress notes for co-teachers and specialists.',
  },
  {
    icon: ClipboardCheck,
    title: 'Assessment agility',
    description: 'Design formative checks, auto-generate feedback, and adapt assessments for multilingual learners.',
  },
  {
    icon: HeartPulse,
    title: 'Whole-child supports',
    description: 'Create SEL circles, restorative conversations, and family partnership scripts.',
  },
]

const ExploreUseCases = () => {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-sky-500 px-8 py-10 text-white shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/90">
            <Sparkles className="h-4 w-4" /> Explore use cases
          </div>
          <h1 className="text-3xl font-semibold lg:text-4xl">See how teachers apply AI assistance across the learning journey.</h1>
          <p className="text-white/80">
            These scenarios illustrate how the Teacher Assistant platform blends pedagogy, equity, and automation to
            reduce planning friction. Pick a use case to discover suggested templates, chatbot pairings, and workflow tips.
          </p>
        </div>
      </section>

      {/* Deep dive tracks */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Instructional playbooks</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {instructionalTracks.map((track) => {
            const Icon = track.icon
            return (
              <div key={track.title} className="flex h-full flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-primary-200 hover:shadow-md">
                <div className="space-y-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">{track.title}</h3>
                    <p className="text-sm text-gray-600">{track.description}</p>
                  </div>
                  <ul className="space-y-3 text-sm text-gray-600">
                    {track.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-500">
                  View recommended templates <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Quick ideas */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Quick win ideas</h2>
        <p className="mt-2 text-sm text-gray-600">
          Pair these workflows with favorites from the templates library or chatbots. Each quick win links to specific
          tools, giving teams a runway toward agile planning.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {quickIdeas.map((idea) => {
            const Icon = idea.icon
            return (
              <div key={idea.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:border-primary-200 hover:bg-primary-50/40">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary-500" />
                  <h3 className="text-sm font-semibold text-gray-900">{idea.title}</h3>
                </div>
                <p className="mt-3 text-sm text-gray-600">{idea.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-primary-100 bg-primary-50/70 p-6 text-primary-700 shadow-sm">
        <h2 className="text-lg font-semibold">Need a tailored implementation?</h2>
        <p className="mt-1 text-sm">
          Share your instructional challenge and we’ll curate templates, chatbots, and PD resources to accelerate results.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            Request personalised plan
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-600 hover:border-primary-400">
            Watch demo walkthrough
          </button>
        </div>
      </section>
    </div>
  )
}

export default ExploreUseCases

