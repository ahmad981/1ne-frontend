import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsStatusBadge } from '../components'
import { TEACHER_TOOLS_SEED_EXAM_IDS } from '../demo/teacherToolsDemoData'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'

const tabs = ['Overview', 'Sections', 'Candidates', 'Results', 'Analytics', 'Settings'] as const

export default function ExamDetail() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const { toast } = useSnackbar()
  const { api, allExams } = useTeacherToolsDemo()
  const e = useMemo(() => allExams.find((x) => x.id === examId), [allExams, examId])
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview')

  const goEdit = async () => {
    if (!examId) return
    if (TEACHER_TOOLS_SEED_EXAM_IDS.has(examId)) {
      const r = await api.duplicateExam(examId)
      if (r.ok && 'id' in r && r.id) {
        toast.success('Created an editable copy from the sample library')
        navigate(`/teacher-tools/exams/${r.id}/edit`)
        return
      }
      toast.error('Could not create a copy')
      return
    }
    navigate(`/teacher-tools/exams/${examId}/edit`)
  }

  if (!e) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">Exam not found.</p>
        <Link to="/teacher-tools/exams" className="text-sm font-semibold text-primary-600">
          ← Back to exams
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={e.title}
        subtitle={`${e.subject} · ${e.examType} · ${e.term}`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Exams', to: '/teacher-tools/exams' },
          { label: e.title },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <TeacherToolsStatusBadge kind="content" value={e.status} />
            <button
              type="button"
              onClick={() => void goEdit()}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              Edit
            </button>
            <Link to={`/teacher-tools/exams/${e.id}/candidates`} className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
              Candidates
            </Link>
            <Link to={`/teacher-tools/exams/${e.id}/results`} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800">
              Results
            </Link>
          </div>
        }
      />
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${tab === t ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'Overview' && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-sm">
            <p className="font-semibold">Schedule</p>
            <p className="mt-2 text-gray-600">{e.scheduleStart} → {e.scheduleEnd}</p>
            {e.sourceSummary && <p className="mt-2 text-gray-600">Sources: {e.sourceSummary}</p>}
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-sm">
            <p className="font-semibold">Completion</p>
            <p className="mt-2 text-gray-600">{e.completionPct}%</p>
          </div>
        </div>
      )}
      {tab === 'Sections' && (
        <p className="text-sm text-gray-700">Section A (multiple choice, 40 marks), Section B (structured, 60 marks) — example layout.</p>
      )}
      {tab === 'Candidates' && <Link to={`/teacher-tools/exams/${e.id}/candidates`} className="text-primary-600 font-semibold">Open candidates →</Link>}
      {tab === 'Results' && <Link to={`/teacher-tools/exams/${e.id}/results`} className="text-primary-600 font-semibold">Open results →</Link>}
      {tab === 'Analytics' && <Link to={`/teacher-tools/exams/${e.id}/analytics`} className="text-primary-600 font-semibold">Open analytics →</Link>}
      {tab === 'Settings' && <p className="text-sm text-gray-600">Integrity and visibility (preview).</p>}
    </div>
  )
}
