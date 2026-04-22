import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsWizardStepper, ContentSourcesPanel, Phase2Badge } from '../components'
import { useContentSourcesForm } from '../hooks/useContentSourcesForm'
import { demoClasses } from '../demo/teacherToolsDemoData'
import { formatSourceSummary, generateExamSectionStubs } from '../demo/generationFromSources'
import type { ExamSectionStub } from '../demo/generationFromSources'
import { GRADES, SUBJECTS } from '../types'
import { newDemoId } from '../demo/newDemoId'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'

const steps = ['Basics & sources', 'Sections', 'Rules', 'Schedule', 'Preview']

function classKeyForGrade(grade: string) {
  return demoClasses.find((c) => c.grade === grade)?.key ?? demoClasses[0]?.key ?? 'g8c'
}

function minutesBetween(isoStart: string, isoEnd: string) {
  const a = new Date(isoStart).getTime()
  const b = new Date(isoEnd).getTime()
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return 60
  return Math.round((b - a) / 60000)
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
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('Summative exam')
  const [examType, setExamType] = useState('Unit test')
  const [term, setTerm] = useState('Term 2')
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [subject, setSubject] = useState<string>(SUBJECTS[2])
  const [grade, setGrade] = useState<string>(GRADES[2])
  const [discardOpen, setDiscardOpen] = useState(false)
  const [hydrateReady, setHydrateReady] = useState(!isEdit)
  const [publishPending, setPublishPending] = useState(false)
  const [completionMeta, setCompletionMeta] = useState({ completionPct: 0 })
  /** When editing, anchor schedule to the loaded exam start (duration still editable). */
  const [scheduleStartIso, setScheduleStartIso] = useState<string | null>(null)
  const [loadedTopic, setLoadedTopic] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!isEdit) setScheduleStartIso(null)
  }, [isEdit])

  const sources = useContentSourcesForm({
    subject,
    grade,
    initialTopic: loadedTopic,
  })

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

  const sections: ExamSectionStub[] = useMemo(
    () => generateExamSectionStubs(sources.getGenerationContext()),
    [sources.generationSignature, sources.getGenerationContext] // eslint-disable-line react-hooks/exhaustive-deps
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
      setCompletionMeta({ completionPct: ex.completionPct })
      setHydrateReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [api, examId, isEdit, navigate, toast])

  const goList = () => navigate('/teacher-tools/exams')

  if (isEdit && !hydrateReady) {
    return (
      <div className="space-y-4 p-8 text-sm text-gray-600">
        <p>Loading exam…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={isEdit ? 'Edit exam' : 'Create exam'}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Exams', to: '/teacher-tools/exams' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
      />
      <TeacherToolsWizardStepper steps={steps} current={step} onStepClick={setStep} />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700 shadow-sm space-y-3">
        {step === 0 && (
          <div className="space-y-6">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block font-medium text-gray-900">
                Exam title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
              <label className="block font-medium text-gray-900">
                Exam type
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                >
                  <option>Midterm</option>
                  <option>Final</option>
                  <option>Unit test</option>
                  <option>Mock</option>
                </select>
              </label>
              <label className="block font-medium text-gray-900">
                Term
                <input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
              <label className="block font-medium text-gray-900">
                Duration (minutes)
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value) || 45)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
              <label className="block">
                Subject
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                Grade
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <ContentSourcesPanel subject={subject} grade={grade} model={sources} />
          </div>
        )}
        {step === 1 && (
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">Section blueprint</p>
            <ul className="space-y-2">
              {sections.map((s) => (
                <li key={s.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-xs text-gray-600">{s.description}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-500">{s.marks} marks</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-2 md:grid-cols-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Controlled mode
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Randomization
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Require webcam (preview)
            </label>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-2">
            <p>
              Start {schedule.start.slice(0, 16).replace('T', ' ')} · End {schedule.end.slice(0, 16).replace('T', ' ')} (from
              duration).
            </p>
            <p className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <Phase2Badge /> Room codes, seating, and calendar holds sync with your school roster in Phase 2.
            </p>
          </div>
        )}
        {step === 4 && (
          <div>
            <p>Student preview and proctoring summary (preview).</p>
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
        <p className="py-3 text-sm text-gray-600">You changed content sources. Leave without scheduling?</p>
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
            const secs = generateExamSectionStubs(ctx)
            const totalMarks = secs.reduce((a, s) => a + s.marks, 0)
            const payload = {
              title,
              subject,
              grade,
              term,
              classes: [classKeyForGrade(grade)],
              examType,
              durationMinutes,
              totalMarks,
              scheduleStart: schedule.start,
              scheduleEnd: schedule.end,
              status: 'scheduled' as const,
              completionPct: isEdit ? completionMeta.completionPct : 0,
              sourceSummary: formatSourceSummary(ctx),
            }
            setPublishPending(true)
            try {
              if (isEdit && examId) {
                const res = await api.updateExam(examId, payload)
                if (!res.ok) {
                  if (res.error === 'READ_ONLY') {
                    toast.error('Sample library items cannot be edited. Duplicate from the list first.')
                  } else {
                    toast.error('Could not save exam')
                  }
                  return
                }
                toast.success('Exam updated')
              } else {
                await api.createExam({
                  id: newDemoId('exam'),
                  ...payload,
                })
                toast.success('Exam scheduled')
              }
              goList()
            } finally {
              setPublishPending(false)
            }
          }}
        >
          {publishPending ? 'Saving…' : isEdit ? 'Save changes' : 'Schedule'}
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          if (sources.isDirty) setDiscardOpen(true)
          else goList()
        }}
        className="text-sm font-semibold text-primary-600"
      >
        ← Back to list
      </button>
    </div>
  )
}
