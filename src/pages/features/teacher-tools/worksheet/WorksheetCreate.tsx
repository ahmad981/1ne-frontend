import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsWizardStepper, ContentSourcesPanel, Phase2Section } from '../components'
import { useContentSourcesForm } from '../hooks/useContentSourcesForm'
import { demoClasses } from '../demo/teacherToolsDemoData'
import { formatSourceSummary, generateWorksheetBlocks } from '../demo/generationFromSources'
import type { WorksheetBlock } from '../demo/topicAwareGenerators'
import { GRADES, SUBJECTS } from '../types'
import { newDemoId } from '../demo/newDemoId'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
import type { DemoQuiz } from '../demo/teacherToolsDemoData'
import { downloadQuizPdf } from '../utils/generateQuizPdf'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'
import { AlertCircle, ArrowDown, ArrowUp, Download, Eye, FileJson, LayoutGrid, Pencil, PlusCircle, RefreshCw, Settings2, Sparkles, Trash2, Users } from 'lucide-react'
import { QuizGeneratingOverlay } from '../quiz/components/QuizGeneratingOverlay'
import {
  DEFAULT_HANDOUT_LAYOUT,
  LINE_HEIGHT_PRESETS,
  QUESTION_GAP_PRESETS,
  RULED_LINE_SPACING_PRESETS,
  type HandoutLayoutOpts,
} from '../quiz/config/handoutLayoutConfig'

const BUILD_STEPS = ['Configure & generate', 'Review & publish']

const BLOCK_LABELS: Record<string, string> = {
  mcq: 'Multiple choice',
  fill_blank: 'Fill in the blank',
  short: 'Short answer',
  match: 'Matching',
}

const LINE_SPACING_OPTIONS = [
  { value: 'compact', label: 'Compact (1.2×)' },
  { value: 'normal', label: 'Normal (1.5×)' },
  { value: 'wide', label: 'Wide (2×) — for student writing' },
]

function classKeyForGrade(grade: string) {
  return demoClasses.find((c) => c.grade === grade)?.key ?? demoClasses[0]?.key ?? 'g8c'
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

export default function WorksheetCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const templateToastRef = useRef(false)
  const { worksheetId } = useParams<{ worksheetId?: string }>()
  const isEdit = location.pathname.endsWith('/edit')
  const { toast } = useSnackbar()
  const { api } = useTeacherToolsDemo()

  const [phase, setPhase] = useState<'build' | 'review'>(isEdit ? 'review' : 'build')
  const [generating, setGenerating] = useState(false)
  const [genProgress, setGenProgress] = useState(0.15)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [buildErrors, setBuildErrors] = useState<string[]>([])
  const [blocks, setBlocks] = useState<WorksheetBlock[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [handoutLayout, setHandoutLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)
  const [draftLayout, setDraftLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)

  const [title, setTitle] = useState('Practice worksheet')
  const [subject, setSubject] = useState<string>(SUBJECTS[3])
  const [grade, setGrade] = useState<string>(GRADES[3])
  const [format, setFormat] = useState<'printable_pdf' | 'interactive_digital'>('interactive_digital')
  const [difficultyProfile, setDifficultyProfile] = useState<'Foundational' | 'Balanced' | 'Advanced' | 'Olympiad Prep'>('Balanced')
  const [targetQuestionCount, setTargetQuestionCount] = useState(10)

  const [showAnswerKey, setShowAnswerKey] = useState(false)
  const [lineSpacing, setLineSpacing] = useState('normal')
  const [includeInstructions, setIncludeInstructions] = useState(true)
  const [randomiseOrder, setRandomiseOrder] = useState(false)

  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [discardOpen, setDiscardOpen] = useState(false)
  const [loadedTopic, setLoadedTopic] = useState<string | undefined>(undefined)
  const [hydrateReady, setHydrateReady] = useState(!isEdit)
  const [publishPending, setPublishPending] = useState(false)
  const [saveDraftPending, setSaveDraftPending] = useState(false)
  const [usageMeta, setUsageMeta] = useState({ createdAt: '', usageCount: 0 })
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null)
  const [editingBlockValue, setEditingBlockValue] = useState('')
  const [addingBlockOpen, setAddingBlockOpen] = useState(false)
  const [addingBlockValue, setAddingBlockValue] = useState('')

  const sources = useContentSourcesForm({ subject, grade, initialTopic: loadedTopic })

  useEffect(() => {
    const match = demoClasses.find((c) => c.grade === grade)
    if (match && !selectedClasses.includes(match.key)) {
      setSelectedClasses([match.key])
    }
  }, [grade]) // eslint-disable-line react-hooks/exhaustive-deps

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
    const fmt = searchParams.get('format')
    if (fmt === 'printable_pdf' || fmt === 'interactive_digital') setFormat(fmt)
    if (searchParams.get('fromTemplate') && !templateToastRef.current) {
      templateToastRef.current = true
      toast.success('Prefilled from template')
    }
  }, [isEdit, searchParams, toast])

  useEffect(() => {
    if (!isEdit || !worksheetId) {
      setHydrateReady(true)
      return
    }
    let cancelled = false
    setHydrateReady(false)
    ;(async () => {
      const w = await api.getWorksheet(worksheetId)
      if (cancelled) return
      if (!w) {
        toast.error('Worksheet not found')
        navigate('/teacher-tools/worksheet')
        return
      }
      setTitle(w.title)
      setSubject(w.subject)
      setGrade(w.grade)
      setFormat(w.format)
      setLoadedTopic(w.topic)
      setSelectedClasses(w.classes ?? [])
      setUsageMeta({ createdAt: w.createdAt, usageCount: w.usageCount })
      setHydrateReady(true)
    })()
    return () => { cancelled = true }
  }, [api, isEdit, navigate, toast, worksheetId])

  const regenerate = useCallback(() => {
    const generated = generateWorksheetBlocks(sources.getGenerationContext())
    const seeded = generated.slice(0, targetQuestionCount)
    while (seeded.length < targetQuestionCount) {
      seeded.push({ type: 'short', prompt: `${difficultyProfile} extension item ${seeded.length + 1}: justify your reasoning using curriculum vocabulary.`, answer: '' })
    }
    setBlocks(seeded)
    toast.success('Content regenerated from sources')
  }, [sources.getGenerationContext, toast, targetQuestionCount, difficultyProfile]) // eslint-disable-line react-hooks/exhaustive-deps

  const editBlock = (index: number) => {
    const block = blocks[index]
    if (!block) return
    const current = 'prompt' in block ? block.prompt : `${block.left.join(' | ')} -> ${block.right.join(' | ')}`
    setEditingBlockIndex(index)
    setEditingBlockValue(current)
  }

  const addManualBlock = () => {
    setAddingBlockOpen(true)
    setAddingBlockValue('')
  }

  const regenerateBlock = (index: number) => {
    const regenerated = generateWorksheetBlocks(sources.getGenerationContext())
    const next = regenerated[index] ?? regenerated[0]
    if (!next) return
    setBlocks((prev) => prev.map((b, i) => (i === index ? next : b)))
    toast.success('Block regenerated')
  }

  const deleteBlock = (index: number) => {
    setBlocks((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
    toast.success('Block removed')
  }

  const moveBlock = (index: number, direction: -1 | 1) => {
    setBlocks((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      const [row] = next.splice(index, 1)
      next.splice(target, 0, row)
      return next
    })
  }

  const runGeneration = () => {
    const errs: string[] = []
    if (!title.trim()) errs.push('Worksheet title is required.')
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
        const generated = generateWorksheetBlocks(sources.getGenerationContext())
        const seeded = generated.slice(0, targetQuestionCount)
        while (seeded.length < targetQuestionCount) {
          seeded.push({ type: 'short', prompt: `${difficultyProfile} extension item ${seeded.length + 1}: justify your reasoning using curriculum vocabulary.`, answer: '' })
        }
        setBlocks(seeded)
        setPhase('review')
        toast.success('Worksheet generated — review below.')
      } catch {
        setGenerationError('Generation failed (demo). Please retry with updated inputs.')
        toast.error('Could not generate worksheet content.')
      } finally {
        window.clearInterval(steps)
        setGenerating(false)
        setGenProgress(1)
      }
    }, 1200 + Math.random() * 800)
  }

  const toggleClass = (key: string) => {
    setSelectedClasses((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const buildPayload = (status: 'draft' | 'published') => {
    const ctx = sources.getGenerationContext()
    const classes = selectedClasses.length > 0 ? selectedClasses : [classKeyForGrade(grade)]
    const createdAt = isEdit && usageMeta.createdAt ? usageMeta.createdAt : new Date().toISOString().slice(0, 10)
    return {
      title: title.trim() || 'Untitled worksheet',
      topic: sources.combinedTopicLabel,
      subject,
      grade,
      format,
      status,
      classes,
      createdAt,
      usageCount: isEdit ? usageMeta.usageCount : 0,
      sourceSummary: formatSourceSummary(ctx),
    }
  }

  const handleSaveDraft = async () => {
    if (blocks.length === 0) {
      toast.error('Generate at least one block before saving a draft.')
      return
    }
    setSaveDraftPending(true)
    try {
      const payload = buildPayload('draft')
      if (isEdit && worksheetId) {
        const res = await api.updateWorksheet(worksheetId, payload)
        if (!res.ok) {
          if (res.error === 'READ_ONLY') toast.error('Sample library items cannot be edited.')
          else toast.error('Could not save draft')
          return
        }
        toast.success('Draft saved')
        navigate(`/teacher-tools/worksheet/${worksheetId}`)
        return
      }
      const id = newDemoId('ws')
      await api.createWorksheet({ id, ...payload })
      toast.success('Draft saved')
      navigate(`/teacher-tools/worksheet/${id}`)
    } finally {
      setSaveDraftPending(false)
    }
  }

  const handlePublish = async () => {
    if (blocks.length === 0) {
      toast.error('Generate at least one block before publishing.')
      return
    }
    setPublishPending(true)
    try {
      const payload = buildPayload('published')
      if (isEdit && worksheetId) {
        const res = await api.updateWorksheet(worksheetId, payload)
        if (!res.ok) {
          if (res.error === 'READ_ONLY') toast.error('Sample library items cannot be edited. Duplicate from the list first.')
          else toast.error('Could not save worksheet')
          return
        }
        toast.success('Worksheet updated')
      } else {
        await api.createWorksheet({ id: newDemoId('ws'), ...payload })
        toast.success('Worksheet published')
      }
      navigate('/teacher-tools/worksheet')
    } finally {
      setPublishPending(false)
    }
  }

  const goList = () => navigate('/teacher-tools/worksheet')

  const exportPdf = () => {
    const stubs = blocks.map((b, i) => ({
      id: `ws-${i + 1}`,
      type: b.type === 'mcq' ? 'mcq' as const : b.type === 'match' ? 'tf' as const : 'short' as const,
      prompt: 'prompt' in b ? b.prompt : `${b.left.join(', ')} match ${b.right.join(', ')}`,
      points: 2,
      options: b.type === 'mcq' && 'options' in b ? b.options : undefined,
      responseLines: 3,
    }))
    const payload: DemoQuiz = {
      id: isEdit && worksheetId ? worksheetId : newDemoId('ws-preview'),
      title: `${title || 'Worksheet'} — Handout`,
      subject,
      grade,
      classes: selectedClasses.length > 0 ? selectedClasses : [classKeyForGrade(grade)],
      questions: stubs.length,
      totalMarks: stubs.length * 2,
      timeLimitMinutes: 30,
      status: 'draft',
      submissionCount: 0,
      avgScore: 0,
      topic: sources.combinedTopicLabel,
      sourceSummary: formatSourceSummary(sources.getGenerationContext()),
      questionStubs: stubs,
      studentInstructions: includeInstructions ? 'Complete all worksheet items.' : '',
      handoutLayout,
    }
    downloadQuizPdf(payload, `${(title || 'worksheet').replace(/\s+/g, '-').slice(0, 32)}-worksheet.pdf`)
    toast.success('PDF downloaded')
  }

  if (isEdit && !hydrateReady) {
    return (
      <div className="min-h-[40vh] space-y-3 p-8">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-32 max-w-xl animate-pulse rounded-2xl bg-gray-100" />
        <p className="text-sm text-gray-600">Loading worksheet…</p>
      </div>
    )
  }

  const wizardStep = phase === 'build' ? 0 : 1
  const assignedClasses = demoClasses.filter((c) =>
    selectedClasses.length > 0 ? selectedClasses.includes(c.key) : c.grade === grade
  )

  return (
    <div className="space-y-6 pb-10">
      <TeacherToolsPageHeader
        title={isEdit ? 'Edit worksheet' : 'Create worksheet'}
        subtitle="Choose sources and settings, generate the content blocks, then review and publish."
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Worksheet', to: '/teacher-tools/worksheet' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
      />

      <TeacherToolsWizardStepper
        steps={BUILD_STEPS}
        current={wizardStep}
        onStepClick={(i) => {
          if (i === 1 && phase === 'build') {
            toast.error('Generate the worksheet first to open review.')
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
                kicker="Worksheet identity"
                title="Basics & sources"
                subtitle="Name the worksheet, choose the output format, and pick the catalog scope to draw from."
              />
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <label className="md:col-span-2 block text-sm font-medium text-gray-800">
                Title <span className="text-red-500">*</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Photosynthesis — retrieval practice (Grade 8)"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Output format
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as typeof format)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="interactive_digital">Interactive digital</option>
                  <option value="printable_pdf">Printable PDF</option>
                </select>
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
                International difficulty profile
                <select
                  value={difficultyProfile}
                  onChange={(e) => setDifficultyProfile(e.target.value as typeof difficultyProfile)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="Foundational">Foundational</option>
                  <option value="Balanced">Balanced</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Olympiad Prep">Olympiad Prep</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Target question count
                <input
                  type="number"
                  min={6}
                  max={24}
                  value={targetQuestionCount}
                  onChange={(e) => setTargetQuestionCount(Math.min(24, Math.max(6, Number(e.target.value) || 10)))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </label>
              <div className="md:col-span-2">
                <ContentSourcesPanel subject={subject} grade={grade} model={sources} />
              </div>
            </div>
          </section>

          {/* Step 2 — Settings */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50/60 to-white px-6 py-5">
              <StepHeader
                step={2}
                kicker="Layout & display"
                title="Worksheet settings"
                subtitle="Control how the worksheet looks when distributed to students."
              />
            </div>
            <div className="space-y-5 p-6">
              <div className="space-y-2">
                {[
                  { label: 'Show answer key (teacher copy)', checked: showAnswerKey, onChange: (v: boolean) => setShowAnswerKey(v) },
                  { label: 'Include instructions header', checked: includeInstructions, onChange: (v: boolean) => setIncludeInstructions(v) },
                  { label: 'Randomise question order on delivery', checked: randomiseOrder, onChange: (v: boolean) => setRandomiseOrder(v) },
                ].map(({ label, checked, onChange }) => (
                  <label key={label} className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 hover:bg-gray-100">
                    <span className="text-sm text-gray-700">{label}</span>
                    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="rounded" />
                  </label>
                ))}
              </div>
              {format === 'printable_pdf' && (
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-800">Line spacing (printable)</p>
                  <div className="space-y-2">
                    {LINE_SPACING_OPTIONS.map(({ value, label }) => (
                      <label key={value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 hover:bg-gray-100">
                        <input
                          type="radio"
                          name="line_spacing"
                          value={value}
                          checked={lineSpacing === value}
                          onChange={() => setLineSpacing(value)}
                          className="text-indigo-600"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <Phase2Section title="Advanced print options">
                <p className="text-sm text-gray-700">
                  Grid paper backgrounds, custom margins, header/footer branding, and page numbering unlock in Phase 2.
                </p>
              </Phase2Section>
            </div>
          </section>

          {/* Step 3 — Assign to classes */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-white px-6 py-5">
              <StepHeader
                step={3}
                kicker="Student cohort"
                title="Share with classes"
                subtitle="Select which classes can access this worksheet after you publish."
              />
            </div>
            <div className="p-6">
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
              <p className="text-sm font-semibold text-gray-900">Ready to generate worksheet content</p>
              <p className="mt-0.5 text-xs text-gray-600">
                Produces a mix of question types from the selected topic strands and catalog books above.
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
                'Generate worksheet'
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
                  <p className="text-2xl font-semibold text-gray-900">{blocks.length}</p>
                  <p className="text-xs text-gray-500">Questions</p>
                </div>
                <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-semibold text-gray-900">{new Set(blocks.map((b) => b.type)).size}</p>
                  <p className="text-xs text-gray-500">Types</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => { setDraftLayout(handoutLayout); setPreviewOpen(true) }} disabled={blocks.length === 0} className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-900 shadow-sm hover:bg-indigo-50 disabled:opacity-50"><Eye className="h-3.5 w-3.5" />Print preview</button>
                <button type="button" onClick={addManualBlock} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-900 shadow-sm hover:bg-emerald-50"><PlusCircle className="h-3.5 w-3.5" />Add question manually</button>
              </div>
            </div>
          </div>

          {/* Generated content blocks */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50/60 to-white px-6 py-4">
              <LayoutGrid className="h-4 w-4 text-indigo-500" />
              <h3 className="font-semibold text-gray-900">Content blocks</h3>
              <span className="ml-auto text-xs text-gray-400">
                {formatSourceSummary(sources.getGenerationContext())}
              </span>
              <button type="button" onClick={regenerate} className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                Regenerate
              </button>
              <button type="button" onClick={addManualBlock} className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                Add manual
              </button>
            </div>
            {blocks.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                No blocks generated. Go back and select a topic or add a scope refinement.
              </div>
            ) : (
              <div className="space-y-4 p-6">
                {(['mcq', 'fill_blank', 'short', 'match'] as const).map((kind) => {
                  const group = blocks.filter((b) => b.type === kind)
                  if (group.length === 0) return null
                  return (
                    <div key={kind}>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                        {BLOCK_LABELS[kind]} ({group.length})
                      </p>
                      <ul className="space-y-2">
                        {group.map((b, i) => {
                          const absoluteIndex = blocks.indexOf(b)
                          return (
                          <li key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                            {'prompt' in b && <p>{b.prompt}</p>}
                            {'left' in b && (
                              <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                                <div className="space-y-1">
                                  {b.left.map((l, j) => <p key={j} className="font-medium">{l}</p>)}
                                </div>
                                <div className="space-y-1 text-gray-500">
                                  {b.right.map((r, j) => <p key={j}>{r}</p>)}
                                </div>
                              </div>
                            )}
                            <div className="mt-3 flex justify-end gap-1">
                              <button type="button" title="Move up" onClick={() => moveBlock(absoluteIndex, -1)} className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30" disabled={absoluteIndex === 0}><ArrowUp className="h-4 w-4" /></button>
                              <button type="button" title="Move down" onClick={() => moveBlock(absoluteIndex, 1)} className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30" disabled={absoluteIndex === blocks.length - 1}><ArrowDown className="h-4 w-4" /></button>
                              <button type="button" title="Edit" onClick={() => editBlock(absoluteIndex)} className="rounded-lg p-1.5 text-indigo-700 hover:bg-indigo-100"><Pencil className="h-4 w-4" /></button>
                              <button type="button" title="Regenerate" onClick={() => regenerateBlock(absoluteIndex)} className="rounded-lg p-1.5 text-amber-800 hover:bg-amber-100"><RefreshCw className="h-4 w-4" /></button>
                              <button type="button" title="Remove" onClick={() => deleteBlock(absoluteIndex)} className="rounded-lg p-1.5 text-red-700 hover:bg-red-50 disabled:opacity-30" disabled={blocks.length <= 1}><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </li>
                        )})}
                      </ul>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Settings summary */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-violet-50/60 to-white px-6 py-4">
              <Settings2 className="h-4 w-4 text-violet-500" />
              <h3 className="font-semibold text-gray-900">Settings</h3>
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
                <dt className="text-gray-500">Answer key</dt>
                <dd className="text-gray-800">{showAnswerKey ? 'Included (teacher copy)' : 'Hidden'}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-gray-500">Instructions header</dt>
                <dd className="text-gray-800">{includeInstructions ? 'Shown' : 'Hidden'}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-gray-500">Question order</dt>
                <dd className="text-gray-800">{randomiseOrder ? 'Randomised' : 'Fixed'}</dd>
              </div>
              {format === 'printable_pdf' && (
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-gray-500">Line spacing</dt>
                  <dd className="text-gray-800">
                    {LINE_SPACING_OPTIONS.find((o) => o.value === lineSpacing)?.label ?? lineSpacing}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Classes summary */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50/60 to-white px-6 py-4">
              <Users className="h-4 w-4 text-emerald-500" />
              <h3 className="font-semibold text-gray-900">Shared with</h3>
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
            <button type="button" onClick={regenerate} className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-900 hover:bg-indigo-100"><Sparkles className="h-4 w-4" />Regenerate all</button>
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
                {publishPending ? 'Publishing…' : isEdit ? 'Save changes' : 'Publish worksheet'}
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
        <p className="py-3 text-sm text-gray-600">You changed content sources. Leave without publishing?</p>
      </CustomModal>

      <CustomModal
        open={previewOpen}
        close={() => setPreviewOpen(false)}
        title="Worksheet preview"
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
          <p className="font-semibold text-gray-900">{title || 'Untitled worksheet'}</p>
          <p className="mt-1 text-xs text-gray-500">{subject} · {grade} · {format === 'printable_pdf' ? 'Printable PDF' : 'Interactive'}</p>
          <ol className="mt-4 list-decimal pl-5">
            {blocks.map((b, i) => (
              <li key={i} style={{ marginBottom: draftLayout.questionGapPx }}>
                {'prompt' in b ? b.prompt : `${b.left.join(', ')} -> ${b.right.join(', ')}`}
              </li>
            ))}
          </ol>
        </div>
        </div>
      </CustomModal>

      <CustomModal
        open={editingBlockIndex !== null}
        close={() => setEditingBlockIndex(null)}
        title="Edit question content"
        primaryButtonText="Save"
        handleSave={() => {
          if (editingBlockIndex === null) return
          setBlocks((prev) =>
            prev.map((b, i) => {
              if (i !== editingBlockIndex) return b
              if ('prompt' in b) return { ...b, prompt: editingBlockValue }
              return { ...b, left: [editingBlockValue], right: ['Sample match'] }
            })
          )
          setEditingBlockIndex(null)
        }}
      >
        <textarea
          rows={4}
          value={editingBlockValue}
          onChange={(e) => setEditingBlockValue(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
        />
      </CustomModal>

      <CustomModal
        open={addingBlockOpen}
        close={() => setAddingBlockOpen(false)}
        title="Add question"
        primaryButtonText="Add question"
        handleSave={() => {
          if (!addingBlockValue.trim()) return
          setBlocks((prev) => [...prev, { type: 'short', prompt: addingBlockValue.trim(), answer: '' }])
          setAddingBlockOpen(false)
        }}
      >
        <textarea
          rows={4}
          value={addingBlockValue}
          onChange={(e) => setAddingBlockValue(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
        />
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
          ← Back to worksheet list
        </button>
      </div>
    </div>
  )
}
