import { useState } from 'react'
import {
  ListChecks,
  ChevronRight,
  Lightbulb,
  BookOpen,
  Target,
  Heart,
  FlaskConical,
  Languages,
  CheckCircle2,
} from 'lucide-react'
import { useSnackbar } from '../../../hooks/useSnackbar'

// TODO: Replace with backend API response later.
const STRATEGIES = [
  {
    id: 'inquiry-launch',
    title: 'Inquiry Launch',
    description: 'Curate short clips to launch your next project-based learning inquiry or case study.',
    Icon: Lightbulb,
    cardCls: 'border-blue-200 bg-blue-50 hover:border-blue-300',
    activeCls: 'border-blue-500 bg-blue-100',
    iconCls: 'bg-blue-100 text-blue-600',
    badgeCls: 'bg-blue-600',
    details: {
      teachingMode: 'Facilitated discovery',
      recommendedQuizType: 'Open-ended + Discussion',
      questionMix: '30% Higher-order thinking · 40% Discussion prompts · 30% Multiple choice',
      estimatedTime: '20–25 minutes',
      bestUseCase: 'Project-based learning launch, wonder walls, case study openers',
      teacherPrompt: '"What do you notice? What do you wonder? Where does this connect to your world?"',
      exportFormat: 'Google Forms (discussion mode) or printed reflection sheet',
      differentiationNote:
        'Provide sentence stems for ELL students. Offer visual anchor charts for concept support.',
    },
  },
  {
    id: 'flipped-mini-lesson',
    title: 'Flipped Mini-lesson',
    description: 'Assign explanatory videos for home viewing with instant comprehension checks when class starts.',
    Icon: BookOpen,
    cardCls: 'border-green-200 bg-green-50 hover:border-green-300',
    activeCls: 'border-green-500 bg-green-100',
    iconCls: 'bg-green-100 text-green-600',
    badgeCls: 'bg-green-600',
    details: {
      teachingMode: 'Asynchronous pre-learning',
      recommendedQuizType: 'Multiple choice + Quick check',
      questionMix: '50% Multiple choice · 30% Quick check · 20% Vocabulary',
      estimatedTime: '10–15 min (home) + 5 min in-class debrief',
      bestUseCase: 'Homework alternative, station rotation, flipped classroom model',
      teacherPrompt: '"Before class, watch the video and answer 3 questions. Bring your biggest question to discuss."',
      exportFormat: 'LMS embed (Google Classroom, Canvas) or QR code handout',
      differentiationNote: 'Allow extended time for async viewers. Provide a vocabulary preview sheet.',
    },
  },
  {
    id: 'career-spotlight',
    title: 'Career Spotlight',
    description: 'Highlight industry interviews and connect them to course standards with scenario-based questions.',
    Icon: Target,
    cardCls: 'border-purple-200 bg-purple-50 hover:border-purple-300',
    activeCls: 'border-purple-500 bg-purple-100',
    iconCls: 'bg-purple-100 text-purple-600',
    badgeCls: 'bg-purple-600',
    details: {
      teachingMode: 'Real-world connections',
      recommendedQuizType: 'Scenario-based + Higher-order thinking',
      questionMix: '40% Scenario-based · 40% Higher-order thinking · 20% Discussion',
      estimatedTime: '25–30 minutes',
      bestUseCase: 'Career & Technical Education, advisory, post-secondary readiness units',
      teacherPrompt: '"If you were in this person\'s role, what decision would you make? What skills would you need?"',
      exportFormat: 'Printed career exploration worksheet or digital portfolio entry',
      differentiationNote: 'Offer a career interest inventory alongside. Allow choice in response format (written or oral).',
    },
  },
  {
    id: 'sel-morning-meeting',
    title: 'SEL Morning Meeting',
    description: 'Use calming or empathy-building clips to kick off advisory with reflection prompts.',
    Icon: Heart,
    cardCls: 'border-rose-200 bg-rose-50 hover:border-rose-300',
    activeCls: 'border-rose-500 bg-rose-100',
    iconCls: 'bg-rose-100 text-rose-600',
    badgeCls: 'bg-rose-600',
    details: {
      teachingMode: 'Community building & reflection',
      recommendedQuizType: 'Discussion prompt + Reflection journal',
      questionMix: '60% Open reflection · 30% Discussion prompts · 10% Quick check',
      estimatedTime: '10–15 minutes',
      bestUseCase: 'Advisory periods, homeroom, beginning-of-unit relationship building',
      teacherPrompt: '"After watching, share one word that describes how the person in the video made you feel."',
      exportFormat: 'Printed reflection journal or anonymous digital exit ticket',
      differentiationNote: 'Allow drawing or symbol responses. Provide sentence starters. Never require sharing aloud.',
    },
  },
  {
    id: 'stem-lab-prep',
    title: 'STEM Lab Prep',
    description: 'Share lab demonstration videos before experiments to walk students through safety and setup.',
    Icon: FlaskConical,
    cardCls: 'border-orange-200 bg-orange-50 hover:border-orange-300',
    activeCls: 'border-orange-500 bg-orange-100',
    iconCls: 'bg-orange-100 text-orange-600',
    badgeCls: 'bg-orange-600',
    details: {
      teachingMode: 'Procedural preview & safety briefing',
      recommendedQuizType: 'Quick check + Lab skills',
      questionMix: '40% Procedure recall · 30% Safety protocol · 30% Prediction questions',
      estimatedTime: '12–18 minutes pre-lab',
      bestUseCase: 'Science labs, engineering design challenges, maker space sessions',
      teacherPrompt: '"Identify two safety precautions shown in the video. What would you do differently?"',
      exportFormat: 'Printed lab guide with built-in quiz checkpoints',
      differentiationNote: 'Pair students for lab roles based on quiz performance. Offer visual safety cards.',
    },
  },
  {
    id: 'language-listening-center',
    title: 'Language Listening Center',
    description: 'Supply authentic language videos with comprehension checks for multilingual classrooms.',
    Icon: Languages,
    cardCls: 'border-teal-200 bg-teal-50 hover:border-teal-300',
    activeCls: 'border-teal-500 bg-teal-100',
    iconCls: 'bg-teal-100 text-teal-600',
    badgeCls: 'bg-teal-600',
    details: {
      teachingMode: 'Listening comprehension & vocabulary acquisition',
      recommendedQuizType: 'Vocabulary development + Multiple choice',
      questionMix: '40% Vocabulary · 30% Listening comprehension · 30% Multiple choice',
      estimatedTime: '15–20 minutes',
      bestUseCase: 'ELL/ESL stations, world language classes, multilingual literacy blocks',
      teacherPrompt: '"Listen once for meaning, then again for vocabulary. Which word surprised you?"',
      exportFormat: 'Dual-language worksheet or digital vocabulary card set',
      differentiationNote: 'Enable captions. Allow native language annotations. Pair with bilingual anchor text.',
    },
  },
]

interface Props {
  onStrategyApplied?: (strategyTitle: string) => void
}

export function LessonFlowBuilder({ onStrategyApplied }: Props) {
  const { toast } = useSnackbar()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [appliedId, setAppliedId] = useState<string | null>(null)

  const active = STRATEGIES.find((s) => s.id === activeId) ?? null

  const handleApply = () => {
    if (!active) return
    setAppliedId(active.id)
    toast.success(`Strategy "${active.title}" applied to your quiz configuration.`)
    onStrategyApplied?.(active.title)
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ListChecks className="h-5 w-5 text-red-500" />
            Interactive Lesson Flow Builder
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a strategy to preview its classroom configuration.
          </p>
        </div>
        {appliedId && (
          <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Strategy: {STRATEGIES.find((s) => s.id === appliedId)?.title}
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {STRATEGIES.map((s) => {
          const isActive = activeId === s.id
          const Icon = s.Icon
          return (
            <button
              key={s.id}
              onClick={() => setActiveId(isActive ? null : s.id)}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${
                isActive ? s.activeCls : s.cardCls
              }`}
            >
              <div
                className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl ${s.iconCls}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <p className="font-semibold text-gray-900">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{s.description}</p>
            </button>
          )
        })}
      </div>

      {active && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 transition-all">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">
              Applied Strategy Preview — {active.title}
            </p>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${active.badgeCls}`}
            >
              Active
            </span>
          </div>

          <div className="grid gap-4 text-sm md:grid-cols-2">
            <DetailField label="Teaching mode" value={active.details.teachingMode} />
            <DetailField label="Recommended quiz type" value={active.details.recommendedQuizType} />
            <DetailField
              label="Suggested question mix"
              value={active.details.questionMix}
              wide
            />
            <DetailField label="Estimated classroom time" value={active.details.estimatedTime} />
            <DetailField label="Recommended export format" value={active.details.exportFormat} />
            <DetailField
              label="Best use case"
              value={active.details.bestUseCase}
              wide
            />
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Teacher prompt
            </p>
            <p className="italic text-gray-800">{active.details.teacherPrompt}</p>
          </div>

          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              Differentiation note
            </p>
            <p className="text-sm text-amber-900">{active.details.differentiationNote}</p>
          </div>

          <button
            onClick={handleApply}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            <ChevronRight className="h-4 w-4" />
            Apply Strategy to Quiz
          </button>
        </div>
      )}
    </div>
  )
}

function DetailField({
  label,
  value,
  wide = false,
}: {
  label: string
  value: string
  wide?: boolean
}) {
  return (
    <div className={wide ? 'md:col-span-2' : ''}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm text-gray-800">{value}</p>
    </div>
  )
}
