import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Loader2,
  Map,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react'

import { TemplateListParams, TemplateResponse, TemplateSort } from '../../api/types'

type TemplateFilterFormState = {
  q: string
  subject: string
  gradeBand: string
  bloom: string
  kind: string
  framework: string
  standardCode: string
  sort: TemplateSort
  pageSize: number
}

type AttributeFieldKey = 'subject' | 'gradeBand' | 'bloom' | 'kind'
import {
  useFrameworks,
  useTemplatesSearch,
} from '../../hooks/useTemplates'
import { useNavigate } from 'react-router-dom'

const DEFAULT_FILTERS: TemplateListParams = {
  page: 1,
  pageSize: 6,
  sort: 'title',
}

const sortOptions: { label: string; value: TemplateSort }[] = [
  { label: 'Title (A → Z)', value: 'title' },
  { label: 'Title (Z → A)', value: '-title' },
  { label: 'Recently Added', value: '-created' },
  { label: 'Oldest First', value: 'created' },
]

const pageSizeOptions = [6, 9, 12]

const TemplatesLibrary = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<TemplateListParams>(DEFAULT_FILTERS)
  const [formState, setFormState] = useState<TemplateFilterFormState>({
    q: '',
    subject: '',
    gradeBand: '',
    bloom: '',
    kind: '',
    framework: '',
    standardCode: '',
    sort: DEFAULT_FILTERS.sort as TemplateSort,
    pageSize: DEFAULT_FILTERS.pageSize ?? 6,
  })

  const templatesState = useTemplatesSearch(filters)
  const frameworksState = useFrameworks()

  const templates = templatesState.data?.items ?? []
  const total = templatesState.data?.total ?? 0
  const pageSize = templatesState.data?.pageSize ?? filters.pageSize ?? 6
  const currentPage = filters.page ?? 1
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  const attributeFields: Array<{ label: string; key: AttributeFieldKey; placeholder: string }> = [
    { label: 'Subject', key: 'subject', placeholder: 'e.g., math' },
    { label: 'Grade band', key: 'gradeBand', placeholder: 'e.g., 6 or KS3' },
    { label: 'Bloom level', key: 'bloom', placeholder: 'e.g., apply' },
    { label: 'Template kind', key: 'kind', placeholder: 'lesson, assessment…' },
  ]

  const applyFilters = () => {
    setFilters({
      page: 1,
      pageSize: formState.pageSize,
      sort: formState.sort,
      q: formState.q || undefined,
      subject: formState.subject || undefined,
      gradeBand: formState.gradeBand || undefined,
      bloom: formState.bloom || undefined,
      kind: formState.kind || undefined,
      framework: formState.framework || undefined,
      standardCode: formState.standardCode || undefined,
    })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    applyFilters()
  }

  const handleReset = () => {
    setFormState({
      q: '',
      subject: '',
      gradeBand: '',
      bloom: '',
      kind: '',
      framework: '',
      standardCode: '',
      sort: 'title',
      pageSize: 6,
    })
    setFilters(DEFAULT_FILTERS)
  }

  const handlePageChange = (direction: 'prev' | 'next') => {
    setFilters((prev) => {
      const page = prev.page ?? 1
      const nextPage = direction === 'next' ? Math.min(totalPages, page + 1) : Math.max(1, page - 1)
      if (nextPage === page) return prev
      return { ...prev, page: nextPage }
    })
  }

  const renderTemplateCard = (template: TemplateResponse) => {
    const handleOpen = () => {
      if (!template.slug) return
      navigate(`/dashboard/templates/${template.slug}`)
    }

    return (
      <article
        key={template.id}
        onClick={handleOpen}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleOpen()
        }}
        role="button"
        tabIndex={0}
        className="flex h-full cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <div className="mb-4 space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
            {template.subject || 'General'} · Grade {template.gradeBand}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {template.description || 'This template is ready for standards alignment and lesson planning.'}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            {template.bloom && <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-600">Bloom: {template.bloom}</span>}
            {template.kind && <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{template.kind}</span>}
            {template.canonicalOutcome && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                Outcome · {template.canonicalOutcome}
              </span>
            )}
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">Aligned Standards</p>
            {template.standards.length ? (
              <ul className="space-y-2">
                {template.standards.map((standard) => (
                  <li key={`${standard.framework_code}-${standard.standard_code}`} className="text-sm text-slate-700">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{standard.framework_code}</span>
                      <span className="text-slate-500">{standard.standard_code}</span>
                    </div>
                    <p className="text-xs text-slate-500">{standard.title}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No standards mapped yet for this template.</p>
            )}
          </div>
        </div>
      </article>
    )
  }

  const hasActiveFilters = Object.values({ ...formState, sort: undefined, pageSize: undefined })
    .some((value) => !!value)

  return (
    <div className="space-y-8">
      <header className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Templates</p>
            <h1 className="text-3xl font-semibold text-gray-900">Standards-aligned Library</h1>
            <p className="text-sm text-gray-600">
              Search lessons, filter by standards, and preview canonical outcomes before assigning to classes.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Map className="h-4 w-4 text-indigo-500" />
            <span>Tenant scoped · deterministic results</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={formState.q}
                onChange={(event) => setFormState((prev) => ({ ...prev, q: event.target.value }))}
                placeholder="Search by template title, subject, or description"
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-800 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={formState.sort}
                onChange={(event) => setFormState((prev) => ({ ...prev, sort: event.target.value as TemplateSort }))}
                className="rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={formState.pageSize}
                onChange={(event) => setFormState((prev) => ({ ...prev, pageSize: Number(event.target.value) }))}
                className="rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {attributeFields.map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{field.label}</label>
                <input
                  value={formState[field.key]}
                  onChange={(event) => setFormState((prev) => ({ ...prev, [field.key]: event.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Framework</label>
              <select
                value={formState.framework}
                onChange={(event) => setFormState((prev) => ({ ...prev, framework: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Any framework</option>
                {frameworksState.data?.map((framework) => (
                  <option key={framework.code} value={framework.code}>
                    {framework.code} · {framework.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Standard code</label>
              <input
                value={formState.standardCode}
                onChange={(event) => setFormState((prev) => ({ ...prev, standardCode: event.target.value }))}
                placeholder="CCSS.MATH.CONTENT.6.EE.A.2"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Apply filters
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
              </button>
            </div>
          </div>

          {hasActiveFilters && (
            <p className="text-xs text-gray-500">
              Filters active · backend enforces tenant-safe pagination.
            </p>
          )}
        </form>
      </header>

      <div className="space-y-4">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">{total} templates</p>
              <p className="text-xs text-gray-500">Page {currentPage} of {totalPages}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage <= 1}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange('next')}
                disabled={currentPage >= totalPages}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

          {templatesState.loading && (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-300 py-10 text-sm text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-indigo-500" /> Loading templates…
            </div>
          )}

          {templatesState.error && !templatesState.loading && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700">
              <AlertTriangle className="h-4 w-4" /> {templatesState.error}
            </div>
          )}

          {!templatesState.loading && !templates.length && !templatesState.error && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-600">
              No templates match those filters yet. Seed data includes math expressions so try subject “math”.
            </div>
          )}

          {templates.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => renderTemplateCard(template))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default TemplatesLibrary
