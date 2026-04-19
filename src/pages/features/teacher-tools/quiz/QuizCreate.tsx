import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsWizardStepper } from '../components'
import { demoClasses } from '../demo/teacherToolsDemoData'
import {
  buildQuizStubsFromCriteria,
  formatSourceSummary,
  type QuizDifficultyId,
  type QuizQuestionStub,
  type QuestionMixMode,
  type QuizStubCriteria,
} from '../demo/generationFromSources'
import { downloadQuizPdf } from '../utils/generateQuizPdf'
import type { DemoQuiz } from '../demo/teacherToolsDemoData'
import { GRADES, SUBJECTS } from '../types'
import { newDemoId } from '../demo/newDemoId'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'
import {
  QUIZ_CREATION_STEPS,
  distributeBalancedToTypeCounts,
  QUESTION_COUNT,
  randomGenerationDelay,
  validateRagQuizBuild,
} from './config/quizCreationConfig'
import { DEFAULT_HANDOUT_LAYOUT, type HandoutLayoutOpts } from './config/handoutLayoutConfig'
import { useQuizRagScope } from './hooks/useQuizRagScope'
import { QuizRagBuildSection } from './components/QuizRagBuildSection'
import { QuizGeneratingOverlay } from './components/QuizGeneratingOverlay'
import { QuizReviewSection } from './components/QuizReviewSection'
import type { QuizPrintMeta } from './components/QuizPrintPreviewModal'

function classKeyForGrade(grade: string) {
  return demoClasses.find((c) => c.grade === grade)?.key ?? demoClasses[0]?.key ?? 'g8c'
}

function isDifficultyId(x: string | undefined): x is QuizDifficultyId {
  return x === 'foundation' || x === 'standard' || x === 'challenge'
}

function totalMarksFromStubs(stubs: QuizQuestionStub[]): number {
  return Math.round(stubs.reduce((a, s) => a + (s.points ?? 2), 0) * 10) / 10
}

export default function QuizCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const templateToastRef = useRef(false)
  const { quizId } = useParams<{ quizId?: string }>()
  const isEdit = location.pathname.endsWith('/edit')
  const { toast } = useSnackbar()
  const { api } = useTeacherToolsDemo()

  const [phase, setPhase] = useState<'build' | 'review'>(isEdit ? 'review' : 'build')
  const [generating, setGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [genProgress, setGenProgress] = useState(0.15)
  const [lastCriteria, setLastCriteria] = useState<QuizStubCriteria | null>(null)

  const [title, setTitle] = useState('Topic check quiz')
  const [subject, setSubject] = useState<string>(SUBJECTS[0])
  const [grade, setGrade] = useState<string>(GRADES[0])
  const [studentInstructions, setStudentInstructions] = useState(
    'Answer all questions. Show working where appropriate.'
  )
  const [teacherNotes, setTeacherNotes] = useState('')
  const [timeLimit, setTimeLimit] = useState(30)
  const [questionCount, setQuestionCount] = useState(10)
  const [mixMode, setMixMode] = useState<QuestionMixMode>('balanced')
  const [countMcq, setCountMcq] = useState(4)
  const [countTf, setCountTf] = useState(3)
  const [countShort, setCountShort] = useState(3)
  const [difficulty, setDifficulty] = useState<QuizDifficultyId>('standard')
  const [includeMcq, setIncludeMcq] = useState(true)
  const [includeTf, setIncludeTf] = useState(true)
  const [includeShort, setIncludeShort] = useState(true)
  const [shuffleQuestions, setShuffleQuestions] = useState(true)
  const [shuffleAnswers, setShuffleAnswers] = useState(true)
  const [negativeMarking, setNegativeMarking] = useState(false)
  const [handoutLayout, setHandoutLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)
  const handoutLayoutRef = useRef<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)

  /** Template / URL hint for optional scope refinement when creating new quiz. */
  const [templateScopeHint, setTemplateScopeHint] = useState('')
  /** Full quiz row when editing — drives RAG scope hydration. */
  const [loadedQuiz, setLoadedQuiz] = useState<DemoQuiz | null>(null)
  const [hydrateReady, setHydrateReady] = useState(!isEdit)
  const [publishPending, setPublishPending] = useState(false)
  const [saveDraftPending, setSaveDraftPending] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [buildErrors, setBuildErrors] = useState<string[]>([])

  const [stubs, setStubs] = useState<QuizQuestionStub[]>([])

  const rag = useQuizRagScope({
    subject,
    grade,
    initialSelectedBookIds: isEdit ? loadedQuiz?.sourceBookIds : undefined,
    initialScopeTopics: isEdit ? loadedQuiz?.scopeTopics : undefined,
    initialScopeRefinement: isEdit ? loadedQuiz?.scopeRefinement : templateScopeHint,
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
    if (topic) setTemplateScopeHint(topic)
    if (searchParams.get('fromTemplate') && !templateToastRef.current) {
      templateToastRef.current = true
      toast.success('Prefilled from template')
    }
  }, [isEdit, searchParams, toast])

  useEffect(() => {
    if (!isEdit || !quizId) {
      setHydrateReady(true)
      return
    }
    let cancelled = false
    setHydrateReady(false)
    ;(async () => {
      const q = await api.getQuiz(quizId)
      if (cancelled) return
      if (!q) {
        toast.error('Quiz not found')
        navigate('/teacher-tools/quiz')
        return
      }
      setTitle(q.title)
      setSubject(q.subject)
      setGrade(q.grade)
      setTimeLimit(q.timeLimitMinutes)
      setLoadedQuiz(q)
      setQuestionCount(q.questions)
      if (q.studentInstructions) setStudentInstructions(q.studentInstructions)
      if (q.difficulty && isDifficultyId(q.difficulty)) setDifficulty(q.difficulty)
      if (typeof q.shuffleQuestions === 'boolean') setShuffleQuestions(q.shuffleQuestions)
      if (typeof q.shuffleAnswers === 'boolean') setShuffleAnswers(q.shuffleAnswers)
      if (typeof q.negativeMarking === 'boolean') setNegativeMarking(q.negativeMarking)
      const hydratedLayout = q.handoutLayout ? { ...DEFAULT_HANDOUT_LAYOUT, ...q.handoutLayout } : DEFAULT_HANDOUT_LAYOUT
      handoutLayoutRef.current = hydratedLayout
      setHandoutLayout(hydratedLayout)
      if (q.questionStubs?.length) {
        setStubs(q.questionStubs)
        setPhase('review')
      } else {
        setPhase('build')
      }
      setHydrateReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [api, isEdit, navigate, quizId, toast])

  const resolveQuizIdForGen = useCallback(() => quizId ?? newDemoId('quiz'), [quizId])

  const buildCriteria = useCallback(
    (idForGen: string): QuizStubCriteria => {
      const srcTags = rag.ragSourceLabels.length > 0 ? rag.ragSourceLabels : undefined
      const customSum = countMcq + countTf + countShort
      if (mixMode === 'custom') {
        return {
          quizId: idForGen,
          topic: rag.combinedTopicLabel,
          subject,
          grade,
          count: Math.min(QUESTION_COUNT.max, Math.max(QUESTION_COUNT.min, customSum)),
          difficulty,
          includeMcq: countMcq > 0,
          includeTf: countTf > 0,
          includeShort: countShort > 0,
          teacherNotes: teacherNotes.trim() || undefined,
          mixMode: 'custom',
          countsByType: { mcq: countMcq, tf: countTf, short: countShort },
          ragSourceLabels: srcTags,
        }
      }
      return {
        quizId: idForGen,
        topic: rag.combinedTopicLabel,
        subject,
        grade,
        count: Math.min(QUESTION_COUNT.max, Math.max(QUESTION_COUNT.min, questionCount)),
        difficulty,
        includeMcq,
        includeTf,
        includeShort,
        teacherNotes: teacherNotes.trim() || undefined,
        mixMode: 'balanced',
        ragSourceLabels: srcTags,
      }
    },
    [
      rag.combinedTopicLabel,
      rag.ragSourceLabels,
      subject,
      grade,
      questionCount,
      mixMode,
      countMcq,
      countTf,
      countShort,
      difficulty,
      includeMcq,
      includeTf,
      includeShort,
      teacherNotes,
    ]
  )

  const runGeneration = useCallback(async () => {
    const v = validateRagQuizBuild({
      title,
      generateWithoutSources: rag.generateWithoutSources,
      selectedBookIds: rag.selectedBookIds,
      selectedTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement,
      mixMode,
      includeMcq,
      includeTf,
      includeShort,
      questionCount,
      countsByType: { mcq: countMcq, tf: countTf, short: countShort },
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
    const delay = randomGenerationDelay()
    try {
      await new Promise((r) => setTimeout(r, delay))
      const id = resolveQuizIdForGen()
      const crit = buildCriteria(id)
      const next = buildQuizStubsFromCriteria(crit)
      setStubs(next)
      setLastCriteria(crit)
      setPhase('review')
      toast.success('Questions generated — review below.')
    } catch {
      setGenerationError('Generation failed (demo). Adjust sources and try again.')
      toast.error('Could not generate questions.')
    } finally {
      window.clearInterval(steps)
      setGenerating(false)
      setGenProgress(1)
    }
  }, [
    title,
    mixMode,
    includeMcq,
    includeTf,
    includeShort,
    questionCount,
    countMcq,
    countTf,
    countShort,
    toast,
    resolveQuizIdForGen,
    buildCriteria,
    rag.generateWithoutSources,
    rag.selectedBookIds,
    rag.selectedTopics,
    rag.scopeRefinement,
  ])

  const regenerateAll = useCallback(() => {
    const crit = lastCriteria ?? buildCriteria(resolveQuizIdForGen())
    setGenerating(true)
    setGenProgress(0.2)
    const interval = window.setInterval(() => {
      setGenProgress((p) => Math.min(0.9, p + 0.1))
    }, 400)
    window.setTimeout(() => {
      window.clearInterval(interval)
      try {
        setStubs(buildQuizStubsFromCriteria(crit))
        setLastCriteria(crit)
        toast.success('Question set regenerated.')
      } finally {
        setGenerating(false)
        setGenProgress(1)
      }
    }, randomGenerationDelay())
  }, [lastCriteria, buildCriteria, resolveQuizIdForGen, toast])

  const regenerateOne = useCallback(
    (index: number) => {
      const crit = lastCriteria ?? buildCriteria(resolveQuizIdForGen())
      const at = stubs[index]
      const prevType = at?.type ?? 'mcq'
      const preservedShortLines = at?.type === 'short' ? at.responseLines : undefined
      const one = buildQuizStubsFromCriteria({
        ...crit,
        count: 1,
        forceType: prevType,
        quizId: `${crit.quizId}-reg-${index}-${Date.now()}`,
      })[0]
      setStubs((rows) =>
        rows.map((s, i) =>
          i === index
            ? {
                ...one,
                id: s.id,
                options: one.type === 'mcq' ? one.options : undefined,
                responseLines: one.type === 'short' ? (preservedShortLines ?? one.responseLines) : undefined,
                reviewBadges: one.reviewBadges ?? s.reviewBadges,
              }
            : s
        )
      )
      toast.success('Question regenerated.')
    },
    [lastCriteria, buildCriteria, resolveQuizIdForGen, stubs, toast]
  )

  const reorder = useCallback((from: number, to: number) => {
    if (to < 0 || to >= stubs.length) return
    setStubs((prev) => {
      const next = [...prev]
      const [row] = next.splice(from, 1)
      next.splice(to, 0, row)
      return next
    })
  }, [stubs.length])

  const deleteAt = useCallback(
    (index: number) => {
      if (stubs.length <= 1) {
        toast.error('Keep at least one question, or go back to edit requirements.')
        return
      }
      setStubs((prev) => prev.filter((_, i) => i !== index))
      toast.success('Question removed')
    },
    [stubs.length, toast]
  )

  const handleAddQuestion = useCallback(
    (stub: QuizQuestionStub) => {
      if (stubs.length >= QUESTION_COUNT.max) {
        toast.error(`Each quiz supports at most ${QUESTION_COUNT.max} questions.`)
        return
      }
      setStubs((prev) => [...prev, stub])
      toast.success('Question added to the set')
    },
    [stubs.length, toast]
  )

  const goList = () => navigate('/teacher-tools/quiz')

  const handleHandoutLayoutSave = useCallback((layout: HandoutLayoutOpts) => {
    const nextLayout = { ...DEFAULT_HANDOUT_LAYOUT, ...layout }
    handoutLayoutRef.current = nextLayout
    setHandoutLayout(nextLayout)
    toast.success('Handout spacing saved. PDF export and print use these settings.')
  }, [toast])

  const handleMixModeChange = useCallback(
    (m: QuestionMixMode) => {
      if (m === mixMode) return
      if (m === 'custom') {
        const d = distributeBalancedToTypeCounts(questionCount, includeMcq, includeTf, includeShort)
        setCountMcq(d.mcq)
        setCountTf(d.tf)
        setCountShort(d.short)
        setMixMode('custom')
        return
      }
      const sum = countMcq + countTf + countShort
      const clamped = Math.min(QUESTION_COUNT.max, Math.max(QUESTION_COUNT.min, sum || QUESTION_COUNT.min))
      setQuestionCount(clamped)
      setIncludeMcq(countMcq > 0)
      setIncludeTf(countTf > 0)
      setIncludeShort(countShort > 0)
      setMixMode('balanced')
    },
    [mixMode, questionCount, includeMcq, includeTf, includeShort, countMcq, countTf, countShort]
  )

  const buildDemoPayload = useCallback(
    (status: 'draft' | 'published'): Omit<DemoQuiz, 'id'> => {
      const ctx = rag.getGenerationContext()
      const n = stubs.length
      const tm = totalMarksFromStubs(stubs)
      const activeLayout = handoutLayoutRef.current
      return {
        title: title.trim() || 'Untitled quiz',
        subject,
        grade,
        classes: [classKeyForGrade(grade)],
        questions: n,
        totalMarks: tm,
        timeLimitMinutes: timeLimit,
        status,
        submissionCount: 0,
        avgScore: 0,
        topic: rag.combinedTopicLabel,
        sourceBookIds: rag.selectedBookIds,
        scopeTopics: rag.selectedTopics,
        scopeRefinement: rag.scopeRefinement.trim() || undefined,
        sourceSummary: formatSourceSummary(ctx),
        questionStubs: stubs,
        studentInstructions,
        difficulty,
        shuffleQuestions,
        shuffleAnswers,
        negativeMarking,
        handoutLayout: activeLayout,
      }
    },
    [
      rag,
      stubs,
      title,
      subject,
      grade,
      timeLimit,
      studentInstructions,
      difficulty,
      shuffleQuestions,
      shuffleAnswers,
      negativeMarking,
    ]
  )

  const handleSaveDraft = useCallback(async () => {
    if (stubs.length === 0) {
      toast.error('Generate at least one question before saving a draft.')
      return
    }
    setSaveDraftPending(true)
    try {
      const payload = buildDemoPayload('draft')
      if (isEdit && quizId) {
        const res = await api.updateQuiz(quizId, payload)
        if (!res.ok) {
          if (res.error === 'READ_ONLY') toast.error('Sample library items cannot be edited. Duplicate from the list first.')
          else toast.error('Could not save draft')
          return
        }
        toast.success('Draft saved')
        navigate(`/teacher-tools/quiz/${quizId}`)
        return
      }
      const id = newDemoId('quiz')
      await api.createQuiz({ id, ...payload })
      toast.success('Draft saved')
      navigate(`/teacher-tools/quiz/${id}`)
    } finally {
      setSaveDraftPending(false)
    }
  }, [api, buildDemoPayload, isEdit, quizId, navigate, stubs.length, toast])

  const handlePublish = useCallback(async () => {
    if (stubs.length === 0) {
      toast.error('Add questions before publishing.')
      return
    }
    setPublishPending(true)
    try {
      const payload = buildDemoPayload('published')
      if (isEdit && quizId) {
        const res = await api.updateQuiz(quizId, payload)
        if (!res.ok) {
          if (res.error === 'READ_ONLY') toast.error('Sample library items cannot be edited. Duplicate from the list first.')
          else toast.error('Could not save quiz')
          return
        }
        toast.success('Quiz updated')
        navigate(`/teacher-tools/quiz/${quizId}`)
        return
      }
      const id = newDemoId('quiz')
      await api.createQuiz({ id, ...payload })
      toast.success('Quiz published')
      navigate(`/teacher-tools/quiz/${id}`)
    } finally {
      setPublishPending(false)
    }
  }, [api, buildDemoPayload, isEdit, navigate, quizId, stubs.length, toast])

  const exportPdf = useCallback(() => {
    const ctx = rag.getGenerationContext()
    const activeLayout = handoutLayoutRef.current
    const q: DemoQuiz = {
      id: isEdit && quizId ? quizId : 'export',
      title: title.trim() || 'Quiz',
      subject,
      grade,
      classes: [classKeyForGrade(grade)],
      questions: stubs.length,
      totalMarks: totalMarksFromStubs(stubs),
      timeLimitMinutes: timeLimit,
      status: 'draft',
      submissionCount: 0,
      avgScore: 0,
      topic: rag.combinedTopicLabel,
      sourceBookIds: rag.selectedBookIds,
      scopeTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement.trim() || undefined,
      sourceSummary: formatSourceSummary(ctx),
      questionStubs: stubs,
      studentInstructions,
      difficulty,
      handoutLayout: activeLayout,
    }
    try {
      downloadQuizPdf(q, `${title.replace(/\s+/g, '-').slice(0, 32)}-quiz.pdf`)
      toast.success('PDF downloaded')
    } catch {
      toast.error('Could not generate PDF')
    }
  }, [rag, title, subject, grade, timeLimit, stubs, studentInstructions, difficulty, isEdit, quizId, toast])

  const printMeta: QuizPrintMeta = {
    title: title.trim() || 'Quiz',
    subject,
    grade,
    timeLimitMinutes: timeLimit,
    studentInstructions,
    topic: rag.combinedTopicLabel,
    sourceSummaryLine: formatSourceSummary(rag.getGenerationContext()),
  }

  if (isEdit && !hydrateReady) {
    return (
      <div className="min-h-[40vh] space-y-3 p-8">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-32 max-w-xl animate-pulse rounded-2xl bg-gray-100" />
        <p className="text-sm text-gray-600">Loading quiz…</p>
      </div>
    )
  }

  const wizardStep = phase === 'build' ? 0 : 1

  return (
    <div className="space-y-6 pb-10">
      <TeacherToolsPageHeader
        title={isEdit ? 'Edit quiz' : 'Create quiz'}
        subtitle="Choose catalog sources, define retrieval scope, run generation, then review and publish."
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Quiz', to: '/teacher-tools/quiz' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
      />

      <TeacherToolsWizardStepper
        steps={[...QUIZ_CREATION_STEPS]}
        current={wizardStep}
        onStepClick={(i) => {
          if (i === 1 && stubs.length === 0) {
            toast.error('Generate questions before opening review.')
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
          <QuizRagBuildSection
            rag={rag}
            title={title}
            onTitleChange={setTitle}
            subject={subject}
            onSubjectChange={setSubject}
            grade={grade}
            onGradeChange={setGrade}
            studentInstructions={studentInstructions}
            onStudentInstructionsChange={setStudentInstructions}
            teacherNotes={teacherNotes}
            onTeacherNotesChange={setTeacherNotes}
            mixMode={mixMode}
            onMixModeChange={handleMixModeChange}
            questionCount={questionCount}
            onQuestionCountChange={setQuestionCount}
            countMcq={countMcq}
            countTf={countTf}
            countShort={countShort}
            onCountMcq={setCountMcq}
            onCountTf={setCountTf}
            onCountShort={setCountShort}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            includeMcq={includeMcq}
            includeTf={includeTf}
            includeShort={includeShort}
            onToggleMcq={setIncludeMcq}
            onToggleTf={setIncludeTf}
            onToggleShort={setIncludeShort}
            timeLimit={timeLimit}
            onTimeLimitChange={setTimeLimit}
            shuffleQuestions={shuffleQuestions}
            shuffleAnswers={shuffleAnswers}
            negativeMarking={negativeMarking}
            onShuffleQuestions={setShuffleQuestions}
            onShuffleAnswers={setShuffleAnswers}
            onNegativeMarking={setNegativeMarking}
            validationErrors={buildErrors}
          />
          <div className="sticky bottom-4 z-10 mt-8 flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">Ready to generate from your scope</p>
              <p className="mt-0.5 text-xs text-gray-600">
                {rag.generateWithoutSources
                  ? 'Primary action runs topic-only generation (no catalog retrieval).'
                  : 'Primary action runs a demo retrieval + generation pass using the selected titles and topic strands above.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => runGeneration()}
              disabled={generating}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-60"
            >
              {rag.generateWithoutSources ? 'Generate without sources' : 'Generate from selected materials'}
            </button>
          </div>
        </>
      )}

      {phase === 'review' && (
        <QuizReviewSection
          stubs={stubs}
          totalPoints={totalMarksFromStubs(stubs)}
          sourceSummaryLine={formatSourceSummary(rag.getGenerationContext())}
          printMeta={printMeta}
          handoutLayout={handoutLayout}
          onHandoutLayoutSave={handleHandoutLayoutSave}
          canAddMoreQuestions={stubs.length < QUESTION_COUNT.max}
          onReorder={reorder}
          onDelete={deleteAt}
          onUpdateStub={(index, next) => {
            setStubs((prev) => prev.map((s, i) => (i === index ? next : s)))
          }}
          onAddQuestion={handleAddQuestion}
          onRegenerateAll={regenerateAll}
          onRegenerateOne={regenerateOne}
          onBackToEdit={() => setPhase('build')}
          onSaveDraft={handleSaveDraft}
          onExportPdf={exportPdf}
          onPublish={handlePublish}
          saveDraftPending={saveDraftPending}
          publishPending={publishPending}
        />
      )}

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

      <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => {
            if (rag.isDirty) setDiscardOpen(true)
            else goList()
          }}
          className="text-sm font-semibold text-primary-600 hover:text-primary-500"
        >
          ← Back to quiz list
        </button>
      </div>
    </div>
  )
}
