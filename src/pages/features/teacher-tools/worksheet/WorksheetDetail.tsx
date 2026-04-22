import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsStatusBadge } from '../components'
import { TEACHER_TOOLS_SEED_WORKSHEET_IDS } from '../demo/teacherToolsDemoData'
import { analyticsForTopic, getTopicBlueprint } from '../demo/topicAwareGenerators'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'

const tabs = ['Overview', 'Content', 'Responses', 'Analytics', 'Settings'] as const

export default function WorksheetDetail() {
  const { worksheetId } = useParams()
  const navigate = useNavigate()
  const { toast } = useSnackbar()
  const { api, allWorksheets } = useTeacherToolsDemo()
  const w = useMemo(() => allWorksheets.find((x) => x.id === worksheetId), [allWorksheets, worksheetId])
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview')

  const goEdit = async () => {
    if (!worksheetId) return
    if (TEACHER_TOOLS_SEED_WORKSHEET_IDS.has(worksheetId)) {
      const r = await api.duplicateWorksheet(worksheetId)
      if (r.ok && 'id' in r && r.id) {
        toast.success('Created an editable copy from the sample library')
        navigate(`/teacher-tools/worksheet/${r.id}/edit`)
        return
      }
      toast.error('Could not create a copy')
      return
    }
    navigate(`/teacher-tools/worksheet/${worksheetId}/edit`)
  }

  if (!w) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">Worksheet not found.</p>
        <Link to="/teacher-tools/worksheet" className="text-sm font-semibold text-primary-600">
          ← Back to worksheets
        </Link>
      </div>
    )
  }

  const bp = getTopicBlueprint(w.subject, w.topic)
  const an = analyticsForTopic(bp)

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={w.title}
        subtitle={`${w.subject} · ${w.topic}`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Worksheet', to: '/teacher-tools/worksheet' },
          { label: w.title },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <TeacherToolsStatusBadge kind="content" value={w.status} />
            <button
              type="button"
              onClick={() => void goEdit()}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              Edit
            </button>
            <Link to={`/teacher-tools/worksheet/${w.id}/responses`} className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
              Responses
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
          <p>{bp.objective}</p>
          {w.sourceSummary && <p className="mt-2 text-gray-600">Sources: {w.sourceSummary}</p>}
          <p className="mt-2">Estimated mastery (preview): {Math.round(an.masteryEstimate * 100)}%</p>
        </div>
      )}
      {tab === 'Content' && (
        <div className="space-y-2 text-sm">
          {bp.blocks.map((b, i) => (
            <div key={i} className="rounded-xl border p-3">{('prompt' in b && b.prompt) || b.type}</div>
          ))}
        </div>
      )}
      {tab === 'Responses' && <Link to={`/teacher-tools/worksheet/${w.id}/responses`} className="text-primary-600 font-semibold">Open responses →</Link>}
      {tab === 'Analytics' && <Link to={`/teacher-tools/worksheet/${w.id}/analytics`} className="text-primary-600 font-semibold">Open analytics →</Link>}
      {tab === 'Settings' && <p className="text-sm text-gray-600">Printable layout and digital options (preview).</p>}
    </div>
  )
}
