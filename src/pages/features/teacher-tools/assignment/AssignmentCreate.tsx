import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsWizardStepper } from '../components'
import { demoClasses } from '../demo/teacherToolsDemoData'
import {
  buildAssignmentTopicsFromScope,
  formatSourceSummary,
  type AssignmentBriefLineStub,
  type AssignmentBriefTopicStub,
  type QuizDifficultyId,
} from '../demo/generationFromSources'
import { downloadAssignmentBriefPdf } from '../utils/generateAssignmentPdf'
import { GRADES, SUBJECTS } from '../types'
import { newDemoId } from '../demo/newDemoId'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'
import {
  ArrowDown,
  ArrowUp,
  Download,
  Eye,
  FileJson,
  Pencil,
  PlusCircle,
  Printer,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { QuizGeneratingOverlay } from '../quiz/components/QuizGeneratingOverlay'
import { AssignmentPrintPreviewModal, type AssignmentPrintMeta } from './components/AssignmentPrintPreviewModal'
import { DEFAULT_HANDOUT_LAYOUT, type HandoutLayoutOpts } from '../quiz/config/handoutLayoutConfig'
import { QUIZ_CREATION_STEPS } from '../quiz/config/quizCreationConfig'
import { useQuizRagScope } from '../quiz/hooks/useQuizRagScope'
import {
  ASSIGNMENT_TOPIC_COUNT,
  randomGenerationDelay,
  validateRagAssignmentBuild,
} from './config/assignmentCreationConfig'
import { AssignmentRagBuildSection, type TopicVolumeMode } from './components/AssignmentRagBuildSection'

function classKeyForGrade(grade: string) {
  return demoClasses.find((c) => c.grade === grade)?.key ?? demoClasses[0]?.key ?? 'g8c'
}

function dueDateIso(daysAhead: number) {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toISOString().slice(0, 10)
}

type LastAssignmentGen = {
  topicCount: number
  difficulty: QuizDifficultyId
  assignmentType: string
  rigorProfile: string
  generatorInstructions: string
  topicMixMode: TopicVolumeMode
  seedKey: string
}

export default function AssignmentCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const templateToastRef = useRef(false)
  const { assignmentId } = useParams<{ assignmentId?: string }>()
  const isEdit = location.pathname.endsWith('/edit')
  const { toast } = useSnackbar()
  const { api } = useTeacherToolsDemo()

  const [phase, setPhase] = useState<'build' | 'review'>('build')
  const [generating, setGenerating] = useState(false)
  const [genProgress, setGenProgress] = useState(0.15)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [buildErrors, setBuildErrors] = useState<string[]>([])
  const [topicBlocks, setTopicBlocks] = useState<AssignmentBriefTopicStub[]>([])
  const [lastGen, setLastGen] = useState<LastAssignmentGen | null>(null)
  const [printOpen, setPrintOpen] = useState(false)
  const [handoutLayout, setHandoutLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)
  const handoutLayoutRef = useRef<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)

  const [title, setTitle] = useState('Research brief')
  const [subject, setSubject] = useState<string>(SUBJECTS[1])
  const [grade, setGrade] = useState<string>(GRADES[0])
  const [assignmentType, setAssignmentType] = useState('Structured response')
  const [dueAt, setDueAt] = useState(dueDateIso(14))
  const [studentInstructions, setStudentInstructions] = useState(
    'Submit your work as a single document. Cite all sources using the format shown in class.'
  )
  const [rigorProfile, setRigorProfile] = useState('Standard')
  const [topicMixMode, setTopicMixMode] = useState<TopicVolumeMode>('balanced')
  const [topicCount, setTopicCount] = useState(ASSIGNMENT_TOPIC_COUNT.default)
  const [difficulty, setDifficulty] = useState<QuizDifficultyId>('standard')
  const [generatorInstructions, setGeneratorInstructions] = useState('')

  const [discardOpen, setDiscardOpen] = useState(false)
  const [loadedTopic, setLoadedTopic] = useState<string | undefined>(undefined)
  const [hydrateReady, setHydrateReady] = useState(!isEdit)
  const [publishPending, setPublishPending] = useState(false)
  const [saveDraftPending, setSaveDraftPending] = useState(false)
  const [editingLine, setEditingLine] = useState<{ topicId: string; lineId: string } | null>(null)
  const [editingLineValue, setEditingLineValue] = useState('')
  const [addingLineTopicId, setAddingLineTopicId] = useState<string | null>(null)
  const [addingLineValue, setAddingLineValue] = useState('')

  const rag = useQuizRagScope({
    subject,
    grade,
    bookSelectionMode: 'single',
    initialScopeRefinement: loadedTopic,
  })

  const totalBriefLines = topicBlocks.reduce((n, t) => n + t.lines.length, 0)

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

  useEffect(() => {
    if (!isEdit || !assignmentId) {
      setHydrateReady(true)
      return
    }
    let cancelled = false
    setHydrateReady(false)
    ;(async () => {
      const a = await api.getAssignment(assignmentId)
      if (cancelled) return
      if (!a) {
        toast.error('Assignment not found')
        navigate('/teacher-tools/assignment')
        return
      }
      setTitle(a.title)
      setSubject(a.subject)
      setGrade(a.grade)
      setAssignmentType(a.type)
      setDueAt(a.dueAt)
      setStudentInstructions(
        typeof a.studentInstructions === 'string' && a.studentInstructions.trim()
          ? a.studentInstructions
          : 'Submit your work as a single document. Cite all sources using the format shown in class.',
      )
      if (a.topic) setLoadedTopic(a.topic)
      if (Array.isArray(a.briefTopics)) setTopicBlocks(a.briefTopics as AssignmentBriefTopicStub[])
      if (a.handoutLayout) {
        const next = { ...DEFAULT_HANDOUT_LAYOUT, ...a.handoutLayout }
        handoutLayoutRef.current = next
        setHandoutLayout(next)
      }
      if (Array.isArray(a.briefTopics) && a.briefTopics.length > 0) setPhase('review')
      setHydrateReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [api, assignmentId, isEdit, navigate, toast])

  const runBuild = useCallback(
    (ctx: ReturnType<typeof rag.getGenerationContext>, gen: LastAssignmentGen) => {
      return buildAssignmentTopicsFromScope(ctx, {
        topicCount: gen.topicCount,
        assignmentType: gen.assignmentType,
        rigorProfile: gen.rigorProfile,
        difficulty: gen.difficulty,
        generatorNotes: gen.generatorInstructions.trim() || undefined,
        seedKey: gen.seedKey,
      })
    },
    [],
  )

  const snapshotGen = useCallback((): LastAssignmentGen => {
    return {
      topicCount,
      difficulty,
      assignmentType,
      rigorProfile,
      generatorInstructions,
      topicMixMode,
      seedKey: newDemoId('asg-seed'),
    }
  }, [topicCount, difficulty, assignmentType, rigorProfile, generatorInstructions, topicMixMode])

  const runGeneration = useCallback(async () => {
    const v = validateRagAssignmentBuild({
      title,
      generateWithoutSources: rag.generateWithoutSources,
      selectedBookIds: rag.selectedBookIds,
      selectedTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement,
    })
    if (!v.ok) {
      setBuildErrors(v.errors)
      toast.error('Fix the highlighted fields to generate.')
      return
    }
    setBuildErrors([])
    setGenerationError(null)
    setGenerating(true)
    setGenProgress(0.12)
    const steps = window.setInterval(() => {
      setGenProgress((p) => Math.min(0.92, p + Math.random() * 0.12))
    }, 450)
    const gen = snapshotGen()
    try {
      await new Promise((r) => setTimeout(r, randomGenerationDelay()))
      const ctx = rag.getGenerationContext()
      const next = runBuild(ctx, gen)
      setTopicBlocks(next)
      setLastGen(gen)
      setPhase('review')
      toast.success('Assignment brief generated — review below.')
    } catch {
      setGenerationError('Generation failed (demo). Adjust sources and try again.')
      toast.error('Could not generate assignment brief.')
    } finally {
      window.clearInterval(steps)
      setGenerating(false)
      setGenProgress(1)
    }
  }, [title, rag, snapshotGen, runBuild, toast])

  const regenerateAll = useCallback(() => {
    const gen = { ...(lastGen ?? snapshotGen()), seedKey: newDemoId('asg-seed') }
    setGenerating(true)
    setGenProgress(0.2)
    const interval = window.setInterval(() => {
      setGenProgress((p) => Math.min(0.9, p + 0.1))
    }, 400)
    window.setTimeout(() => {
      window.clearInterval(interval)
      try {
        const ctx = rag.getGenerationContext()
        setTopicBlocks(runBuild(ctx, gen))
        setLastGen(gen)
        toast.success('Brief regenerated.')
      } finally {
        setGenerating(false)
        setGenProgress(1)
      }
    }, randomGenerationDelay())
  }, [lastGen, snapshotGen, rag, runBuild, toast])

  const regenerateTopic = useCallback(
    (topicId: string) => {
      const gen = lastGen ?? snapshotGen()
      const t = topicBlocks.find((x) => x.id === topicId)
      if (!t) return
      const ctx = rag.getGenerationContext()
      const one = buildAssignmentTopicsFromScope(ctx, {
        topicCount: 1,
        assignmentType: gen.assignmentType,
        rigorProfile: gen.rigorProfile,
        difficulty: gen.difficulty,
        generatorNotes: gen.generatorInstructions.trim() || undefined,
        seedKey: `${newDemoId('reg-topic')}|${t.title}`,
        topicTitleOverride: t.title,
      })[0]
      if (!one) return
      setTopicBlocks((prev) => prev.map((b) => (b.id === topicId ? { ...one, id: topicId } : b)))
      toast.success('Topic section regenerated.')
    },
    [lastGen, snapshotGen, rag, topicBlocks, toast],
  )

  const moveTopic = useCallback((index: number, dir: -1 | 1) => {
    const j = index + dir
    setTopicBlocks((prev) => {
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      const [row] = next.splice(index, 1)
      next.splice(j, 0, row)
      return next
    })
  }, [])

  const moveLineInTopic = useCallback((topicId: string, lineIndex: number, dir: -1 | 1) => {
    setTopicBlocks((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t
        const j = lineIndex + dir
        if (j < 0 || j >= t.lines.length) return t
        const lines = [...t.lines]
        const [row] = lines.splice(lineIndex, 1)
        lines.splice(j, 0, row)
        return { ...t, lines }
      }),
    )
  }, [])

  const deleteLine = useCallback(
    (topicId: string, lineIndex: number) => {
      const t = topicBlocks.find((x) => x.id === topicId)
      if (!t || t.lines.length <= 1) {
        toast.error('Keep at least one line in each topic, or remove the whole topic from build.')
        return
      }
      setTopicBlocks((prev) =>
        prev.map((b) => (b.id === topicId ? { ...b, lines: b.lines.filter((_, i) => i !== lineIndex) } : b)),
      )
      toast.success('Line removed')
    },
    [topicBlocks, toast],
  )

  const regenerateLine = useCallback(
    (topicId: string, lineIndex: number) => {
      const gen = lastGen ?? snapshotGen()
      const t = topicBlocks.find((x) => x.id === topicId)
      if (!t) return
      const ctx = rag.getGenerationContext()
      const fresh = buildAssignmentTopicsFromScope(ctx, {
        topicCount: 1,
        assignmentType: gen.assignmentType,
        rigorProfile: gen.rigorProfile,
        difficulty: gen.difficulty,
        generatorNotes: gen.generatorInstructions.trim() || undefined,
        seedKey: `${newDemoId('reg-line')}|${t.title}|${lineIndex}`,
        topicTitleOverride: t.title,
      })[0]
      const replacement = fresh?.lines[lineIndex % (fresh.lines.length || 3)]
      if (!replacement) return
      setTopicBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== topicId) return b
          const lines = b.lines.map((ln, i) => (i === lineIndex ? { ...ln, text: replacement.text } : ln))
          return { ...b, lines }
        }),
      )
      toast.success('Line regenerated.')
    },
    [lastGen, snapshotGen, rag, topicBlocks, toast],
  )

  const updateLineText = useCallback((topicId: string, lineId: string, text: string) => {
    setTopicBlocks((prev) =>
      prev.map((t) =>
        t.id !== topicId
          ? t
          : { ...t, lines: t.lines.map((ln) => (ln.id === lineId ? { ...ln, text } : ln)) },
      ),
    )
  }, [])

  const addLineToTopic = useCallback((topicId: string, text: string) => {
    const line: AssignmentBriefLineStub = { id: newDemoId('asg-line'), text }
    setTopicBlocks((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, lines: [...t.lines, line] } : t)),
    )
    toast.success('Line added.')
  }, [toast])

  const addTopicManual = useCallback(() => {
    setTopicBlocks((prev) => {
      const n = prev.length + 1
      const topic: AssignmentBriefTopicStub = {
        id: newDemoId('asg-topic'),
        title: `Topic ${n}`,
        lines: [
          {
            id: newDemoId('asg-line'),
            text: 'Edit this line — add objectives, tasks, or evidence expectations for this topic.',
          },
        ],
      }
      return [...prev, topic]
    })
    toast.success('Topic section added.')
  }, [toast])

  const deleteTopic = useCallback(
    (topicId: string) => {
      setEditingLine((cur) => (cur?.topicId === topicId ? null : cur))
      setAddingLineTopicId((cur) => (cur === topicId ? null : cur))
      setTopicBlocks((prev) => prev.filter((t) => t.id !== topicId))
      toast.success('Topic section removed')
    },
    [toast],
  )

  const goList = () => navigate('/teacher-tools/assignment')

  const handleHandoutLayoutSave = useCallback(
    (layout: HandoutLayoutOpts) => {
      const next = { ...DEFAULT_HANDOUT_LAYOUT, ...layout }
      handoutLayoutRef.current = next
      setHandoutLayout(next)
      toast.success('Handout spacing saved. PDF export and print use these settings.')
    },
    [toast],
  )

  const assignmentPrintMeta: AssignmentPrintMeta = {
    title: title.trim() || 'Assignment',
    subject,
    grade,
    dueAt,
    assignmentType,
    studentInstructions,
    topic: rag.combinedTopicLabel,
    sourceSummaryLine: formatSourceSummary(rag.getGenerationContext()),
  }

  const exportPdf = useCallback(() => {
    try {
      downloadAssignmentBriefPdf(
        {
          title: title.trim() || 'Assignment',
          subject,
          grade,
          dueAt,
          assignmentType,
          studentInstructions,
          topic: rag.combinedTopicLabel,
          sourceSummary: formatSourceSummary(rag.getGenerationContext()),
        },
        topicBlocks,
        handoutLayoutRef.current,
        `${(title || 'assignment').replace(/\s+/g, '-').slice(0, 32)}-assignment-brief.pdf`,
      )
      toast.success('PDF downloaded')
    } catch {
      toast.error('Could not generate PDF')
    }
  }, [rag, title, subject, grade, dueAt, assignmentType, studentInstructions, topicBlocks, toast])

  const buildPayload = (status: 'draft' | 'active') => ({
    title: title.trim() || 'Untitled assignment',
    subject,
    grade,
    classes: [classKeyForGrade(grade)],
    type: assignmentType,
    dueAt,
    assignedCount: 0,
    submitted: 0,
    pending: 0,
    graded: 0,
    status,
    topic: rag.combinedTopicLabel,
    sourceSummary: formatSourceSummary(rag.getGenerationContext()),
    briefTopics: topicBlocks,
    studentInstructions,
    handoutLayout: handoutLayoutRef.current,
  })

  const handleSaveDraft = useCallback(async () => {
    if (topicBlocks.length === 0) {
      toast.error('Generate a brief before saving a draft.')
      return
    }
    setSaveDraftPending(true)
    try {
      const payload = buildPayload('draft')
      if (isEdit && assignmentId) {
        const res = await api.updateAssignment(assignmentId, payload)
        if (!res.ok) {
          if (res.error === 'READ_ONLY') toast.error('Sample library items cannot be edited.')
          else toast.error('Could not save draft')
          return
        }
        toast.success('Draft saved')
        navigate(`/teacher-tools/assignment/${assignmentId}`)
        return
      }
      const id = newDemoId('asg')
      await api.createAssignment({ id, ...payload })
      toast.success('Draft saved')
      navigate(`/teacher-tools/assignment/${id}`)
    } finally {
      setSaveDraftPending(false)
    }
  }, [api, assignmentId, isEdit, navigate, rag, topicBlocks.length, toast, title, subject, grade, assignmentType, dueAt])

  const handlePublish = useCallback(async () => {
    if (topicBlocks.length === 0) {
      toast.error('Generate a brief before publishing.')
      return
    }
    setPublishPending(true)
    try {
      const payload = buildPayload('active')
      if (isEdit && assignmentId) {
        const res = await api.updateAssignment(assignmentId, payload)
        if (!res.ok) {
          if (res.error === 'READ_ONLY') toast.error('Sample library items cannot be edited. Duplicate from the list first.')
          else toast.error('Could not save assignment')
          return
        }
        toast.success('Assignment updated')
      } else {
        await api.createAssignment({ id: newDemoId('asg'), ...payload })
        toast.success('Assignment published')
      }
      navigate('/teacher-tools/assignment')
    } finally {
      setPublishPending(false)
    }
  }, [api, assignmentId, isEdit, navigate, rag, topicBlocks.length, toast, title, subject, grade, assignmentType, dueAt])

  if (isEdit && !hydrateReady) {
    return (
      <div className="min-h-[40vh] space-y-3 p-8">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-32 max-w-xl animate-pulse rounded-2xl bg-gray-100" />
        <p className="text-sm text-gray-600">Loading assignment…</p>
      </div>
    )
  }

  const wizardStep = phase === 'build' ? 0 : 1

  return (
    <div className="space-y-6 pb-10">
      <TeacherToolsPageHeader
        title={isEdit ? 'Edit assignment' : 'Create assignment'}
        subtitle="Choose catalog sources, define retrieval scope, run generation, then review and publish."
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Assignment', to: '/teacher-tools/assignment' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
      />

      <TeacherToolsWizardStepper
        steps={[...QUIZ_CREATION_STEPS]}
        current={wizardStep}
        onStepClick={(i) => {
          if (i === 1 && topicBlocks.length === 0) {
            toast.error('Generate the brief first to open review.')
            return
          }
          setPhase(i === 0 ? 'build' : 'review')
        }}
      />

      {generationError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {generationError}
          <button type="button" className="ml-3 font-semibold underline" onClick={() => setGenerationError(null)}>
            Dismiss
          </button>
        </div>
      )}

      <QuizGeneratingOverlay open={generating} progress={genProgress} />

      {phase === 'build' && (
        <>
          <AssignmentRagBuildSection
            rag={rag}
            title={title}
            onTitleChange={setTitle}
            assignmentType={assignmentType}
            onAssignmentTypeChange={setAssignmentType}
            dueAt={dueAt}
            onDueAtChange={setDueAt}
            subject={subject}
            onSubjectChange={setSubject}
            grade={grade}
            onGradeChange={setGrade}
            rigorProfile={rigorProfile}
            onRigorProfileChange={setRigorProfile}
            studentInstructions={studentInstructions}
            onStudentInstructionsChange={setStudentInstructions}
            topicMixMode={topicMixMode}
            onTopicMixModeChange={setTopicMixMode}
            topicCount={topicCount}
            onTopicCountChange={setTopicCount}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            generatorInstructions={generatorInstructions}
            onGeneratorInstructionsChange={setGeneratorInstructions}
            validationErrors={buildErrors}
          />
          <div className="sticky bottom-4 z-10 mt-8 flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">Ready to generate from your scope</p>
              <p className="mt-0.5 text-xs text-gray-600">
                Primary action runs a retrieval + generation pass using the selected titles and topic strands above.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void runGeneration()}
              disabled={generating}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 disabled:opacity-60"
            >
              {generating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating…
                </>
              ) : (
                'Generate from selected materials'
              )}
            </button>
          </div>
        </>
      )}

      {phase === 'review' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">REVIEW</p>
              <h2 className="mt-1 text-lg font-semibold text-gray-900">Generated assignment brief</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-600">
                Edit lines, reorder topics, or regenerate sections. When you publish, this snapshot is stored for students and exports.
              </p>
              <p className="mt-2 text-xs text-gray-500">{formatSourceSummary(rag.getGenerationContext())}</p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-semibold text-gray-900">{topicBlocks.length}</p>
                  <p className="text-xs text-gray-500">Topics</p>
                </div>
                <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-semibold text-gray-900">{totalBriefLines}</p>
                  <p className="text-xs text-gray-500">Brief lines</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPrintOpen(true)}
                  disabled={topicBlocks.length === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-900 shadow-sm hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Print preview
                </button>
                <button
                  type="button"
                  onClick={addTopicManual}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-900 shadow-sm hover:bg-emerald-50"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add topic
                </button>
              </div>
            </div>
          </div>

          {topicBlocks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <p className="text-sm font-medium text-gray-800">No brief sections yet.</p>
              <p className="mt-1 text-sm text-gray-600">Generate from build, or start by adding a topic section.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPhase('build')}
                  className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
                >
                  Back to build
                </button>
                <button
                  type="button"
                  onClick={addTopicManual}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add topic
                </button>
              </div>
            </div>
          ) : (
            <section className="overflow-hidden rounded-2xl border-[0.5px] border-gray-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50/60 to-white px-6 py-4">
                <h3 className="font-semibold text-gray-900">Assignment brief</h3>
                <span className="ml-auto max-w-[min(100%,14rem)] truncate text-xs text-gray-500" title={formatSourceSummary(rag.getGenerationContext())}>
                  {formatSourceSummary(rag.getGenerationContext())}
                </span>
                <button
                  type="button"
                  onClick={regenerateAll}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Regenerate all
                </button>
                <button
                  type="button"
                  onClick={addTopicManual}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Add topic
                </button>
              </div>
              <div className="space-y-4 p-6">
                {topicBlocks.map((topic, ti) => (
                  <div key={topic.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 bg-emerald-50/50 px-4 py-3">
                      <p className="min-w-0 flex-1 text-sm font-semibold text-gray-900">{topic.title}</p>
                      <div className="ml-auto flex flex-wrap gap-1">
                        <button
                          type="button"
                          title="Move topic up"
                          disabled={ti === 0}
                          onClick={() => moveTopic(ti, -1)}
                          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Move topic down"
                          disabled={ti === topicBlocks.length - 1}
                          onClick={() => moveTopic(ti, 1)}
                          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Regenerate topic"
                          onClick={() => regenerateTopic(topic.id)}
                          className="rounded-lg p-1.5 text-amber-800 hover:bg-amber-100"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Add line to this topic"
                          onClick={() => setAddingLineTopicId(topic.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          Add line
                        </button>
                        <button
                          type="button"
                          title="Delete entire topic section"
                          onClick={() => deleteTopic(topic.id)}
                          className="rounded-lg p-1.5 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {topic.lines.map((line, li) => (
                        <li key={line.id} className="flex gap-3 px-4 py-3 text-sm text-gray-800">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                            {li + 1}
                          </span>
                          <span className="min-w-0 flex-1 leading-relaxed">{line.text}</span>
                          <div className="flex shrink-0 gap-1">
                            <button
                              type="button"
                              title="Move up"
                              disabled={li === 0}
                              onClick={() => moveLineInTopic(topic.id, li, -1)}
                              className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title="Move down"
                              disabled={li === topic.lines.length - 1}
                              onClick={() => moveLineInTopic(topic.id, li, 1)}
                              className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title="Edit"
                              onClick={() => {
                                setEditingLine({ topicId: topic.id, lineId: line.id })
                                setEditingLineValue(line.text)
                              }}
                              className="rounded-lg p-1.5 text-indigo-700 hover:bg-indigo-100"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title="Regenerate line"
                              onClick={() => regenerateLine(topic.id, li)}
                              className="rounded-lg p-1.5 text-amber-800 hover:bg-amber-100"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title="Remove"
                              onClick={() => deleteLine(topic.id, li)}
                              className="rounded-lg p-1.5 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => setPhase('build')}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              ← Edit requirements
            </button>
            <button
              type="button"
              onClick={regenerateAll}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-900 hover:bg-indigo-100"
            >
              <Sparkles className="h-4 w-4" />
              Regenerate all
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Publish & export</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saveDraftPending || topicBlocks.length === 0}
                onClick={() => void handleSaveDraft()}
                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                {saveDraftPending ? 'Saving draft…' : 'Save draft'}
              </button>
              <button
                type="button"
                onClick={() => setPrintOpen(true)}
                disabled={topicBlocks.length === 0}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                <Printer className="h-4 w-4" />
                Print preview
              </button>
              <button
                type="button"
                onClick={exportPdf}
                disabled={topicBlocks.length === 0}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
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
                disabled={publishPending || topicBlocks.length === 0}
                onClick={() => void handlePublish()}
                className="ml-auto rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
              >
                {publishPending ? 'Publishing…' : isEdit ? 'Save changes' : 'Publish assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AssignmentPrintPreviewModal
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        meta={assignmentPrintMeta}
        topics={topicBlocks}
        savedLayout={handoutLayout}
        onSaveLayout={handleHandoutLayoutSave}
      />

      <CustomModal
        open={discardOpen}
        close={() => setDiscardOpen(false)}
        title="Discard changes?"
        primaryButtonText="Leave"
        isDelete
        handleSave={() => {
          rag.resetSources()
          setDiscardOpen(false)
          goList()
        }}
      >
        <p className="py-3 text-sm text-gray-600">
          Unsaved catalog scope (titles, topics, refinement) will be cleared. Continue?
        </p>
      </CustomModal>

      <CustomModal
        open={editingLine !== null}
        close={() => setEditingLine(null)}
        title="Edit brief line"
        primaryButtonText="Save"
        handleSave={() => {
          if (!editingLine) return
          updateLineText(editingLine.topicId, editingLine.lineId, editingLineValue)
          setEditingLine(null)
        }}
      >
        <textarea
          rows={4}
          value={editingLineValue}
          onChange={(e) => setEditingLineValue(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
        />
      </CustomModal>

      <CustomModal
        open={addingLineTopicId !== null}
        close={() => {
          setAddingLineTopicId(null)
          setAddingLineValue('')
        }}
        title={
          addingLineTopicId
            ? `Add line — ${topicBlocks.find((t) => t.id === addingLineTopicId)?.title ?? 'Topic'}`
            : 'Add brief line'
        }
        primaryButtonText="Add line"
        handleSave={() => {
          if (!addingLineTopicId || !addingLineValue.trim()) return
          addLineToTopic(addingLineTopicId, addingLineValue.trim())
          setAddingLineTopicId(null)
          setAddingLineValue('')
        }}
      >
        <textarea
          rows={4}
          value={addingLineValue}
          onChange={(e) => setAddingLineValue(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          placeholder="Write a new brief line for this topic section…"
        />
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
          ← Back to assignment list
        </button>
      </div>
    </div>
  )
}
