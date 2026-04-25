import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsWizardStepper, ContentSourcesPanel, Phase2Section } from '../components'
import { useContentSourcesForm } from '../hooks/useContentSourcesForm'
import { demoClasses } from '../demo/teacherToolsDemoData'
import { formatSourceSummary, generateAssignmentBrief } from '../demo/generationFromSources'
import { GRADES, SUBJECTS } from '../types'
import { newDemoId } from '../demo/newDemoId'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
import type { DemoQuiz } from '../demo/teacherToolsDemoData'
import { downloadQuizPdf } from '../utils/generateQuizPdf'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'
import { AlertCircle, ArrowDown, ArrowUp, CheckSquare, Download, Eye, FileJson, FileText, Pencil, PlusCircle, RefreshCw, Sparkles, Trash2, Users } from 'lucide-react'
import { QuizGeneratingOverlay } from '../quiz/components/QuizGeneratingOverlay'
import {
  DEFAULT_HANDOUT_LAYOUT,
  LINE_HEIGHT_PRESETS,
  QUESTION_GAP_PRESETS,
  RULED_LINE_SPACING_PRESETS,
  type HandoutLayoutOpts,
} from '../quiz/config/handoutLayoutConfig'

const BUILD_STEPS = ['Configure & generate', 'Review & publish']

const ASSIGNMENT_TYPES = [
  'Essay', 'Lab report', 'Problem set', 'Short essay', 'Structured response',
  'Narrative', 'Field journal', 'Comparative essay', 'Brief', 'Reflection',
  'Summary', 'Worksheet upload', 'Research report',
]

const LATE_POLICIES = [
  { value: 'none', label: 'No late submissions' },
  { value: '24h', label: 'Accept up to 24 hours late (no penalty)' },
  { value: '24h_penalty', label: 'Accept up to 24 hours late (10% deduction)' },
  { value: '1week', label: 'Accept up to 1 week late (20% deduction)' },
  { value: 'always', label: 'Always accept late (teacher discretion)' },
]

const RUBRIC_CRITERIA = [
  'Content accuracy',
  'Depth of analysis',
  'Structure & organisation',
  'Evidence & citations',
  'Language & expression',
  'Original thinking',
]

function classKeyForGrade(grade: string) {
  return demoClasses.find((c) => c.grade === grade)?.key ?? demoClasses[0]?.key ?? 'g8c'
}

function dueDateIso(daysAhead: number) {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toISOString().slice(0, 10)
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

export default function AssignmentCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const templateToastRef = useRef(false)
  const { assignmentId } = useParams<{ assignmentId?: string }>()
  const isEdit = location.pathname.endsWith('/edit')
  const { toast } = useSnackbar()
  const { api } = useTeacherToolsDemo()

  const [phase, setPhase] = useState<'build' | 'review'>(isEdit ? 'review' : 'build')
  const [generating, setGenerating] = useState(false)
  const [genProgress, setGenProgress] = useState(0.15)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [buildErrors, setBuildErrors] = useState<string[]>([])
  const [generatedBrief, setGeneratedBrief] = useState<string[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [handoutLayout, setHandoutLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)
  const [draftLayout, setDraftLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)

  const [title, setTitle] = useState('Research brief')
  const [subject, setSubject] = useState<string>(SUBJECTS[1])
  const [grade, setGrade] = useState<string>(GRADES[0])
  const [assignmentType, setAssignmentType] = useState('Structured response')
  const [dueAt, setDueAt] = useState(dueDateIso(14))
  const [studentInstructions, setStudentInstructions] = useState(
    'Submit your work as a single document. Cite all sources using the format shown in class.'
  )
  const [academicRigor, setAcademicRigor] = useState<'Foundation' | 'Standard' | 'Advanced' | 'International Honors'>('Standard')
  const [briefLineTarget, setBriefLineTarget] = useState(8)

  const [maxFileSizeMb, setMaxFileSizeMb] = useState(10)
  const [latePolicy, setLatePolicy] = useState('24h')
  const [allowPdf, setAllowPdf] = useState(true)
  const [allowDoc, setAllowDoc] = useState(true)
  const [allowImage, setAllowImage] = useState(false)
  const [allowText, setAllowText] = useState(true)

  const [activeCriteria, setActiveCriteria] = useState<Set<string>>(new Set(RUBRIC_CRITERIA))
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [counts, setCounts] = useState({ assignedCount: 0, submitted: 0, pending: 0, graded: 0 })
  const [discardOpen, setDiscardOpen] = useState(false)
  const [loadedTopic, setLoadedTopic] = useState<string | undefined>(undefined)
  const [hydrateReady, setHydrateReady] = useState(!isEdit)
  const [publishPending, setPublishPending] = useState(false)
  const [saveDraftPending, setSaveDraftPending] = useState(false)
  const [editingLineIndex, setEditingLineIndex] = useState<number | null>(null)
  const [editingLineValue, setEditingLineValue] = useState('')
  const [addingLineOpen, setAddingLineOpen] = useState(false)
  const [addingLineValue, setAddingLineValue] = useState('')

  const sources = useContentSourcesForm({ subject, grade, initialTopic: loadedTopic })

  const briefSeed = useMemo(
    () => generateAssignmentBrief(sources.getGenerationContext()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sources.generationSignature, sources.getGenerationContext]
  )

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
      setLoadedTopic(a.topic)
      setSelectedClasses(a.classes ?? [])
      setCounts({ assignedCount: a.assignedCount, submitted: a.submitted, pending: a.pending, graded: a.graded })
      setHydrateReady(true)
    })()
    return () => { cancelled = true }
  }, [api, assignmentId, isEdit, navigate, toast])

  const toggleClass = (key: string) => {
    setSelectedClasses((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const toggleCriterion = (c: string) => {
    setActiveCriteria((prev) => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      return next
    })
  }

  const runGeneration = () => {
    const errs: string[] = []
    if (!title.trim()) errs.push('Assignment title is required.')
    if (buildErrors.length > 0 && !title.trim()) errs.push('Select at least one topic or enter a scope refinement.')
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
        const generated = generateAssignmentBrief(sources.getGenerationContext())
        const enriched = [...generated]
        while (enriched.length < briefLineTarget) {
          enriched.push(
            academicRigor === 'International Honors'
              ? 'Add international benchmark comparison, academic integrity notes, and explicit evaluation descriptors.'
              : academicRigor === 'Advanced'
              ? 'Require analytical evidence, comparative reasoning, and structured reflection checkpoints.'
              : 'Include clear success criteria, examples, and scaffolded guidance for student completion.'
          )
        }
        setGeneratedBrief(enriched.slice(0, briefLineTarget))
        setPhase('review')
        toast.success('Brief generated — review below.')
      } catch {
        setGenerationError('Generation failed (demo). Please retry with updated inputs.')
        toast.error('Could not generate assignment brief.')
      } finally {
        window.clearInterval(steps)
        setGenerating(false)
        setGenProgress(1)
      }
    }, 1200 + Math.random() * 800)
  }

  const editBriefLine = (index: number) => {
    const current = (generatedBrief.length > 0 ? generatedBrief : briefSeed)[index] ?? ''
    setEditingLineIndex(index)
    setEditingLineValue(current)
  }

  const addBriefLine = () => {
    setAddingLineOpen(true)
    setAddingLineValue('')
  }

  const regenerateBrief = () => {
    const regenerated = generateAssignmentBrief(sources.getGenerationContext())
    setGeneratedBrief(regenerated.slice(0, briefLineTarget))
    toast.success('Brief regenerated from current sources')
  }

  const regenerateBriefLine = (index: number) => {
    const regenerated = generateAssignmentBrief(sources.getGenerationContext())
    const nextLine = regenerated[index] ?? regenerated[0]
    if (!nextLine) return
    setGeneratedBrief((prev) => prev.map((line, i) => (i === index ? nextLine : line)))
    toast.success('Line regenerated')
  }

  const deleteBriefLine = (index: number) => {
    setGeneratedBrief((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
    toast.success('Line removed')
  }

  const moveBriefLine = (index: number, direction: -1 | 1) => {
    setGeneratedBrief((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      const [line] = next.splice(index, 1)
      next.splice(target, 0, line)
      return next
    })
  }

  const exportPdf = () => {
    const lines = generatedBrief.length > 0 ? generatedBrief : briefSeed
    const stubs = lines.map((line, i) => ({
      id: `asg-${i + 1}`,
      type: 'short' as const,
      prompt: line,
      points: 2,
      responseLines: 3,
    }))
    const payload: DemoQuiz = {
      id: isEdit && assignmentId ? assignmentId : newDemoId('asg-preview'),
      title: `${title || 'Assignment'} — Brief`,
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
      studentInstructions,
      handoutLayout,
    }
    downloadQuizPdf(payload, `${(title || 'assignment').replace(/\s+/g, '-').slice(0, 32)}-assignment-brief.pdf`)
    toast.success('PDF downloaded')
  }

  const buildPayload = (status: 'draft' | 'active') => {
    const ctx = sources.getGenerationContext()
    const classes = selectedClasses.length > 0 ? selectedClasses : [classKeyForGrade(grade)]
    return {
      title: title.trim() || 'Untitled assignment',
      subject,
      grade,
      classes,
      type: assignmentType,
      dueAt,
      assignedCount: isEdit ? counts.assignedCount : 0,
      submitted: isEdit ? counts.submitted : 0,
      pending: isEdit ? counts.pending : 0,
      graded: isEdit ? counts.graded : 0,
      status,
      topic: sources.combinedTopicLabel,
      sourceSummary: formatSourceSummary(ctx),
    }
  }

  const handleSaveDraft = async () => {
    if ((generatedBrief.length > 0 ? generatedBrief : briefSeed).length === 0) {
      toast.error('Generate at least one brief line before saving a draft.')
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
  }

  const handlePublish = async () => {
    if ((generatedBrief.length > 0 ? generatedBrief : briefSeed).length === 0) {
      toast.error('Generate at least one brief line before publishing.')
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
  }

  const goList = () => navigate('/teacher-tools/assignment')

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
  const acceptedTypes = [allowPdf && 'PDF', allowDoc && 'Word', allowImage && 'Images', allowText && 'Plain text']
    .filter(Boolean).join(', ') || 'None selected'
  const latePolicyLabel = LATE_POLICIES.find((p) => p.value === latePolicy)?.label ?? latePolicy
  const assignedClasses = demoClasses.filter((c) =>
    selectedClasses.length > 0 ? selectedClasses.includes(c.key) : c.grade === grade
  )

  return (
    <div className="space-y-6 pb-10">
      <TeacherToolsPageHeader
        title={isEdit ? 'Edit assignment' : 'Create assignment'}
        subtitle="Configure the brief and submission rules, generate, then review and publish."
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Assignment', to: '/teacher-tools/assignment' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
      />

      <TeacherToolsWizardStepper
        steps={BUILD_STEPS}
        current={wizardStep}
        onStepClick={(i) => {
          if (i === 1 && phase === 'build') {
            toast.error('Generate the brief first to open review.')
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
          {/* Step 1 — Basics */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-white px-6 py-5">
              <StepHeader
                step={1}
                kicker="Assignment identity"
                title="Basics"
                subtitle="Name the assignment, set the type, grade, and due date. Subject and grade tune content generation."
              />
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <label className="md:col-span-2 block text-sm font-medium text-gray-800">
                Title <span className="text-red-500">*</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Comparative essay — Enlightenment thinkers (Grade 9)"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Assignment type
                <select
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  {ASSIGNMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Due date
                <input
                  type="date"
                  value={dueAt.length >= 10 ? dueAt.slice(0, 10) : dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
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
                International rigor profile
                <select
                  value={academicRigor}
                  onChange={(e) => setAcademicRigor(e.target.value as typeof academicRigor)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="Foundation">Foundation</option>
                  <option value="Standard">Standard</option>
                  <option value="Advanced">Advanced</option>
                  <option value="International Honors">International Honors</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Generated brief depth (lines)
                <input
                  type="number"
                  min={5}
                  max={20}
                  value={briefLineTarget}
                  onChange={(e) => setBriefLineTarget(Math.min(20, Math.max(5, Number(e.target.value) || 8)))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </label>
              <label className="md:col-span-2 block text-sm font-medium text-gray-800">
                Student-facing instructions
                <textarea
                  rows={2}
                  value={studentInstructions}
                  onChange={(e) => setStudentInstructions(e.target.value)}
                  placeholder="Submit your work as a single document..."
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
                <span className="mt-1 block text-xs text-gray-500">Shown to students after you publish.</span>
              </label>
            </div>
          </section>

          {/* Step 2 — Source materials */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-white px-6 py-5">
              <StepHeader
                step={2}
                kicker="Content scope"
                title="Source materials"
                subtitle="Select the catalog books and topic strands the brief should draw from."
              />
            </div>
            <div className="p-6">
              <ContentSourcesPanel subject={subject} grade={grade} model={sources} />
            </div>
          </section>

          {/* Step 3 — Submission rules */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50/60 to-white px-6 py-5">
              <StepHeader
                step={3}
                kicker="Submission rules"
                title="File types & late policy"
                subtitle="Control which formats students can submit and how late submissions are handled."
              />
            </div>
            <div className="space-y-5 p-6">
              <div>
                <p className="text-sm font-medium text-gray-800">Accepted file types</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { label: 'PDF', checked: allowPdf, toggle: () => setAllowPdf((v) => !v) },
                    { label: 'Word (.doc/.docx)', checked: allowDoc, toggle: () => setAllowDoc((v) => !v) },
                    { label: 'Images (PNG/JPG)', checked: allowImage, toggle: () => setAllowImage((v) => !v) },
                    { label: 'Plain text', checked: allowText, toggle: () => setAllowText((v) => !v) },
                  ].map(({ label, checked, toggle }) => (
                    <label key={label} className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 hover:bg-gray-100">
                      <input type="checkbox" checked={checked} onChange={toggle} className="rounded" />
                      <span className="text-xs font-medium text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <label className="block text-sm font-medium text-gray-800">
                Max file size (MB)
                <input
                  type="number"
                  value={maxFileSizeMb}
                  min={1}
                  max={500}
                  onChange={(e) => setMaxFileSizeMb(Number(e.target.value) || 10)}
                  className="mt-1.5 w-32 rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </label>
              <div>
                <p className="text-sm font-medium text-gray-800">Late submission policy</p>
                <div className="mt-2 space-y-2">
                  {LATE_POLICIES.map(({ value, label }) => (
                    <label key={value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 hover:bg-gray-100">
                      <input
                        type="radio"
                        name="late_policy"
                        value={value}
                        checked={latePolicy === value}
                        onChange={() => setLatePolicy(value)}
                        className="text-indigo-600"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Step 4 — Assign to classes */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50/60 to-white px-6 py-5">
              <StepHeader
                step={4}
                kicker="Student cohort"
                title="Assign to classes"
                subtitle="Select which classes receive this assignment. Enrolled students are notified on publish."
              />
            </div>
            <div className="space-y-4 p-6">
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
              <Phase2Section title="Per-student controls">
                <p className="text-sm text-gray-700">
                  Differentiated release dates, individual extensions, and group-based access unlock in Phase 2.
                </p>
              </Phase2Section>
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
              <p className="text-sm font-semibold text-gray-900">Ready to generate the assignment brief</p>
              <p className="mt-0.5 text-xs text-gray-600">
                Produces a structured brief and rubric criteria from the selected topic and sources above.
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
                'Generate brief'
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
              <h2 className="mt-1 text-lg font-semibold text-gray-900">Generated assignment brief</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-600">
                Edit prompts, reorder, or regenerate items. When you publish, this snapshot is stored for students and exports.
              </p>
              <p className="mt-2 text-xs text-gray-500">{formatSourceSummary(sources.getGenerationContext())}</p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-semibold text-gray-900">{(generatedBrief.length > 0 ? generatedBrief : briefSeed).length}</p>
                  <p className="text-xs text-gray-500">Brief lines</p>
                </div>
                <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-semibold text-gray-900">{activeCriteria.size}</p>
                  <p className="text-xs text-gray-500">Rubric criteria</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDraftLayout(handoutLayout)
                    setPreviewOpen(true)
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-900 shadow-sm hover:bg-indigo-50"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Print preview
                </button>
                <button
                  type="button"
                  onClick={addBriefLine}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-900 shadow-sm hover:bg-emerald-50"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add line manually
                </button>
              </div>
            </div>
          </div>

          {/* Generated brief */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50/60 to-white px-6 py-4">
              <FileText className="h-4 w-4 text-indigo-500" />
              <h3 className="font-semibold text-gray-900">Assignment brief</h3>
              <span className="ml-auto text-xs text-gray-400">
                {formatSourceSummary(sources.getGenerationContext())}
              </span>
              <button
                type="button"
                onClick={regenerateBrief}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Regenerate
              </button>
              <button
                type="button"
                onClick={addBriefLine}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Add line
              </button>
            </div>
            <ul className="space-y-2 p-6">
              {(generatedBrief.length > 0 ? generatedBrief : briefSeed).map((line, i) => (
                <li key={i} className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="flex-1">{line}</span>
                  <div className="ml-auto flex shrink-0 items-center gap-1">
                    <button type="button" title="Move up" onClick={() => moveBriefLine(i, -1)} className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30" disabled={i === 0}><ArrowUp className="h-4 w-4" /></button>
                    <button type="button" title="Move down" onClick={() => moveBriefLine(i, 1)} className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30" disabled={i === (generatedBrief.length > 0 ? generatedBrief : briefSeed).length - 1}><ArrowDown className="h-4 w-4" /></button>
                    <button type="button" title="Edit" onClick={() => editBriefLine(i)} className="rounded-lg p-1.5 text-indigo-700 hover:bg-indigo-100"><Pencil className="h-4 w-4" /></button>
                    <button type="button" title="Regenerate line" onClick={() => regenerateBriefLine(i)} className="rounded-lg p-1.5 text-amber-800 hover:bg-amber-100"><RefreshCw className="h-4 w-4" /></button>
                    <button type="button" title="Remove" onClick={() => deleteBriefLine(i)} className="rounded-lg p-1.5 text-red-700 hover:bg-red-50 disabled:opacity-30" disabled={(generatedBrief.length > 0 ? generatedBrief : briefSeed).length <= 1}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

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
              onClick={regenerateBrief}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-900 hover:bg-indigo-100"
            >
              <Sparkles className="h-4 w-4" />
              Regenerate all
            </button>
          </div>

          {/* Rubric criteria */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-violet-50/60 to-white px-6 py-4">
              <CheckSquare className="h-4 w-4 text-violet-500" />
              <h3 className="font-semibold text-gray-900">Rubric criteria</h3>
              <span className="ml-auto text-xs text-gray-500">
                {activeCriteria.size} of {RUBRIC_CRITERIA.length} active
              </span>
            </div>
            <div className="space-y-2 p-6">
              {RUBRIC_CRITERIA.map((c) => (
                <label
                  key={c}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
                    activeCriteria.has(c)
                      ? 'border-violet-200 bg-violet-50'
                      : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={activeCriteria.has(c)}
                    onChange={() => toggleCriterion(c)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-800">{c}</span>
                </label>
              ))}
              <p className="pt-1 text-xs text-gray-400">Phase 2 adds custom weighting per criterion.</p>
            </div>
          </section>

          {/* Submission rules summary */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-amber-50/60 to-white px-6 py-4">
              <FileText className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold text-gray-900">Submission rules</h3>
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
                <dt className="text-gray-500">File types</dt>
                <dd className="text-gray-800">{acceptedTypes}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-gray-500">Max size</dt>
                <dd className="text-gray-800">{maxFileSizeMb} MB</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-gray-500">Late policy</dt>
                <dd className="text-right text-gray-800">{latePolicyLabel}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-2.5">
                <dt className="shrink-0 text-gray-500">Student instructions</dt>
                <dd className="text-right text-gray-800">{studentInstructions}</dd>
              </div>
            </dl>
          </section>

          {/* Classes summary */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50/60 to-white px-6 py-4">
              <Users className="h-4 w-4 text-emerald-500" />
              <h3 className="font-semibold text-gray-900">Assigned to</h3>
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

          {/* Publish panel */}
          <div className="sticky bottom-4 z-10 rounded-2xl border border-gray-200 bg-gray-50/95 p-5 shadow-lg backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Publish & export</p>
            <div className="flex flex-wrap gap-3">
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
                {publishPending ? 'Publishing…' : isEdit ? 'Save changes' : 'Publish assignment'}
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
        title="Assignment preview"
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
          <p className="font-semibold text-gray-900">{title || 'Untitled assignment'}</p>
          <p className="mt-1 text-xs text-gray-500">{subject} · {grade} · Due {dueAt}</p>
          <ul className="mt-4 list-decimal pl-5">
            {(generatedBrief.length > 0 ? generatedBrief : briefSeed).map((line, i) => (
              <li key={i} style={{ marginBottom: draftLayout.questionGapPx }}>{line}</li>
            ))}
          </ul>
        </div>
        </div>
      </CustomModal>

      <CustomModal
        open={editingLineIndex !== null}
        close={() => setEditingLineIndex(null)}
        title="Edit brief line"
        primaryButtonText="Save"
        handleSave={() => {
          if (editingLineIndex === null) return
          setGeneratedBrief((prev) => {
            const base = prev.length > 0 ? [...prev] : [...briefSeed]
            base[editingLineIndex] = editingLineValue
            return base
          })
          setEditingLineIndex(null)
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
        open={addingLineOpen}
        close={() => setAddingLineOpen(false)}
        title="Add brief line"
        primaryButtonText="Add line"
        handleSave={() => {
          if (!addingLineValue.trim()) return
          setGeneratedBrief((prev) => [...(prev.length > 0 ? prev : briefSeed), addingLineValue.trim()])
          setAddingLineOpen(false)
        }}
      >
        <textarea
          rows={4}
          value={addingLineValue}
          onChange={(e) => setAddingLineValue(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          placeholder="Write a new generated brief line..."
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
          ← Back to assignment list
        </button>
      </div>
    </div>
  )
}
