import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsStatusBadge } from '../components'
import { TEACHER_TOOLS_SEED_ASSIGNMENT_IDS } from '../demo/teacherToolsDemoData'
import { getTopicBlueprint } from '../demo/topicAwareGenerators'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'

const tabs = ['Overview', 'Submissions', 'Rubric', 'Analytics', 'Settings'] as const

export default function AssignmentDetail() {
  const { assignmentId } = useParams()
  const navigate = useNavigate()
  const { toast } = useSnackbar()
  const { api, allAssignments } = useTeacherToolsDemo()
  const a = useMemo(() => allAssignments.find((x) => x.id === assignmentId), [allAssignments, assignmentId])
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview')

  const goEdit = async () => {
    if (!assignmentId) return
    if (TEACHER_TOOLS_SEED_ASSIGNMENT_IDS.has(assignmentId)) {
      const r = await api.duplicateAssignment(assignmentId)
      if (r.ok && 'id' in r && r.id) {
        toast.success('Created an editable copy from the sample library')
        navigate(`/teacher-tools/assignment/${r.id}/edit`)
        return
      }
      toast.error('Could not create a copy')
      return
    }
    navigate(`/teacher-tools/assignment/${assignmentId}/edit`)
  }

  if (!a) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">Assignment not found.</p>
        <Link to="/teacher-tools/assignment" className="text-sm font-semibold text-primary-600">
          ← Back to assignments
        </Link>
      </div>
    )
  }

  const bp = getTopicBlueprint(a.subject, a.topic)

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={a.title}
        subtitle={`${a.subject} · Due ${a.dueAt}`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Assignment', to: '/teacher-tools/assignment' },
          { label: a.title },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <TeacherToolsStatusBadge kind="content" value={a.status} />
            <button
              type="button"
              onClick={() => void goEdit()}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              Edit
            </button>
            <Link className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white" to={`/teacher-tools/assignment/${a.id}/submissions`}>
              Submissions
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
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-700 shadow-sm">
          <p className="font-semibold text-gray-900">Objective</p>
          <p className="mt-2">{bp.objective}</p>
          {a.sourceSummary && <p className="mt-2 text-gray-600">Sources: {a.sourceSummary}</p>}
          <p className="mt-4 font-semibold">Pending review: {a.pending}</p>
        </div>
      )}
      {tab === 'Rubric' && (
        <ul className="list-disc pl-6 text-sm text-gray-700">
          {bp.rubricHints.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}
      {tab === 'Submissions' && (
        <Link to={`/teacher-tools/assignment/${a.id}/submissions`} className="text-primary-600 font-semibold">
          Open submissions →
        </Link>
      )}
      {tab === 'Analytics' && (
        <Link to={`/teacher-tools/assignment/${a.id}/analytics`} className="text-primary-600 font-semibold">
          Open analytics →
        </Link>
      )}
      {tab === 'Settings' && <p className="text-sm text-gray-600">Visibility and moderation (preview).</p>}
    </div>
  )
}
