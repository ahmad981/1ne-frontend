import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsWizardStepper, ContentSourcesPanel, Phase2Section } from '../components'
import { useContentSourcesForm } from '../hooks/useContentSourcesForm'
import { demoClasses } from '../demo/teacherToolsDemoData'
import { formatSourceSummary, generateAssignmentBrief } from '../demo/generationFromSources'
import { GRADES, SUBJECTS } from '../types'
import { newDemoId } from '../demo/newDemoId'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'

const steps = ['Basics & sources', 'Content', 'Submission', 'Assign', 'Preview']

function classKeyForGrade(grade: string) {
  return demoClasses.find((c) => c.grade === grade)?.key ?? demoClasses[0]?.key ?? 'g8c'
}

function dueDateIso(daysAhead: number) {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toISOString().slice(0, 10)
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
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('Research brief')
  const [subject, setSubject] = useState<string>(SUBJECTS[1])
  const [grade, setGrade] = useState<string>(GRADES[0])
  const [assignmentType, setAssignmentType] = useState('Structured response')
  const [dueAt, setDueAt] = useState(dueDateIso(14))
  const [counts, setCounts] = useState({ assignedCount: 0, submitted: 0, pending: 0, graded: 0 })
  const [discardOpen, setDiscardOpen] = useState(false)
  const [loadedTopic, setLoadedTopic] = useState<string | undefined>(undefined)
  const [hydrateReady, setHydrateReady] = useState(!isEdit)
  const [publishPending, setPublishPending] = useState(false)

  const sources = useContentSourcesForm({
    subject,
    grade,
    initialTopic: loadedTopic,
  })

  const brief = useMemo(
    () => generateAssignmentBrief(sources.getGenerationContext()),
    [sources.generationSignature, sources.getGenerationContext] // eslint-disable-line react-hooks/exhaustive-deps
  )

  useEffect(() => {
    if (isEdit) return
    const titleParam = searchParams.get('title')
    if (titleParam) setTitle(titleParam)
    const sub = searchParams.get('subject')
    if (sub && SUBJECTS.includes(sub)) setSubject(sub)
    const gr = searchParams.get('grade')
    if (gr && GRADES.includes(gr)) setGrade(gr)
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
      setCounts({
        assignedCount: a.assignedCount,
        submitted: a.submitted,
        pending: a.pending,
        graded: a.graded,
      })
      setHydrateReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [api, assignmentId, isEdit, navigate, toast])

  const goList = () => navigate('/teacher-tools/assignment')

  if (isEdit && !hydrateReady) {
    return (
      <div className="space-y-4 p-8 text-sm text-gray-600">
        <p>Loading assignment…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={isEdit ? 'Edit assignment' : 'Create assignment'}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Assignment', to: '/teacher-tools/assignment' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
      />
      <TeacherToolsWizardStepper steps={steps} current={step} onStepClick={setStep} />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-sm text-gray-700">
        {step === 0 && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block font-medium text-gray-700">
                Title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
              <label className="block font-medium text-gray-700">
                Type
                <input
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
              <label className="block font-medium text-gray-700">
                Due date
                <input
                  type="date"
                  value={dueAt.length >= 10 ? dueAt.slice(0, 10) : dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block font-medium text-gray-700">
                  Subject
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block font-medium text-gray-700">
                  Grade
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <ContentSourcesPanel subject={subject} grade={grade} model={sources} />
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <p className="font-semibold text-gray-900">Brief and rubric hints</p>
            <ul className="list-disc space-y-1 pl-5 text-gray-600">
              {brief.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        )}
        {step === 2 && <p>File types, maximum size, late policy, and grading type (preview).</p>}
        {step === 3 && (
          <Phase2Section title="Assign to classes">
            <p className="text-sm text-gray-700">Pick classes, groups, and release rules.</p>
            <p className="mt-2 text-sm text-gray-600">Per-student messaging and LMS hand-off appear in Phase 2.</p>
          </Phase2Section>
        )}
        {step === 4 && (
          <div>
            <p>Student-facing preview (preview).</p>
            <p className="mt-2 text-xs text-gray-500">Sources: {formatSourceSummary(sources.getGenerationContext())}</p>
          </div>
        )}
      </div>

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

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
        >
          Back
        </button>
        <button
          type="button"
          className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
        >
          Next
        </button>
        <button type="button" className="rounded-full border px-4 py-2 text-sm" onClick={() => toast.success('Draft saved')}>
          Save draft
        </button>
        <button
          type="button"
          disabled={publishPending}
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          onClick={async () => {
            const ctx = sources.getGenerationContext()
            const payload = {
              title,
              subject,
              grade,
              classes: [classKeyForGrade(grade)],
              type: assignmentType,
              dueAt,
              assignedCount: isEdit ? counts.assignedCount : 0,
              submitted: isEdit ? counts.submitted : 0,
              pending: isEdit ? counts.pending : 0,
              graded: isEdit ? counts.graded : 0,
              status: 'active' as const,
              topic: sources.combinedTopicLabel,
              sourceSummary: formatSourceSummary(ctx),
            }
            setPublishPending(true)
            try {
              if (isEdit && assignmentId) {
                const res = await api.updateAssignment(assignmentId, payload)
                if (!res.ok) {
                  if (res.error === 'READ_ONLY') {
                    toast.error('Sample library items cannot be edited. Duplicate from the list first.')
                  } else {
                    toast.error('Could not save assignment')
                  }
                  return
                }
                toast.success('Assignment updated')
              } else {
                await api.createAssignment({
                  id: newDemoId('asg'),
                  ...payload,
                })
                toast.success('Assignment published')
              }
              goList()
            } finally {
              setPublishPending(false)
            }
          }}
        >
          {publishPending ? 'Saving…' : isEdit ? 'Save changes' : 'Publish'}
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          if (sources.isDirty) setDiscardOpen(true)
          else goList()
        }}
        className="text-sm text-primary-600 font-semibold"
      >
        ← Back to list
      </button>
    </div>
  )
}
