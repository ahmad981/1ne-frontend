import { useMemo, useState } from 'react'
import { BarChart3, Download } from 'lucide-react'
import {
  ChartSkeleton,
  SimpleBarChart,
  TeacherToolsFilterBar,
  TeacherToolsPageHeader,
  type FilterValues,
} from '../components'
import { useDemoAsync } from '../hooks/useDemoAsync'
import { demoClasses } from '../demo/teacherToolsDemoData'
import { SUBJECTS } from '../types'
import { unifiedStatCards, unifiedToolPoints, unifiedWeeklyPublishes } from '../utils/analyticsDemoSeries'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'

export default function TeacherToolsUnifiedAnalytics() {
  const { toast } = useSnackbar()
  const [filters, setFilters] = useState<FilterValues>({
    q: '',
    subject: '',
    grade: '',
    classKey: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  })

  const loader = useMemo(() => async () => ({ loaded: true }), [])
  const { state } = useDemoAsync(loader, { delayMs: 450 })

  const toolPoints = useMemo(() => unifiedToolPoints(filters), [filters])
  const statCards = useMemo(() => unifiedStatCards(filters), [filters])
  const weekly = useMemo(() => unifiedWeeklyPublishes(filters), [filters])

  return (
    <div className="space-y-8">
      <TeacherToolsPageHeader
        title="Teacher Tools analytics"
        subtitle="Cross-tool performance, grading workload, and exportable reports."
        breadcrumbs={[{ label: 'Teacher Tools', to: '/teacher-tools' }, { label: 'Analytics' }]}
        actions={
          <button
            type="button"
            onClick={() => toast.success('Preparing export…')}
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" /> Export report
          </button>
        }
      />

      <TeacherToolsFilterBar
        value={filters}
        onChange={setFilters}
        subjects={[...SUBJECTS]}
        grades={[]}
        hideGrade
        classOptions={demoClasses.map((c) => ({ key: c.key, label: `${c.label} (${c.grade})`, grade: c.grade }))}
        statusOptions={[
          { value: '', label: 'Any' },
          { value: 'draft', label: 'Draft-heavy workload' },
          { value: 'active', label: 'Active classes' },
        ]}
      />

      {state === 'loading' && <ChartSkeleton />}

      {state === 'success' && (
        <>
          <p className="text-xs text-gray-500">
            Figures below respond to your filters (illustrative cross-tool metrics).
          </p>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((k) => (
              <div key={k.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase text-gray-500">{k.label}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{k.value}</p>
              </div>
            ))}
          </section>

          <SimpleBarChart title="Tool engagement" subtitle="Creates and opens (scaled to filters)" points={toolPoints} />

          <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <BarChart3 className="h-4 w-4" /> Productivity
            </div>
            <p className="mt-2 text-sm text-gray-700">
              You are publishing about {weekly} items per week on average across tools (illustrative).
            </p>
          </div>
        </>
      )}
    </div>
  )
}
