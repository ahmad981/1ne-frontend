import { useState, type ElementType } from 'react'
import {
  Clock,
  Sparkles,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  FileText,
  ListChecks,
} from 'lucide-react'

type CapabilityStatus = 'demo' | 'future'

interface Capability {
  id: string
  title: string
  Icon: ElementType
  tagline: string
  benefit: string
  exampleOutput: string
  backendReq: string
  status: CapabilityStatus
}

// TODO: Replace with backend API response later.
const CAPABILITIES: Capability[] = [
  {
    id: 'adaptive-difficulty',
    title: 'Adaptive difficulty',
    Icon: Sparkles,
    tagline: 'Dynamically adjusts question difficulty based on student response patterns.',
    benefit:
      'Keeps every learner in their zone of proximal development — no more one-size-fits-all quizzes.',
    exampleOutput:
      'Student scores 80% on recall questions → System surfaces 2 higher-order thinking questions in the next segment automatically.',
    backendReq:
      'Student response stream API, real-time difficulty scoring model, LLM re-generation endpoint.',
    status: 'demo',
  },
  {
    id: 'curriculum-tagging',
    title: 'Curriculum tagging engine',
    Icon: BookOpen,
    tagline: 'Maps each question to district standards — NGSS, Common Core, TEKS, and custom frameworks.',
    benefit:
      'Saves hours of manual alignment work. Every question arrives pre-tagged for lesson planning and reporting.',
    exampleOutput:
      'Q3: "What drives cellular respiration?" → NGSS HS-LS1-7 · DOK Level 2 · Bloom\'s: Application.',
    backendReq:
      'Standards database API, curriculum alignment ML model, district metadata sync.',
    status: 'demo',
  },
  {
    id: 'playlist-analytics',
    title: 'Student playlist analytics',
    Icon: GraduationCap,
    tagline: 'Track mastery by clip, regroup learners, and export insight dashboards.',
    benefit:
      'Instantly see which video segments are causing confusion — no manual data entry required.',
    exampleOutput:
      '7 students struggled with segment 3 (2:30–4:15). Recommended: re-teach cellular respiration vocabulary.',
    backendReq:
      'Student identity API, learning progress events, analytics aggregation service.',
    status: 'future',
  },
  {
    id: 'accessibility',
    title: 'Accessibility assistant',
    Icon: ShieldCheck,
    tagline: 'Auto-generates captions, alt-text, and screen-reader-friendly quiz formats.',
    benefit:
      'Meets WCAG 2.2 standards without extra teacher effort. Every student can access every quiz.',
    exampleOutput:
      'Quiz exported with: ARIA labels on all inputs, image alt-text, and a caption file (.vtt) attached to the video source.',
    backendReq:
      'Caption generation service (Whisper API), WCAG compliance checker, audio description generator.',
    status: 'demo',
  },
  {
    id: 'lesson-plan',
    title: 'Auto-generated lesson plan',
    Icon: FileText,
    tagline: 'Converts your quiz into a full 60-minute lesson plan with warm-up, activities, and closure.',
    benefit:
      'Saves 45+ minutes of planning per lesson. Teacher reviews and personalises; AI does the structure.',
    exampleOutput:
      'Lesson: Photosynthesis (Gr. 9) · 5 min warm-up · 15 min video + checkpoints · 20 min jigsaw · 10 min exit ticket.',
    backendReq:
      'Lesson plan generation endpoint, school calendar API for pacing, curriculum map integration.',
    status: 'future',
  },
  {
    id: 'worksheet-from-quiz',
    title: 'Worksheet from quiz',
    Icon: ListChecks,
    tagline: 'Converts any quiz into a print-ready, differentiated worksheet with one click.',
    benefit:
      'No copy-paste, no reformatting. Three differentiation tiers generated automatically.',
    exampleOutput:
      'Output: 3 worksheet versions (foundational · grade-level · extension), formatted for print, with answer key.',
    backendReq:
      'PDF generation service (already scaffolded), differentiation tier engine, worksheet template library.',
    status: 'demo',
  },
]

const STATUS_CONFIG: Record<CapabilityStatus, { label: string; badgeCls: string }> = {
  demo: {
    label: 'Preview capability',
    badgeCls: 'border-amber-400 bg-amber-100 text-amber-800',
  },
  future: {
    label: 'Backend-ready concept',
    badgeCls: 'border-gray-400 bg-gray-200 text-gray-700',
  },
}

export function AICapabilityPreview() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-md">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/70">
        <Clock className="h-4 w-4 text-amber-300" />
        AI Capability Preview
      </h3>
      <p className="mt-1 text-xs text-white/50">
        Click any capability to explore what it does and how it will work.
      </p>

      <ul className="mt-4 space-y-2 text-sm">
        {CAPABILITIES.map((cap) => {
          const isActive = activeId === cap.id
          const cfg = STATUS_CONFIG[cap.status]
          const Icon = cap.Icon
          return (
            <li key={cap.id}>
              <button
                onClick={() => setActiveId(isActive ? null : cap.id)}
                className={`w-full rounded-xl p-3 text-left transition-all ${
                  isActive
                    ? 'bg-white/15 ring-1 ring-amber-300/60'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0 text-amber-300" />
                  <p className="font-semibold">{cap.title}</p>
                  <span
                    className={`ml-auto flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cfg.badgeCls}`}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="mt-1 pl-6 text-xs text-white/60">{cap.tagline}</p>
              </button>

              {isActive && (
                <div className="mt-2 rounded-xl bg-white/10 p-4 text-xs space-y-3">
                  <div>
                    <p className="mb-1 font-semibold text-amber-300">Teacher benefit</p>
                    <p className="text-white/80 leading-relaxed">{cap.benefit}</p>
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-amber-300">Example output</p>
                    <p className="text-white/80 leading-relaxed italic">{cap.exampleOutput}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                      Backend handoff note
                    </p>
                    <p className="text-white/60 leading-relaxed">{cap.backendReq}</p>
                  </div>
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.badgeCls}`}
                  >
                    {cfg.label} — Available in demo mode
                  </span>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
