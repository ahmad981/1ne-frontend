import { useMemo } from 'react'

const literacyBots = [
  {
    name: 'Literacy Lab Coach',
    focus: 'Guided reading routines, text complexity ladders, and writing feedback stems.',
    bestFor: 'English Language Arts, Humanities, IB Language & Literature',
    differentiation: 'Generates leveled passages and conferencing questions for mixed-readiness groups.',
  },
  {
    name: 'Vocabulary Spiral Designer',
    focus: 'Academic vocabulary routines, morphology breakdowns, and quick retrieval practice.',
    bestFor: 'Upper elementary through high school language studies',
    differentiation: 'Suggests Greek/Latin roots, multilingual connections, and pronunciation guides.',
  },
]

const mathScienceBots = [
  {
    name: 'Adaptive Math Strategist',
    focus: 'Step-by-step scaffolds for problem solving, mistake analysis, and mastery checks.',
    bestFor: 'Middle and high school algebra, geometry, and integrated maths courses',
    differentiation: 'Provides worked examples, challenge extensions, and intervention mini-lessons.',
  },
  {
    name: 'STEM Inquiry Mentor',
    focus: 'Investigation prompts, lab report frames, and engineering design briefs.',
    bestFor: 'NGSS-aligned units, robotics electives, STEM academies',
    differentiation: 'Aligns prompts to the 3 dimensions, includes safety notes, and real-world careers.',
  },
]

const humanitiesBots = [
  {
    name: 'Discussion Compass',
    focus: 'Socratic seminar questions, debate counterpoints, and evidence trackers.',
    bestFor: 'Social Studies, Civics, Economics, Philosophy electives',
    differentiation: 'Offers student-friendly summaries and tiered argument starters.',
  },
  {
    name: 'Primary Source Analyst',
    focus: 'Source backgrounders, document-based questions, and historiography angles.',
    bestFor: 'AP/IB history routes, inquiry-based humanities projects',
    differentiation: 'Highlights bias, context, and cross-curricular links for multi-perspective writing.',
  },
]

const CoreAcademicsShowcase = () => {
  const planningHighlights = useMemo(
    () => [
      {
        label: 'Lesson-ready briefs',
        description:
          'Each bot packages a mini teacher guide: learning goals, key visuals, anticipated misconceptions, and suggested discussion pathways.',
      },
      {
        label: 'Assessment alignment',
        description:
          'Export formative checkpoints mapped to standards or success criteria for quick LMS uploads and PLC sharing.',
      },
      {
        label: 'Teacher co-creation',
        description:
          'Bots respond to your prompts and classroom data— fine-tune tone, complexity, and modalities in seconds.',
      },
    ],
    []
  )

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-8 py-12 text-white shadow-xl">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Core Academics</p>
          <h1 className="text-3xl font-semibold leading-tight">
            Deepen academic rigor with subject-specific intelligent assistants.
          </h1>
          <p className="text-base text-white/80">
            Explore classroom-tested bots that extend the reach of your PLCs—rooted in disciplinary literacy, STEM
            inquiry, and humanities scholarship. Each assistant is vetted by master teachers and instructional coaches.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {planningHighlights.map((highlight) => (
          <div key={highlight.label} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">{highlight.label}</p>
            <p className="mt-3 text-sm text-gray-600">{highlight.description}</p>
          </div>
        ))}
      </section>

      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">Literacy & language craft</h2>
          <p className="text-sm text-gray-600">
            Amplify evidence-based reading and writing workshops with bots that adapt to diverse learners and curricular
            frameworks.
          </p>
        </div>
        <div className="divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white">
          {literacyBots.map((bot) => (
            <article key={bot.name} className="space-y-3 px-6 py-5">
              <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{bot.name}</h3>
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{bot.bestFor}</span>
              </header>
              <p className="text-sm text-gray-700">{bot.focus}</p>
              <p className="rounded-2xl bg-indigo-50 px-4 py-2 text-xs text-indigo-700">{bot.differentiation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">Mathematics, science, and engineering</h2>
          <p className="text-sm text-gray-600">
            Pair every investigation or concept launch with smart scaffolds, lab prompts, and performance tasks.
          </p>
        </div>
        <div className="divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white">
          {mathScienceBots.map((bot) => (
            <article key={bot.name} className="space-y-3 px-6 py-5">
              <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{bot.name}</h3>
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{bot.bestFor}</span>
              </header>
              <p className="text-sm text-gray-700">{bot.focus}</p>
              <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-xs text-emerald-700">{bot.differentiation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">Humanities and civic discourse</h2>
          <p className="text-sm text-gray-600">
            Deepen analytical writing, inquiry, and debate with assistants steeped in disciplinary thinking routines.
          </p>
        </div>
        <div className="divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white">
          {humanitiesBots.map((bot) => (
            <article key={bot.name} className="space-y-3 px-6 py-5">
              <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{bot.name}</h3>
                <span className="text-xs font-semibold uppercase tracking-wide text-rose-600">{bot.bestFor}</span>
              </header>
              <p className="text-sm text-gray-700">{bot.focus}</p>
              <p className="rounded-2xl bg-rose-50 px-4 py-2 text-xs text-rose-700">{bot.differentiation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Implementation pathway</h2>
        <ol className="mt-4 space-y-4 text-sm text-gray-700">
          <li>
            <span className="font-semibold text-gray-900">1. Classroom pilots</span> — Select one literacy and one STEM
            bot to trial over a two-week mini-unit; collect student artifacts and teacher reflections.
          </li>
          <li>
            <span className="font-semibold text-gray-900">2. PLC integration</span> — Import exemplar prompts into team
            planning agendas and refine with your local curriculum mapping.
          </li>
          <li>
            <span className="font-semibold text-gray-900">3. Scale and measure</span> — Track usage analytics, student
            growth evidence, and share best practices through your learning hub.
          </li>
        </ol>
      </section>
    </div>
  )
}

export default CoreAcademicsShowcase



