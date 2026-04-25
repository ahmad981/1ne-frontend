import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Calendar,
  ClipboardCheck,
  Layers,
  Plus,
  Sparkles,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import {
  CardGridSkeleton,
  ChartSkeleton,
  SimpleBarChart,
  TeacherToolsFilterBar,
  type FilterValues,
} from './components'
import { OVERVIEW_ACTIVITY_STATUS_OPTIONS } from './components/teacherToolsStatusFilterOptions'
import { useDemoAsync } from './hooks/useDemoAsync'
import {
  activityFeed,
  demoClasses,
  demoSubmissions,
  draftItems,
  overviewKpis,
  upcomingDeadlines,
} from './demo/teacherToolsDemoData'
import { unifiedToolPoints } from './utils/analyticsDemoSeries'
import { SUBJECTS } from './types'
import { useTeacherToolsDemo } from './TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../hooks/useSnackbar'

function dayInRange(day: string | undefined, from: string, to: string): boolean {
  if (!from && !to) return true
  if (!day) return true
  const d = day.slice(0, 10)
  if (from && d < from) return false
  if (to && d > to) return false
  return true
}

function draftEditPath(tool: string, id: string): string {
  switch (tool) {
    case 'Quiz':
      return `/teacher-tools/quiz/${id}/edit`
    case 'Worksheet':
      return `/teacher-tools/worksheet/${id}/edit`
    case 'Assignment':
      return `/teacher-tools/assignment/${id}/edit`
    case 'Exam':
      return `/teacher-tools/exams/${id}/edit`
    default:
      return '/teacher-tools'
  }
}

function submissionReviewPath(s: (typeof demoSubmissions)[number]): string {
  switch (s.toolType) {
    case 'quiz':
      return `/teacher-tools/quiz/${s.contentId}/submissions`
    case 'assignment':
      return `/teacher-tools/assignment/${s.contentId}/submissions`
    case 'worksheet':
      return `/teacher-tools/worksheet/${s.contentId}/responses`
    case 'exam':
      return `/teacher-tools/exams/${s.contentId}/candidates`
    default:
      return '/teacher-tools'
  }
}

export default function TeacherToolsOverview() {
  const { toast } = useSnackbar()
  const { allQuizzes, allAssignments, allWorksheets, allExams } = useTeacherToolsDemo()
  const [filters, setFilters] = useState<FilterValues>({
    q: '',
    subject: '',
    grade: '',
    classKey: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  })

  const loader = useMemo(
    () => async () => ({
      kpis: overviewKpis,
    }),
    []
  )

  const { state, data, error, retry } = useDemoAsync(loader, { delayMs: 500 })

  const toolChartPoints = useMemo(() => unifiedToolPoints(filters), [filters])

  const filteredFeed = useMemo(() => {
    return activityFeed.filter((a) => {
      if (filters.subject && a.subject !== filters.subject) return false
      if (filters.grade && a.grade !== filters.grade) return false
      if (filters.classKey && a.classKey !== filters.classKey) return false
      if (filters.status && a.type !== filters.status) return false
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (
          !a.text.toLowerCase().includes(q) &&
          !a.subject.toLowerCase().includes(q) &&
          !a.type.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      if (!dayInRange(a.activityDate, filters.dateFrom, filters.dateTo)) return false
      return true
    })
  }, [filters])

  const filteredDeadlines = useMemo(() => {
    return upcomingDeadlines.filter((d) => {
      if (filters.subject && d.subject !== filters.subject) return false
      if (filters.grade && d.grade !== filters.grade) return false
      if (filters.classKey && d.classKey !== filters.classKey) return false
      if (filters.q && !d.title.toLowerCase().includes(filters.q.toLowerCase())) return false
      if (!dayInRange(d.date, filters.dateFrom, filters.dateTo)) return false
      return true
    })
  }, [filters])

  const filteredDrafts = useMemo(() => {
    return draftItems.filter((d) => {
      if (filters.subject && d.subject !== filters.subject) return false
      if (filters.grade && d.grade !== filters.grade) return false
      if (filters.classKey && d.classKey !== filters.classKey) return false
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (!d.title.toLowerCase().includes(q) && !d.tool.toLowerCase().includes(q) && !d.subject.toLowerCase().includes(q)) {
          return false
        }
      }
      if (!dayInRange(d.updated, filters.dateFrom, filters.dateTo)) return false
      return true
    })
  }, [filters])

  const filteredHandins = useMemo(() => {
    return demoSubmissions.filter((s) => {
      const title =
        s.toolType === 'quiz'
          ? allQuizzes.find((q) => q.id === s.contentId)?.title
          : s.toolType === 'assignment'
            ? allAssignments.find((a) => a.id === s.contentId)?.title
            : s.toolType === 'worksheet'
              ? allWorksheets.find((w) => w.id === s.contentId)?.title
              : s.toolType === 'exam'
                ? allExams.find((e) => e.id === s.contentId)?.title
                : s.contentId
      const subj =
        s.toolType === 'quiz'
          ? allQuizzes.find((q) => q.id === s.contentId)?.subject
          : s.toolType === 'assignment'
            ? allAssignments.find((a) => a.id === s.contentId)?.subject
            : s.toolType === 'worksheet'
              ? allWorksheets.find((w) => w.id === s.contentId)?.subject
              : s.toolType === 'exam'
                ? allExams.find((e) => e.id === s.contentId)?.subject
                : undefined
      if (filters.subject && subj !== filters.subject) return false
      if (filters.classKey && s.classKey !== filters.classKey) return false
      if (filters.grade) {
        const g = demoClasses.find((c) => c.key === s.classKey)?.grade
        if (g !== filters.grade) return false
      }
      if (filters.q) {
        const q = filters.q.toLowerCase()
        const titleLc = (title ?? s.contentId).toLowerCase()
        if (!s.studentName.toLowerCase().includes(q) && !titleLc.includes(q) && !s.contentId.toLowerCase().includes(q)) {
          return false
        }
      }
      if (!dayInRange(s.submittedAt, filters.dateFrom, filters.dateTo)) return false
      return true
    })
  }, [filters, allQuizzes, allAssignments, allWorksheets, allExams])

  const handinTitle = (s: (typeof demoSubmissions)[number]) => {
    if (s.toolType === 'quiz') return allQuizzes.find((q) => q.id === s.contentId)?.title ?? s.contentId
    if (s.toolType === 'assignment') return allAssignments.find((a) => a.id === s.contentId)?.title ?? s.contentId
    if (s.toolType === 'worksheet') return allWorksheets.find((w) => w.id === s.contentId)?.title ?? s.contentId
    if (s.toolType === 'exam') return allExams.find((e) => e.id === s.contentId)?.title ?? s.contentId
    return s.contentId
  }

  const classOptionsWithGrade = useMemo(
    () => demoClasses.map((c) => ({ key: c.key, label: `${c.label} (${c.grade})`, grade: c.grade })),
    []
  )

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 via-primary-800 to-indigo-900 px-8 py-10 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              <Wrench className="h-4 w-4" /> Teacher Tools
            </div>
            <h1 className="text-3xl font-semibold leading-tight">Your teaching content command center</h1>
            <p className="text-sm text-white/80">
              Create, assign, and analyze quizzes, assignments, worksheets, and exams — with a workflow built for
              international schools and multi-class teaching.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/teacher-tools/quiz/create"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-900 shadow hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" /> Create Quiz
              </Link>
              <Link
                to="/teacher-tools/assignment/create"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                Create Assignment
              </Link>
              <Link
                to="/teacher-tools/worksheet/create"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                Create Worksheet
              </Link>
              <Link
                to="/teacher-tools/exams/create"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                Create Exam
              </Link>
            </div>
          </div>
          <div className="grid w-full max-w-sm gap-3 rounded-2xl bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Pending review</span>
              <span className="text-2xl font-semibold">{overviewKpis.pendingReview}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Avg completion</span>
              <span className="text-2xl font-semibold">{Math.round(overviewKpis.avgCompletion * 100)}%</span>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-1">
        <TeacherToolsFilterBar
          value={filters}
          onChange={setFilters}
          subjects={[...SUBJECTS]}
          grades={[]}
          hideGrade
          classOptions={classOptionsWithGrade}
          statusOptions={OVERVIEW_ACTIVITY_STATUS_OPTIONS}
        />
        <p className="text-xs text-gray-500">
          One scope control: pick a class (shows grade in the label) instead of separate grade + class. Activity type filters{' '}
          <span className="font-medium text-gray-700">Recent activity</span> only. Dates apply to activity, deadlines, drafts, and
          hand-ins.
        </p>
      </div>

      {state === 'loading' && (
        <div className="space-y-6">
          <CardGridSkeleton n={4} />
          <ChartSkeleton />
        </div>
      )}

      {state === 'error' && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          <p className="font-semibold">Could not load overview</p>
          <p className="mt-1">{error}</p>
          <button
            type="button"
            onClick={() => {
              retry()
              toast.success('Retrying…')
            }}
            className="mt-3 rounded-full bg-red-700 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {state === 'success' && data && (
        <>
          <p className="text-xs text-gray-500">Global metrics — totals are not narrowed by the filters below.</p>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              { label: 'Total active items', value: data.kpis.activeItems, icon: Layers },
              { label: 'Scheduled this week', value: data.kpis.scheduledThisWeek, icon: Calendar },
              { label: 'Pending review', value: data.kpis.pendingReview, icon: ClipboardCheck },
              { label: 'Submissions received', value: data.kpis.submissionsReceived, icon: TrendingUp },
              { label: 'Avg completion', value: `${Math.round(data.kpis.avgCompletion * 100)}%`, icon: BarChart3 },
              { label: 'Average score', value: `${data.kpis.avgScore}%`, icon: Sparkles },
            ].map((k) => (
              <div key={k.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{k.label}</p>
                  <k.icon className="h-5 w-5 text-primary-500" />
                </div>
                <p className="mt-3 text-2xl font-semibold text-gray-900">{k.value}</p>
              </div>
            ))}
          </section>

          <p className="text-xs font-medium text-gray-600">
            Filtered views (search, subject, class, dates, and activity type where noted)
          </p>
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Recent activity</h3>
              <p className="mt-0.5 text-xs text-gray-500">Respects activity type + filters above.</p>
              <ul className="mt-4 space-y-3">
                {filteredFeed.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
                  >
                    <span className="text-gray-800">{a.text}</span>
                    <span className="shrink-0 text-xs text-gray-500">{a.time}</span>
                  </li>
                ))}
              </ul>
              {filteredFeed.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">Nothing matches these filters. Try clearing search or activity type.</p>
              )}
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming deadlines</h3>
              <ul className="mt-4 space-y-3">
                {filteredDeadlines.map((d) => (
                  <li key={d.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                    <span className="font-medium text-gray-900">{d.title}</span>
                    <span className="text-xs text-gray-600">
                      {d.date} · {d.tool}
                    </span>
                  </li>
                ))}
              </ul>
              {filteredDeadlines.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">No deadlines in range for these filters.</p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent hand-ins</h3>
                <p className="mt-0.5 text-xs text-gray-500">Demo queue — open the tool to review or grade.</p>
              </div>
              <Link to="/teacher-tools/quiz" className="text-xs font-semibold text-primary-600 hover:text-primary-500">
                Browse tools
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Student</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Item</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredHandins.slice(0, 10).map((s) => (
                    <tr key={s.id} className="bg-white">
                      <td className="px-3 py-2 text-gray-800">{s.studentName}</td>
                      <td className="px-3 py-2 text-gray-700">{handinTitle(s)}</td>
                      <td className="px-3 py-2 capitalize text-gray-600">{s.status.replace(/_/g, ' ')}</td>
                      <td className="px-3 py-2 text-right">
                        <Link
                          to={submissionReviewPath(s)}
                          className="font-semibold text-primary-600 hover:text-primary-500"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredHandins.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">No hand-ins match these filters.</p>
            )}
          </section>

          <section className="grid gap-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Continue editing</h3>
              <p className="mt-0.5 text-xs text-gray-500">Drafts in your library — opens the editor.</p>
              <ul className="mt-4 space-y-2">
                {filteredDrafts.map((d) => (
                  <li key={d.id}>
                    <Link
                      to={draftEditPath(d.tool, d.id)}
                      className="flex items-center justify-between rounded-xl border border-dashed border-gray-200 px-3 py-2 text-sm hover:border-primary-300 hover:bg-primary-50/40"
                    >
                      <span>
                        <span className="font-medium text-gray-900">{d.title}</span>
                        <span className="ml-2 text-xs text-gray-500">{d.tool}</span>
                      </span>
                      <span className="text-xs text-gray-500">{d.updated}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {filteredDrafts.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">No drafts match these filters.</p>
              )}
            </div>
          </section>

          <SimpleBarChart
            title="Tool usage distribution"
            subtitle="Scaled to your current filters (illustrative)"
            points={toolChartPoints.map((t, i) => ({
              label: t.label,
              value: t.value,
              max: t.max,
              colorClass: ['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500'][i],
            }))}
          />
        </>
      )}
    </div>
  )
}
