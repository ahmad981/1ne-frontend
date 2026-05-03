import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsWizardStepper } from '../components'
import { demoClasses } from '../demo/teacherToolsDemoData'
import { formatSourceSummary, generateExamSectionStubs } from '../demo/generationFromSources'
import type { ExamSectionStub } from '../demo/generationFromSources'
import { GRADES, SUBJECTS } from '../types'
import { newDemoId } from '../demo/newDemoId'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
import { downloadExamHandoutPdf } from '../utils/generateExamPdf'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'
import { AlertCircle, Download, Eye, FileJson, Sparkles } from 'lucide-react'
import { QuizGeneratingOverlay } from '../quiz/components/QuizGeneratingOverlay'
import {
  DEFAULT_HANDOUT_LAYOUT,
  LINE_HEIGHT_PRESETS,
  QUESTION_GAP_PRESETS,
  type HandoutLayoutOpts,
} from '../quiz/config/handoutLayoutConfig'
import { useQuizRagScope } from '../quiz/hooks/useQuizRagScope'
import { validateRagExamBuild } from './config/examCreationConfig'
import {
  DEFAULT_EXAM_PAPER,
  deriveExamPaperMarks,
  validateExamPaperFields,
  type ExamPaperConfig,
} from './config/examPaperConfig'
import { ExamNumberedSectionHeader, ExamSectionShell } from './components/ExamNumberedSectionHeader'
import { ExamSourcesRagPanel } from './components/ExamSourcesRagPanel'
import { ExamPaperStructureCard } from './components/ExamPaperStructureCard'
import { ExamPaperStructureReviewCard } from './components/ExamPaperStructureReviewCard'
import { ExamPaperQuestionsReview } from './components/ExamPaperQuestionsReview'
import { ExamPrintPreviewContent } from './components/ExamPrintPreviewContent'
import {
  blankLongStub,
  blankMcqStub,
  blankShortStub,
  buildExamLongStubsFromPaper,
  buildExamMcqStubsFromPaper,
  buildExamShortStubsFromPaper,
  freshLongStub,
  freshMcqStub,
  freshShortStub,
  longPoolSize,
  patchPaperAddOneLong,
  patchPaperAddOneMcq,
  patchPaperAddOneShort,
  patchPaperDeleteOneLong,
  patchPaperDeleteOneMcq,
  patchPaperDeleteOneShort,
  shortPoolSize,
  type ExamLongStub,
  type ExamMcqStub,
  type ExamShortStub,
} from './demo/examQuestionStubs'
import { alignExamBlueprintMarksToTotal } from './utils/alignExamBlueprintMarks'

const BUILD_STEPS = ['Configure & generate', 'Review & schedule']

const EXAM_TYPES = ['Unit test', 'Mid-term', 'Final exam', 'Mock exam']
const TERMS = ['Term 1', 'Term 2', 'Term 3']
const INTERNATIONAL_STANDARDS = ['Cambridge-style', 'IB-aligned', 'Standard', 'National curriculum'] as const

function classKeyForGrade(grade: string) {
  return demoClasses.find((c) => c.grade === grade)?.key ?? demoClasses[0]?.key ?? 'g8c'
}

function minutesBetween(isoStart: string, isoEnd: string) {
  const a = new Date(isoStart).getTime()
  const b = new Date(isoEnd).getTime()
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return 60
  return Math.round((b - a) / 60000)
}

function fmtWindowLine(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
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
  const [internationalStandard, setInternationalStandard] = useState<(typeof INTERNATIONAL_STANDARDS)[number]>(
    'Cambridge-style',
  )
  const [sectionTargetCount, setSectionTargetCount] = useState(4)
  const [paper, setPaper] = useState<ExamPaperConfig>(() => ({ ...DEFAULT_EXAM_PAPER }))

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
  const [examMcqs, setExamMcqs] = useState<ExamMcqStub[]>([])
  const [examShorts, setExamShorts] = useState<ExamShortStub[]>([])
  const [examLongs, setExamLongs] = useState<ExamLongStub[]>([])
  const examQsHydratedRef = useRef(false)

  const [editMcqIdx, setEditMcqIdx] = useState<number | null>(null)
  const [editMcqStem, setEditMcqStem] = useState('')
  const [editMcqOptionsText, setEditMcqOptionsText] = useState('')

  const [editShortIdx, setEditShortIdx] = useState<number | null>(null)
  const [editShortStem, setEditShortStem] = useState('')

  const [editLongIdx, setEditLongIdx] = useState<number | null>(null)
  const [editLongStem, setEditLongStem] = useState('')
  const [editLongSubpartsText, setEditLongSubpartsText] = useState('')

  useEffect(() => {
    if (!isEdit) setScheduleStartIso(null)
  }, [isEdit])

  useEffect(() => {
    if (scheduleDate) {
      setScheduleStartIso(`${scheduleDate}T${scheduleTime}:00`)
    }
  }, [scheduleDate, scheduleTime])

  const rag = useQuizRagScope({
    subject,
    grade,
    initialScopeRefinement: loadedTopic,
  })

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
    () => generateExamSectionStubs(rag.getGenerationContext()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rag.generationSignature, rag.getGenerationContext]
  )

  const paperMarks = useMemo(() => deriveExamPaperMarks(paper), [paper])

  useEffect(() => {
    if (phase !== 'review') return
    setGeneratedSections((prev) => {
      if (prev.length === 0) return prev
      return alignExamBlueprintMarksToTotal(prev, paperMarks.grand)
    })
  }, [paperMarks.grand, phase])

  useEffect(() => {
    if (!hydrateReady || !isEdit || examQsHydratedRef.current) return
    examQsHydratedRef.current = true
    setExamMcqs(buildExamMcqStubsFromPaper(subject, paper))
    setExamShorts(buildExamShortStubsFromPaper(subject, paper))
    setExamLongs(buildExamLongStubsFromPaper(subject, paper))
  }, [hydrateReady, isEdit, subject, paper])

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

  const runGeneration = () => {
    const errs: string[] = []
    const ragV = validateRagExamBuild({
      title,
      generateWithoutSources: rag.generateWithoutSources,
      selectedBookIds: rag.selectedBookIds,
      selectedTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement,
    })
    if (!ragV.ok) errs.push(...ragV.errors)
    const pe = validateExamPaperFields(paper)
    if (Object.keys(pe).length > 0) errs.push('Fix paper structure validation errors (red text in Section 2).')
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
        const generated = generateExamSectionStubs(rag.getGenerationContext())
        const seeded = generated.slice(0, sectionTargetCount)
        while (seeded.length < sectionTargetCount) {
          seeded.push({
            id: `auto-${seeded.length + 1}`,
            title: `${internationalStandard} section ${seeded.length + 1}`,
            marks: 10,
            description: 'Higher-order reasoning with international benchmark expectations.',
          })
        }
        const grand = deriveExamPaperMarks(paper).grand
        setGeneratedSections(alignExamBlueprintMarksToTotal(seeded, grand))
        setExamMcqs(buildExamMcqStubsFromPaper(subject, paper))
        setExamShorts(buildExamShortStubsFromPaper(subject, paper))
        setExamLongs(buildExamLongStubsFromPaper(subject, paper))
        setPhase('review')
        toast.success('Exam generated — review below.')
      } catch {
        setGenerationError('Generation failed (demo). Please retry with updated inputs.')
        toast.error('Could not generate the exam.')
      } finally {
        window.clearInterval(steps)
        setGenerating(false)
        setGenProgress(1)
      }
    }, 1200 + Math.random() * 800)
  }

  const regenerateSections = () => {
    const generated = generateExamSectionStubs(rag.getGenerationContext())
    const seeded = generated.slice(0, sectionTargetCount)
    while (seeded.length < sectionTargetCount) {
      seeded.push({
        id: `auto-${seeded.length + 1}-${Date.now()}`,
        title: `${internationalStandard} section ${seeded.length + 1}`,
        marks: 10,
        description: 'Higher-order reasoning with international benchmark expectations.',
      })
    }
    const grand = deriveExamPaperMarks(paper).grand
    setGeneratedSections(alignExamBlueprintMarksToTotal(seeded, grand))
    setExamMcqs(buildExamMcqStubsFromPaper(subject, paper))
    setExamShorts(buildExamShortStubsFromPaper(subject, paper))
    setExamLongs(buildExamLongStubsFromPaper(subject, paper))
    toast.success('Exam regenerated')
  }

  const reorderMcq = (from: number, to: number) => {
    setExamMcqs((prev) => {
      if (to < 0 || to >= prev.length) return prev
      const next = [...prev]
      const [x] = next.splice(from, 1)
      next.splice(to, 0, x!)
      return next
    })
  }
  const deleteMcq = (index: number) => {
    setPaper((p) => patchPaperDeleteOneMcq(p))
    setExamMcqs((prev) => prev.filter((_, i) => i !== index))
  }
  const regenerateMcq = (index: number) => {
    setExamMcqs((prev) =>
      prev.map((s, i) => (i === index ? freshMcqStub(subject, index + 1 + Math.floor(Math.random() * 40), paper) : s)),
    )
  }
  const addManualMcq = () => {
    const next = patchPaperAddOneMcq(paper)
    if (next.objCount === paper.objCount) return
    setPaper(next)
    setExamMcqs((prev) => [...prev, blankMcqStub(next)])
  }
  const openEditMcq = (index: number) => {
    const q = examMcqs[index]
    if (!q) return
    setEditMcqIdx(index)
    setEditMcqStem(q.stem)
    setEditMcqOptionsText(q.options.join('\n'))
  }

  const reorderShort = (from: number, to: number) => {
    setExamShorts((prev) => {
      if (to < 0 || to >= prev.length) return prev
      const next = [...prev]
      const [x] = next.splice(from, 1)
      next.splice(to, 0, x!)
      return next
    })
  }
  const deleteShort = (index: number) => {
    setPaper((p) => patchPaperDeleteOneShort(p))
    setExamShorts((prev) => prev.filter((_, i) => i !== index))
  }
  const regenerateShort = (index: number) => {
    setExamShorts((prev) => prev.map((s, i) => (i === index ? freshShortStub(subject, index + i) : s)))
  }
  const addManualShort = () => {
    const next = patchPaperAddOneShort(paper)
    if (shortPoolSize(next) === shortPoolSize(paper)) return
    setPaper(next)
    setExamShorts((prev) => [...prev, blankShortStub()])
  }
  const openEditShort = (index: number) => {
    const q = examShorts[index]
    if (!q) return
    setEditShortIdx(index)
    setEditShortStem(q.stem)
  }

  const reorderLong = (from: number, to: number) => {
    setExamLongs((prev) => {
      if (to < 0 || to >= prev.length) return prev
      const next = [...prev]
      const [x] = next.splice(from, 1)
      next.splice(to, 0, x!)
      return next
    })
  }
  const deleteLong = (index: number) => {
    setPaper((p) => patchPaperDeleteOneLong(p))
    setExamLongs((prev) => prev.filter((_, i) => i !== index))
  }
  const regenerateLong = (index: number) => {
    setExamLongs((prev) => prev.map((s, i) => (i === index ? freshLongStub(subject, index + i, paper) : s)))
  }
  const addManualLong = () => {
    const next = patchPaperAddOneLong(paper)
    if (longPoolSize(next) === longPoolSize(paper)) return
    setPaper(next)
    setExamLongs((prev) => [...prev, blankLongStub(next)])
  }
  const openEditLong = (index: number) => {
    const q = examLongs[index]
    if (!q) return
    setEditLongIdx(index)
    setEditLongStem(q.stem)
    setEditLongSubpartsText(q.subparts.join('\n'))
  }

  const buildPayload = (status: 'draft' | 'scheduled') => {
    const ctx = rag.getGenerationContext()
    const totalMarks = deriveExamPaperMarks(paper).grand
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
      toast.error('Generate the exam before saving a draft.')
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
      toast.error('Generate the exam before scheduling.')
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
    if (examMcqs.length === 0) {
      toast.error('Generate the exam before exporting PDF.')
      return
    }
    downloadExamHandoutPdf(
      {
        title: `${title || 'Exam'} — Preview`,
        subject,
        grade,
        timeLimitMinutes: durationMinutes,
        topic: rag.combinedTopicLabel,
        sourceSummary: formatSourceSummary(rag.getGenerationContext()),
        mcqs: examMcqs.map((q) => ({ stem: q.stem, options: q.options, marks: paper.objMarksPer })),
        shorts: examShorts.map((q) => ({ stem: q.stem, marks: paper.shortMarksPer })),
        longs: examLongs.map((q) => ({ stem: q.stem, subparts: [...q.subparts], marks: paper.longMarksPer })),
        handoutLayout,
      },
      `${(title || 'exam').replace(/\s+/g, '-').slice(0, 32)}-exam.pdf`,
    )
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
  const reviewSourceTag = rag.generateWithoutSources ? 'Topic-only' : 'Sources selected'

  return (
    <div className="space-y-6 pb-10">
      <TeacherToolsPageHeader
        title={isEdit ? 'Edit exam' : 'Create exam'}
        subtitle="Configure scope and paper layout, generate the exam, then review and schedule."
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
            toast.error('Generate the exam first to open review.')
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
          <ExamSectionShell
            variant="blue"
            header={
              <ExamNumberedSectionHeader
                step={1}
                kicker="Exam identity"
                title="Basics & sources"
                subtitle="Name the exam, set the type and term, duration, and pick the catalog scope to draw sections from."
                variant="blue"
              />
            }
          >
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
                  {EXAM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Term
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  {TERMS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
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
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Grade / cohort
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                International standard profile
                <select
                  value={internationalStandard}
                  onChange={(e) =>
                    setInternationalStandard(e.target.value as (typeof INTERNATIONAL_STANDARDS)[number])
                  }
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  {INTERNATIONAL_STANDARDS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="md:col-span-2 block text-sm font-medium text-gray-800">
                Target section count
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={sectionTargetCount}
                  onChange={(e) => setSectionTargetCount(Math.min(12, Math.max(1, Number(e.target.value) || 4)))}
                  className="mt-1.5 w-full max-w-xs rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </label>
              <div className="md:col-span-2">
                <ExamSourcesRagPanel rag={rag} subject={subject} grade={grade} />
              </div>
            </div>
          </ExamSectionShell>

          <ExamPaperStructureCard paper={paper} onChange={(patch) => setPaper((p) => ({ ...p, ...patch }))} />

          {buildErrors.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <ul className="space-y-1 text-sm text-amber-900">
                {buildErrors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="sticky bottom-4 z-10 mt-8 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">Ready to generate</p>
              <p className="mt-0.5 text-xs text-gray-600">
                Builds draft questions from your topic scope, sources, and paper structure above.
              </p>
            </div>
            <button
              type="button"
              onClick={runGeneration}
              disabled={generating}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 disabled:opacity-60"
            >
              {generating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating…
                </>
              ) : (
                'Generate'
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
                Edit prompts, reorder, or regenerate items. When you schedule, this snapshot is stored for students and
                exports.
              </p>
              <p className="mt-2 text-xs font-medium text-gray-600">{reviewSourceTag}</p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-semibold text-gray-900">{paperMarks.grand}</p>
                  <p className="text-xs text-gray-500">Total marks</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => { setDraftLayout(handoutLayout); setPreviewOpen(true) }} disabled={examMcqs.length === 0} className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-900 shadow-sm hover:bg-indigo-50 disabled:opacity-50"><Eye className="h-3.5 w-3.5" />Print preview</button>
              </div>
            </div>
          </div>

          <ExamPaperQuestionsReview
            paper={paper}
            mcqs={examMcqs}
            shorts={examShorts}
            longs={examLongs}
            objMarksPer={paper.objMarksPer}
            shortMarksPer={paper.shortMarksPer}
            longMarksPer={paper.longMarksPer}
            onReorderMcq={reorderMcq}
            onDeleteMcq={deleteMcq}
            onRegenerateMcq={regenerateMcq}
            onEditMcq={openEditMcq}
            onAddManualMcq={addManualMcq}
            onReorderShort={reorderShort}
            onDeleteShort={deleteShort}
            onRegenerateShort={regenerateShort}
            onEditShort={openEditShort}
            onAddManualShort={addManualShort}
            onReorderLong={reorderLong}
            onDeleteLong={deleteLong}
            onRegenerateLong={regenerateLong}
            onEditLong={openEditLong}
            onAddManualLong={addManualLong}
          />

          <ExamPaperStructureReviewCard paper={paper} onEdit={() => setPhase('build')} />

          <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-6">
            <button type="button" onClick={() => setPhase('build')} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">← Edit requirements</button>
            <button type="button" onClick={regenerateSections} className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-900 hover:bg-indigo-100"><Sparkles className="h-4 w-4" />Regenerate all</button>
          </div>

          {/* Publish panel */}
          <div className="sticky bottom-4 z-10 rounded-2xl border border-gray-200 bg-gray-50/95 p-5 shadow-lg backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Publish & export</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={examMcqs.length === 0}
                  onClick={() => {
                    setDraftLayout(handoutLayout)
                    setPreviewOpen(true)
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
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
              </div>
              <button
                type="button"
                disabled={publishPending}
                onClick={() => void handlePublish()}
                className="inline-flex shrink-0 justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
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
          rag.resetSources()
          setDiscardOpen(false)
          goList()
        }}
      >
        <p className="py-3 text-sm text-gray-600">You changed content sources. Leave without scheduling?</p>
      </CustomModal>

      <CustomModal
        open={previewOpen}
        close={() => setPreviewOpen(false)}
        title="Print preview"
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
          </div>
          <div className="max-h-[60vh] overflow-y-auto py-3">
            <ExamPrintPreviewContent
              title={title}
              subject={subject}
              grade={grade}
              examType={examType}
              durationMinutes={durationMinutes}
              scheduleStartIso={schedule.start}
              paper={paper}
              sections={sections}
              draftLayout={draftLayout}
              fmtWindow={fmtWindowLine}
              reviewMcqs={examMcqs}
              reviewShorts={examShorts}
              reviewLongs={examLongs}
            />
          </div>
        </div>
      </CustomModal>

      <CustomModal
        open={editMcqIdx !== null}
        close={() => setEditMcqIdx(null)}
        title="Edit MCQ"
        primaryButtonText="Save"
        handleSave={() => {
          if (editMcqIdx === null) return
          const need = paper.objOptions
          const lines = editMcqOptionsText.split('\n').map((l) => l.trim()).filter(Boolean)
          const opts = [...lines]
          while (opts.length < need) opts.push(`Option ${String.fromCharCode(65 + opts.length)}`)
          const final = opts.slice(0, need)
          setExamMcqs((prev) =>
            prev.map((s, i) => (i === editMcqIdx ? { ...s, stem: editMcqStem.trim() || s.stem, options: final } : s)),
          )
          setEditMcqIdx(null)
        }}
      >
        <div className="space-y-3 py-2">
          <label className="block text-sm font-medium text-gray-800">
            Stem
            <textarea
              value={editMcqStem}
              onChange={(e) => setEditMcqStem(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Options (one per line, {paper.objOptions} required)
            <textarea
              value={editMcqOptionsText}
              onChange={(e) => setEditMcqOptionsText(e.target.value)}
              rows={6}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-mono text-sm"
            />
          </label>
        </div>
      </CustomModal>

      <CustomModal
        open={editShortIdx !== null}
        close={() => setEditShortIdx(null)}
        title="Edit short question"
        primaryButtonText="Save"
        handleSave={() => {
          if (editShortIdx === null) return
          setExamShorts((prev) =>
            prev.map((s, i) => (i === editShortIdx ? { ...s, stem: editShortStem.trim() || s.stem } : s)),
          )
          setEditShortIdx(null)
        }}
      >
        <div className="space-y-3 py-2">
          <label className="block text-sm font-medium text-gray-800">
            Stem
            <textarea
              value={editShortStem}
              onChange={(e) => setEditShortStem(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </CustomModal>

      <CustomModal
        open={editLongIdx !== null}
        close={() => setEditLongIdx(null)}
        title="Edit long question"
        primaryButtonText="Save"
        handleSave={() => {
          if (editLongIdx === null) return
          const parts = editLongSubpartsText
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean)
          const sub = parts.length > 0 ? parts : ['(a) Enter sub-part…']
          const capped = sub.slice(0, Math.max(1, paper.longSubparts))
          setExamLongs((prev) =>
            prev.map((s, i) => (i === editLongIdx ? { ...s, stem: editLongStem.trim() || s.stem, subparts: capped } : s)),
          )
          setEditLongIdx(null)
        }}
      >
        <div className="space-y-3 py-2">
          <label className="block text-sm font-medium text-gray-800">
            Introduction
            <textarea
              value={editLongStem}
              onChange={(e) => setEditLongStem(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Sub-parts (one per line, up to {paper.longSubparts})
            <textarea
              value={editLongSubpartsText}
              onChange={(e) => setEditLongSubpartsText(e.target.value)}
              rows={6}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </CustomModal>

      <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => {
            if (rag.isDirty) setDiscardOpen(true)
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
