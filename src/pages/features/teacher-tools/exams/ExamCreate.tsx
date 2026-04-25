import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsWizardStepper, ContentSourcesPanel } from '../components'
import { Phase2Badge } from '../components/Phase2Lock'
import { useContentSourcesForm } from '../hooks/useContentSourcesForm'
import { demoClasses } from '../demo/teacherToolsDemoData'
import { formatSourceSummary, generateExamSectionStubs } from '../demo/generationFromSources'
import type { ExamSectionStub } from '../demo/generationFromSources'
import { GRADES, SUBJECTS } from '../types'
import { newDemoId } from '../demo/newDemoId'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
import type { DemoQuiz } from '../demo/teacherToolsDemoData'
import { downloadQuizPdf } from '../utils/generateQuizPdf'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'
import { AlertCircle, ArrowDown, ArrowUp, Calendar, Download, Eye, FileJson, ListOrdered, Pencil, PlusCircle, RefreshCw, ShieldCheck, Sparkles, Trash2, Users } from 'lucide-react'
import { QuizGeneratingOverlay } from '../quiz/components/QuizGeneratingOverlay'
import {
  DEFAULT_HANDOUT_LAYOUT,
  LINE_HEIGHT_PRESETS,
  QUESTION_GAP_PRESETS,
  RULED_LINE_SPACING_PRESETS,
  type HandoutLayoutOpts,
} from '../quiz/config/handoutLayoutConfig'

const BUILD_STEPS = ['Configure & generate', 'Review & schedule']

const EXAM_TYPES = ['Unit test', 'Midterm', 'Final', 'Mock', 'Semester']
const TERMS = ['Term 1', 'Term 2', 'Term 3', 'Semester 1', 'Semester 2', 'Full year']

function classKeyForGrade(grade: string) {
  return demoClasses.find((c) => c.grade === grade)?.key ?? demoClasses[0]?.key ?? 'g8c'
}

function minutesBetween(isoStart: string, isoEnd: string) {
  const a = new Date(isoStart).getTime()
  const b = new Date(isoEnd).getTime()
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return 60
  return Math.round((b - a) / 60000)
}

function fmtDateTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function StepHeader({ step, kicker, title, subtitle }: {
  step: number; kicker: string; title: string; subtitle: string
}) {
  return (
    <div className="flex gap-4 border-b border-gray-100 pb-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-600/25">
        {step}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">{kicker}</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-gray-900">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">{subtitle}</p>
      </div>
    </div>
  )
}

export default function ExamCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const templateToastRef = useRef(false)
  const { examId } = useParams<{ examId?: string }>()
  const isEdit = location.pathname.endsWith('/edit')
  const { toast } = useSnackbar()
  const { api } = useTeacherToolsDemo()

  const [phase, setPhase] = useState<'build' | 'review'>(isEdit ? 'review' : 'build')
  const [generating, setGenerating] = useState(false)
  const [genProgress, setGenProgress] = useState(0.15)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [buildErrors, setBuildErrors] = useState<string[]>([])
  const [generatedSections, setGeneratedSections] = useState<ExamSectionStub[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [handoutLayout, setHandoutLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)
  const [draftLayout, setDraftLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)

  const [title, setTitle] = useState('Summative exam')
  const [examType, setExamType] = useState('Unit test')
  const [term, setTerm] = useState('Term 2')
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [subject, setSubject] = useState<string>(SUBJECTS[2])
  const [grade, setGrade] = useState<string>(GRADES[2])
  const [internationalStandard, setInternationalStandard] = useState<'National Board' | 'Cambridge-style' | 'IB-style' | 'SAT-style'>('Cambridge-style')
  const [sectionTargetCount, setSectionTargetCount] = useState(4)

  // Exam rules
  const [controlledMode, setControlledMode] = useState(true)
  const [randomisation, setRandomisation] = useState(true)
  const [webcamPreview, setWebcamPreview] = useState(false)
  const [autoSubmit, setAutoSubmit] = useState(true)

  // Schedule
  const defaultDate = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 10)
    return d.toISOString().slice(0, 10)
  })()
  const [scheduleDate, setScheduleDate] = useState(defaultDate)
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [scheduleStartIso, setScheduleStartIso] = useState<string | null>(null)
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [discardOpen, setDiscardOpen] = useState(false)
  const [loadedTopic, setLoadedTopic] = useState<string | undefined>(undefined)
  const [hydrateReady, setHydrateReady] = useState(!isEdit)
  const [publishPending, setPublishPending] = useState(false)
  const [saveDraftPending, setSaveDraftPending] = useState(false)
  const [completionMeta, setCompletionMeta] = useState({ completionPct: 0 })
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null)
  const [editingSectionTitle, setEditingSectionTitle] = useState('')
  const [editingSectionMarks, setEditingSectionMarks] = useState(10)
  const [addingSectionOpen, setAddingSectionOpen] = useState(false)
  const [addingSectionTitle, setAddingSectionTitle] = useState('')
  const [addingSectionMarks, setAddingSectionMarks] = useState(10)

  useEffect(() => {
    if (!isEdit) setScheduleStartIso(null)
  }, [isEdit])

  useEffect(() => {
    if (scheduleDate) {
      setScheduleStartIso(`${scheduleDate}T${scheduleTime}:00`)
    }
  }, [scheduleDate, scheduleTime])

  const sources = useContentSourcesForm({ subject, grade, initialTopic: loadedTopic })

  useEffect(() => {
    if (isEdit) return
    const titleParam = searchParams.get('title')
    if (titleParam) setTitle(titleParam)
    const sub = searchParams.get('subject')
    const subOk = SUBJECTS.find((s) => s === sub)
    if (subOk) setSubject(subOk)
    const gr = searchParams.get('grade')
    const grOk = GRADES.find((g) => g === gr)
    if (grOk) setGrade(grOk)
    const topic = searchParams.get('topic')
    if (topic) setLoadedTopic(topic)
    if (searchParams.get('fromTemplate') && !templateToastRef.current) {
      templateToastRef.current = true
      toast.success('Prefilled from template')
    }
  }, [isEdit, searchParams, toast])

  const sectionsSeed: ExamSectionStub[] = useMemo(
    () => generateExamSectionStubs(sources.getGenerationContext()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sources.generationSignature, sources.getGenerationContext]
  )

  const schedule = useMemo(() => {
    const start = scheduleStartIso ? new Date(scheduleStartIso) : new Date()
    if (!scheduleStartIso) {
      start.setDate(start.getDate() + 10)
      start.setHours(9, 0, 0, 0)
    }
    const end = new Date(start)
    end.setMinutes(end.getMinutes() + durationMinutes)
    return { start: start.toISOString(), end: end.toISOString() }
  }, [durationMinutes, scheduleStartIso])

  useEffect(() => {
    if (!isEdit || !examId) {
      setHydrateReady(true)
      return
    }
    let cancelled = false
    setHydrateReady(false)
    ;(async () => {
      const ex = await api.getExam(examId)
      if (cancelled) return
      if (!ex) {
        toast.error('Exam not found')
        navigate('/teacher-tools/exams')
        return
      }
      setTitle(ex.title)
      setExamType(ex.examType)
      setTerm(ex.term)
      setSubject(ex.subject)
      setGrade(ex.grade)
      setDurationMinutes(minutesBetween(ex.scheduleStart, ex.scheduleEnd))
      setScheduleStartIso(ex.scheduleStart)
      setScheduleDate(ex.scheduleStart.slice(0, 10))
      setScheduleTime(ex.scheduleStart.slice(11, 16))
      setSelectedClasses(ex.classes ?? [])
      setCompletionMeta({ completionPct: ex.completionPct })
      setHydrateReady(true)
    })()
    return () => { cancelled = true }
  }, [api, examId, isEdit, navigate, toast])

  const toggleClass = (key: string) => {
    setSelectedClasses((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const runGeneration = () => {
    const errs: string[] = []
    if (!title.trim()) errs.push('Exam title is required.')
    if (errs.length > 0) {
      setBuildErrors(errs)
      toast.error('Fix the highlighted fields to generate.')
      return
    }
    setBuildErrors([])
    setGenerationError(null)
    setGenProgress(0.15)
    setGenerating(true)
    const steps = window.setInterval(() => {
      setGenProgress((p) => Math.min(0.92, p + Math.random() * 0.12))
    }, 450)
    window.setTimeout(() => {
      try {
        const generated = generateExamSectionStubs(sources.getGenerationContext())
        const seeded = generated.slice(0, sectionTargetCount)
        while (seeded.length < sectionTargetCount) {
          seeded.push({
            id: `auto-${seeded.length + 1}`,
            title: `${internationalStandard} section ${seeded.length + 1}`,
            marks: 10,
            description: 'Higher-order reasoning with international benchmark expectations.',
          })
        }
        setGeneratedSections(seeded)
        setPhase('review')
        toast.success('Exam blueprint generated — review below.')
      } catch {
        setGenerationError('Generation failed (demo). Please retry with updated inputs.')
        toast.error('Could not generate exam blueprint.')
      } finally {
        window.clearInterval(steps)
        setGenerating(false)
        setGenProgress(1)
      }
    }, 1200 + Math.random() * 800)
  }

  const regenerateSections = () => {
    const generated = generateExamSectionStubs(sources.getGenerationContext())
    setGeneratedSections(generated.slice(0, sectionTargetCount))
    toast.success('Section blueprint regenerated')
  }

  const addManualSection = () => {
    setAddingSectionOpen(true)
    setAddingSectionTitle('')
    setAddingSectionMarks(10)
  }

  const editSection = (idx: number) => {
    const section = generatedSections[idx]
    if (!section) return
    setEditingSectionIndex(idx)
    setEditingSectionTitle(section.title)
    setEditingSectionMarks(section.marks)
  }

  const regenerateSection = (idx: number) => {
    const regenerated = generateExamSectionStubs(sources.getGenerationContext())
    const next = regenerated[idx] ?? regenerated[0]
    if (!next) return
    setGeneratedSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...next, id: s.id } : s))
    )
    toast.success('Section regenerated')
  }

  const deleteSection = (idx: number) => {
    setGeneratedSections((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== idx)
    })
    toast.success('Section removed')
  }

  const moveSection = (idx: number, direction: -1 | 1) => {
    setGeneratedSections((prev) => {
      const target = idx + direction
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      const [section] = next.splice(idx, 1)
      next.splice(target, 0, section)
      return next
    })
  }

  const buildPayload = (status: 'draft' | 'scheduled') => {
    const ctx = sources.getGenerationContext()
    const secs = generatedSections.length > 0 ? generatedSections : generateExamSectionStubs(ctx)
    const totalMarks = secs.reduce((a, s) => a + s.marks, 0)
    const classes = selectedClasses.length > 0 ? selectedClasses : [classKeyForGrade(grade)]
    return {
      title: title.trim() || 'Untitled exam',
      subject,
      grade,
      term,
      classes,
      examType,
      durationMinutes,
      totalMarks,
      scheduleStart: schedule.start,
      scheduleEnd: schedule.end,
      status,
      completionPct: isEdit ? completionMeta.completionPct : 0,
      sourceSummary: formatSourceSummary(ctx),
    }
  }

  const handleSaveDraft = async () => {
    if (sections.length === 0) {
      toast.error('Generate at least one section before saving a draft.')
      return
    }
    setSaveDraftPending(true)
    try {
      const payload = buildPayload('draft')
      if (isEdit && examId) {
        const res = await api.updateExam(examId, payload)
        if (!res.ok) {
          if (res.error === 'READ_ONLY') toast.error('Sample library items cannot be edited.')
          else toast.error('Could not save draft')
          return
        }
        toast.success('Draft saved')
        navigate(`/teacher-tools/exams/${examId}`)
        return
      }
      const id = newDemoId('exam')
      await api.createExam({ id, ...payload })
      toast.success('Draft saved')
      navigate(`/teacher-tools/exams/${id}`)
    } finally {
      setSaveDraftPending(false)
    }
  }

  const handlePublish = async () => {
    if (sections.length === 0) {
      toast.error('Generate at least one section before scheduling.')
      return
    }
    setPublishPending(true)
    try {
      const payload = buildPayload('scheduled')
      if (isEdit && examId) {
        const res = await api.updateExam(examId, payload)
        if (!res.ok) {
          if (res.error === 'READ_ONLY') toast.error('Sample library items cannot be edited. Duplicate from the list first.')
          else toast.error('Could not save exam')
          return
        }
        toast.success('Exam updated')
      } else {
        await api.createExam({ id: newDemoId('exam'), ...payload })
        toast.success('Exam scheduled')
      }
      navigate('/teacher-tools/exams')
    } finally {
      setPublishPending(false)
    }
  }

  const goList = () => navigate('/teacher-tools/exams')

  const exportPdf = () => {
    const stubs = sections.map((s, i) => ({
      id: `ex-${i + 1}`,
      type: 'short' as const,
      prompt: `${s.title}: ${s.description}`,
      points: s.marks,
      responseLines: 4,
    }))
    const payload: DemoQuiz = {
      id: isEdit && examId ? examId : newDemoId('exam-preview'),
      title: `${title || 'Exam'} — Blueprint`,
      subject,
      grade,
      classes: selectedClasses.length > 0 ? selectedClasses : [classKeyForGrade(grade)],
      questions: stubs.length,
      totalMarks,
      timeLimitMinutes: durationMinutes,
      status: 'draft',
      submissionCount: 0,
      avgScore: 0,
      topic: sources.combinedTopicLabel,
      sourceSummary: formatSourceSummary(sources.getGenerationContext()),
      questionStubs: stubs,
      studentInstructions: `Complete all sections in ${durationMinutes} minutes.`,
      handoutLayout,
    }
    downloadQuizPdf(payload, `${(title || 'exam').replace(/\s+/g, '-').slice(0, 32)}-exam.pdf`)
    toast.success('PDF downloaded')
  }

  if (isEdit && !hydrateReady) {
    return (
      <div className="min-h-[40vh] space-y-3 p-8">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-32 max-w-xl animate-pulse rounded-2xl bg-gray-100" />
        <p className="text-sm text-gray-600">Loading exam…</p>
      </div>
    )
  }

  const wizardStep = phase === 'build' ? 0 : 1
  const sections = generatedSections.length > 0 ? generatedSections : sectionsSeed
  const totalMarks = sections.reduce((a, s) => a + s.marks, 0)
  const assignedClasses = demoClasses.filter((c) =>
    selectedClasses.length > 0 ? selectedClasses.includes(c.key) : c.grade === grade
  )

  return (
    <div className="space-y-6 pb-10">
      <TeacherToolsPageHeader
        title={isEdit ? 'Edit exam' : 'Create exam'}
        subtitle="Configure the exam scope and rules, generate the section blueprint, then review and schedule."
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Exams', to: '/teacher-tools/exams' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
      />

      <TeacherToolsWizardStepper
        steps={BUILD_STEPS}
        current={wizardStep}
        onStepClick={(i) => {
          if (i === 1 && phase === 'build') {
            toast.error('Generate the exam blueprint first to open review.')
            return
          }
          setPhase(i === 0 ? 'build' : 'review')
        }}
      />
      <QuizGeneratingOverlay open={generating} progress={genProgress} />
      {generationError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {generationError}
          <button
            type="button"
            className="ml-3 font-semibold underline"
            onClick={() => setGenerationError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {phase === 'build' && (
        <>
          {/* Step 1 — Basics & sources */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-white px-6 py-5">
              <StepHeader
                step={1}
                kicker="Exam identity"
                title="Basics & sources"
                subtitle="Name the exam, set the type and term, duration, and pick the catalog scope to draw sections from."
              />
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <label className="md:col-span-2 block text-sm font-medium text-gray-800">
                Exam title <span className="text-red-500">*</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. End of unit — Forces & motion (Grade 7)"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Exam type
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Term
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Duration (minutes)
                <input
                  type="number"
                  value={durationMinutes}
                  min={15}
                  max={360}
                  onChange={(e) => setDurationMinutes(Number(e.target.value) || 60)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Subject
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Grade / cohort
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                International standard profile
                <select
                  value={internationalStandard}
                  onChange={(e) => setInternationalStandard(e.target.value as typeof internationalStandard)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="National Board">National Board</option>
                  <option value="Cambridge-style">Cambridge-style</option>
                  <option value="IB-style">IB-style</option>
                  <option value="SAT-style">SAT-style</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Target section count
                <input
                  type="number"
                  min={3}
                  max={8}
                  value={sectionTargetCount}
                  onChange={(e) => setSectionTargetCount(Math.min(8, Math.max(3, Number(e.target.value) || 4)))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </label>
              <div className="md:col-span-2">
                <ContentSourcesPanel subject={subject} grade={grade} model={sources} />
              </div>
            </div>
          </section>

          {/* Step 2 — Integrity rules */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50/60 to-white px-6 py-5">
              <StepHeader
                step={2}
                kicker="Integrity & delivery"
                title="Exam rules"
                subtitle="Configure how the exam is delivered and how integrity is enforced during the window."
              />
            </div>
            <div className="space-y-2 p-6">
              {[
                { label: 'Controlled mode (browser locked)', checked: controlledMode, onChange: setControlledMode },
                { label: 'Randomise question order per candidate', checked: randomisation, onChange: setRandomisation },
                { label: 'Auto-submit on time expiry', checked: autoSubmit, onChange: setAutoSubmit },
              ].map(({ label, checked, onChange }) => (
                <label key={label} className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 hover:bg-gray-100">
                  <span className="text-sm text-gray-700">{label}</span>
                  <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="rounded" />
                </label>
              ))}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 opacity-60">
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  Webcam proctoring
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-500">Phase 2</span>
                </span>
                <input type="checkbox" checked={webcamPreview} onChange={(e) => setWebcamPreview(e.target.checked)} disabled className="rounded" />
              </label>
            </div>
          </section>

          {/* Step 3 — Schedule & classes */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50/60 to-white px-6 py-5">
              <StepHeader
                step={3}
                kicker="Time window"
                title="Schedule & candidates"
                subtitle="Set the exam date and start time, then assign the classes that will sit it."
              />
            </div>
            <div className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-gray-800">
                  Exam date
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-800">
                  Start time
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                  />
                </label>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <p className="mb-1 font-medium text-gray-900">Computed window</p>
                <p>Start: <span className="font-semibold text-gray-800">{schedule.start.slice(0, 16).replace('T', ' ')}</span></p>
                <p>End: <span className="font-semibold text-gray-800">{schedule.end.slice(0, 16).replace('T', ' ')}</span> · {durationMinutes} min</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-800">Assign to classes</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {demoClasses.map((c) => (
                    <label
                      key={c.key}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
                        selectedClasses.includes(c.key)
                          ? 'border-indigo-300 bg-indigo-50'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(c.key)}
                        onChange={() => toggleClass(c.key)}
                        className="rounded"
                      />
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{c.label}</p>
                        <p className="text-xs text-gray-500">{c.grade} · {c.subject}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <p className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <Phase2Badge /> Room codes, seating plans, and calendar holds sync with your school roster in Phase 2.
              </p>
            </div>
          </section>

          {buildErrors.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <ul className="space-y-1 text-sm text-amber-900">
                {buildErrors.map((e) => <li key={e}>{e}</li>)}
              </ul>
            </div>
          )}

          {/* Sticky generate CTA */}
          <div className="sticky bottom-4 z-10 mt-8 flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">Ready to generate the section blueprint</p>
              <p className="mt-0.5 text-xs text-gray-600">
                Produces a section structure with mark allocations from the selected topic scope and catalog books above.
              </p>
            </div>
            <button
              type="button"
              onClick={runGeneration}
              disabled={generating}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-60"
            >
              {generating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating…
                </>
              ) : (
                'Generate blueprint'
              )}
            </button>
          </div>
        </>
      )}

      {phase === 'review' && (
        <div className="space-y-6">
          {/* Review header */}
          <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Review</p>
              <h2 className="mt-1 text-lg font-semibold text-gray-900">Generated question set</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-600">
                Edit prompts, reorder, or regenerate items. When you publish, this snapshot is stored for students and exports.
              </p>
              <p className="mt-2 text-xs text-gray-500">{formatSourceSummary(sources.getGenerationContext())}</p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-semibold text-gray-900">{sections.length}</p>
                  <p className="text-xs text-gray-500">Questions</p>
                </div>
                <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-semibold text-gray-900">{totalMarks}</p>
                  <p className="text-xs text-gray-500">Total marks</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => { setDraftLayout(handoutLayout); setPreviewOpen(true) }} disabled={sections.length === 0} className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-900 shadow-sm hover:bg-indigo-50 disabled:opacity-50"><Eye className="h-3.5 w-3.5" />Print preview</button>
                <button type="button" onClick={addManualSection} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-900 shadow-sm hover:bg-emerald-50"><PlusCircle className="h-3.5 w-3.5" />Add question manually</button>
              </div>
            </div>
          </div>

          {/* Section blueprint */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50/60 to-white px-6 py-4">
              <ListOrdered className="h-4 w-4 text-indigo-500" />
              <h3 className="font-semibold text-gray-900">Section blueprint</h3>
              <span className="ml-auto text-xs text-gray-400">
                {formatSourceSummary(sources.getGenerationContext())}
              </span>
              <button
                type="button"
                onClick={regenerateSections}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Regenerate
              </button>
              <button
                type="button"
                onClick={addManualSection}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Add manual
              </button>
            </div>
            <ul className="space-y-2 p-6">
              {sections.map((s, idx) => (
                <li key={s.id} className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{s.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <button type="button" title="Move up" onClick={() => moveSection(idx, -1)} className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30" disabled={idx === 0}><ArrowUp className="h-4 w-4" /></button>
                      <button type="button" title="Move down" onClick={() => moveSection(idx, 1)} className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30" disabled={idx === sections.length - 1}><ArrowDown className="h-4 w-4" /></button>
                      <button type="button" title="Edit" onClick={() => editSection(idx)} className="rounded-lg p-1.5 text-indigo-700 hover:bg-indigo-100"><Pencil className="h-4 w-4" /></button>
                      <button type="button" title="Regenerate section" onClick={() => regenerateSection(idx)} className="rounded-lg p-1.5 text-amber-800 hover:bg-amber-100"><RefreshCw className="h-4 w-4" /></button>
                      <button type="button" title="Remove" onClick={() => deleteSection(idx)} className="rounded-lg p-1.5 text-red-700 hover:bg-red-50 disabled:opacity-30" disabled={sections.length <= 1}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                    {s.marks} marks
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-6 py-3 text-sm font-semibold">
              <span className="text-gray-700">Total</span>
              <span className="text-gray-900">{totalMarks} marks</span>
            </div>
          </section>

          {/* Exam rules summary */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-violet-50/60 to-white px-6 py-4">
              <ShieldCheck className="h-4 w-4 text-violet-500" />
              <h3 className="font-semibold text-gray-900">Exam rules</h3>
              <button
                type="button"
                onClick={() => setPhase('build')}
                className="ml-auto text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Edit
              </button>
            </div>
            <dl className="divide-y divide-gray-100 px-6 py-1 text-sm">
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-gray-500">Controlled mode</dt>
                <dd className="text-gray-800">{controlledMode ? 'Enabled (browser locked)' : 'Disabled'}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-gray-500">Question randomisation</dt>
                <dd className="text-gray-800">{randomisation ? 'On (per candidate)' : 'Off'}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-gray-500">Auto-submit</dt>
                <dd className="text-gray-800">{autoSubmit ? 'On time expiry' : 'Manual only'}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-gray-500">Webcam proctoring</dt>
                <dd className="italic text-gray-400">Phase 2</dd>
              </div>
            </dl>
          </section>

          {/* Schedule summary */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-amber-50/60 to-white px-6 py-4">
              <Calendar className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold text-gray-900">Schedule</h3>
              <button
                type="button"
                onClick={() => setPhase('build')}
                className="ml-auto text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Edit
              </button>
            </div>
            <dl className="divide-y divide-gray-100 px-6 py-1 text-sm">
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-gray-500">Start</dt>
                <dd className="text-gray-800">{fmtDateTime(schedule.start)}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-gray-500">End</dt>
                <dd className="text-gray-800">{fmtDateTime(schedule.end)}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-gray-500">Duration</dt>
                <dd className="text-gray-800">{durationMinutes} minutes per candidate</dd>
              </div>
            </dl>
          </section>

          {/* Classes summary */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50/60 to-white px-6 py-4">
              <Users className="h-4 w-4 text-emerald-500" />
              <h3 className="font-semibold text-gray-900">Candidate classes</h3>
              <button
                type="button"
                onClick={() => setPhase('build')}
                className="ml-auto text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Edit
              </button>
            </div>
            <div className="grid gap-2 p-6 sm:grid-cols-2">
              {assignedClasses.map((c) => (
                <div key={c.key} className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{c.label}</p>
                    <p className="text-xs text-gray-500">{c.grade} · {c.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-6">
            <button type="button" onClick={() => setPhase('build')} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">← Edit requirements</button>
            <button type="button" onClick={regenerateSections} className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-900 hover:bg-indigo-100"><Sparkles className="h-4 w-4" />Regenerate all</button>
          </div>

          {/* Publish panel */}
          <div className="sticky bottom-4 z-10 rounded-2xl border border-gray-200 bg-gray-50/95 p-5 shadow-lg backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Publish & export</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setDraftLayout(handoutLayout)
                  setPreviewOpen(true)
                }}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
              >
                <Eye className="h-4 w-4" />
                Print preview
              </button>
              <button
                type="button"
                disabled={saveDraftPending}
                onClick={() => void handleSaveDraft()}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                {saveDraftPending ? 'Saving…' : 'Save draft'}
              </button>
              <button
                type="button"
                onClick={exportPdf}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
              <button
                type="button"
                disabled
                title="Coming with LMS integration"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-gray-300 bg-white/60 px-4 py-2 text-sm font-medium text-gray-400"
              >
                <FileJson className="h-4 w-4" />
                QTI / LMS (soon)
              </button>
              <button
                type="button"
                disabled={publishPending}
                onClick={() => void handlePublish()}
                className="ml-auto rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
              >
                {publishPending ? 'Scheduling…' : isEdit ? 'Save changes' : 'Schedule exam'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomModal
        open={discardOpen}
        close={() => setDiscardOpen(false)}
        title="Discard source selections?"
        primaryButtonText="Discard and leave"
        isDelete
        handleSave={() => {
          sources.resetSources()
          setDiscardOpen(false)
          goList()
        }}
      >
        <p className="py-3 text-sm text-gray-600">You changed content sources. Leave without scheduling?</p>
      </CustomModal>

      <CustomModal
        open={previewOpen}
        close={() => setPreviewOpen(false)}
        title="Exam preview"
        primaryButtonText="Save layout and close"
        handleSave={() => {
          setHandoutLayout(draftLayout)
          setPreviewOpen(false)
        }}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-900">Handout spacing</span>
            <label className="flex items-center gap-1.5 text-xs text-gray-800">
              <span className="text-gray-600">Line height</span>
              <select
                value={draftLayout.bodyLineHeight}
                onChange={(e) =>
                  setDraftLayout((l) => ({ ...l, bodyLineHeight: Number(e.target.value) || DEFAULT_HANDOUT_LAYOUT.bodyLineHeight }))
                }
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium shadow-sm"
              >
                {LINE_HEIGHT_PRESETS.map((lh) => <option key={lh} value={lh}>{lh}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-gray-800">
              <span className="text-gray-600">Question gap</span>
              <select
                value={draftLayout.questionGapPx}
                onChange={(e) =>
                  setDraftLayout((l) => ({ ...l, questionGapPx: Number(e.target.value) || DEFAULT_HANDOUT_LAYOUT.questionGapPx }))
                }
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium shadow-sm"
              >
                {QUESTION_GAP_PRESETS.map((px) => <option key={px} value={px}>{px}px</option>)}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-gray-800">
              <span className="text-gray-600">Response line height</span>
              <select
                value={draftLayout.ruledLineSpacingPx}
                onChange={(e) =>
                  setDraftLayout((l) => ({ ...l, ruledLineSpacingPx: Number(e.target.value) || DEFAULT_HANDOUT_LAYOUT.ruledLineSpacingPx }))
                }
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium shadow-sm"
              >
                {RULED_LINE_SPACING_PRESETS.map((px) => <option key={px} value={px}>{px}px</option>)}
              </select>
            </label>
          </div>
        <div className="max-h-[60vh] overflow-y-auto py-3 text-sm text-gray-700" style={{ lineHeight: draftLayout.bodyLineHeight }}>
          <p className="font-semibold text-gray-900">{title || 'Untitled exam'}</p>
          <p className="mt-1 text-xs text-gray-500">{subject} · {grade} · {examType}</p>
          <p className="mt-1 text-xs text-gray-500">{fmtDateTime(schedule.start)} - {fmtDateTime(schedule.end)}</p>
          <ul className="mt-4">
            {sections.map((s) => (
              <li key={s.id} className="flex items-center justify-between" style={{ marginBottom: draftLayout.questionGapPx }}>
                <span>{s.title}</span>
                <span className="text-xs text-gray-500">{s.marks} marks</span>
              </li>
            ))}
          </ul>
        </div>
        </div>
      </CustomModal>

      <CustomModal
        open={editingSectionIndex !== null}
        close={() => setEditingSectionIndex(null)}
        title="Edit section"
        primaryButtonText="Save"
        handleSave={() => {
          if (editingSectionIndex === null) return
          setGeneratedSections((prev) =>
            prev.map((s, i) => (i === editingSectionIndex ? { ...s, title: editingSectionTitle, marks: Math.max(1, editingSectionMarks) } : s))
          )
          setEditingSectionIndex(null)
        }}
      >
        <div className="space-y-3 py-2">
          <input value={editingSectionTitle} onChange={(e) => setEditingSectionTitle(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
          <input type="number" min={1} value={editingSectionMarks} onChange={(e) => setEditingSectionMarks(Number(e.target.value) || 10)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        </div>
      </CustomModal>

      <CustomModal
        open={addingSectionOpen}
        close={() => setAddingSectionOpen(false)}
        title="Add section"
        primaryButtonText="Add section"
        handleSave={() => {
          if (!addingSectionTitle.trim()) return
          setGeneratedSections((prev) => [...prev, { id: `manual-${Date.now()}`, title: addingSectionTitle.trim(), marks: Math.max(1, addingSectionMarks), description: 'Manually added section.' }])
          setAddingSectionOpen(false)
        }}
      >
        <div className="space-y-3 py-2">
          <input value={addingSectionTitle} onChange={(e) => setAddingSectionTitle(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="Section title" />
          <input type="number" min={1} value={addingSectionMarks} onChange={(e) => setAddingSectionMarks(Number(e.target.value) || 10)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="Marks" />
        </div>
      </CustomModal>

      <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => {
            if (sources.isDirty) setDiscardOpen(true)
            else goList()
          }}
          className="text-sm font-semibold text-primary-600 hover:text-primary-500"
        >
          ← Back to exam list
        </button>
      </div>
    </div>
  )
}
