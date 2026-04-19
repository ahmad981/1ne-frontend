import { useState } from 'react'
import { BookOpen, Layers } from 'lucide-react'
import type { ContentSourcesFormModel } from '../hooks/useContentSourcesForm'
import { getBookById, getChapters, getExcerptsForSelection } from '../demo/demoContentLibrary'
// @ts-expect-error — JS module
import { NoDataFound } from '../../../../components/shared/NoDataFound'

export interface ContentSourcesPanelProps {
  subject: string
  grade: string
  model: ContentSourcesFormModel
}

export function ContentSourcesPanel({ subject, grade, model }: ContentSourcesPanelProps) {
  const [showExcerpts, setShowExcerpts] = useState(false)

  const selectedBook = model.selectedBookId ? getBookById(model.selectedBookId, model.catalog) : undefined
  const chapters = model.selectedBookId ? getChapters(model.selectedBookId, model.catalog) : []
  const excerpts = selectedBook ? getExcerptsForSelection(selectedBook, model.chapterIds) : []

  return (
    <div
      className="space-y-5 rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/40 to-white p-5 shadow-sm"
      aria-label={`Content sources for ${subject}, ${grade}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Layers className="h-4 w-4 text-indigo-600" aria-hidden />
            Content sources
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Select topic and catalog materials. Your organization can add proprietary titles from the admin library later;
            generation can use retrieval over approved content when connected.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
          <input
            type="checkbox"
            checked={model.groundingEnabled}
            onChange={(e) => model.setGroundingEnabled(e.target.checked)}
          />
          Use selected materials for generation
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700">
          Topic (preset)
          <select
            value={model.topicPreset}
            onChange={(e) => model.setTopicPreset(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            {model.topicsForSubject.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Topic refinement (free text)
          <input
            value={model.topicRefinement}
            onChange={(e) => model.setTopicRefinement(e.target.value)}
            placeholder="e.g. word problems, exam skills"
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-gray-800">Primary material</legend>
        <div className="flex flex-wrap gap-3 text-sm">
          {(
            [
              { key: 'none' as const, label: 'No book' },
              { key: 'system' as const, label: 'System library' },
            ] as const
          ).map((opt) => (
            <label
              key={opt.key}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 ${
                model.materialMode === opt.key ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'
              }`}
            >
              <input
                type="radio"
                name="material-mode"
                checked={model.materialMode === opt.key}
                onChange={() => model.setMaterialMode(opt.key)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {model.materialMode === 'system' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Search catalog
            <input
              value={model.bookSearchQuery}
              onChange={(e) => model.setBookSearchQuery(e.target.value)}
              placeholder="Title, author, ISBN, subject…"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
          </label>

          {model.filteredBooks.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
              <NoDataFound />
              <p className="mt-2 text-xs text-gray-600">No books match this search.</p>
              <button
                type="button"
                onClick={() => model.setBookSearchQuery('')}
                className="mt-3 rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-500"
              >
                Clear search
              </button>
            </div>
          )}

          <div className="grid max-h-72 gap-3 overflow-y-auto md:grid-cols-2">
            {model.filteredBooks.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => model.setSelectedBookId(b.id)}
                className={`rounded-xl border p-4 text-left text-sm transition ${
                  model.selectedBookId === b.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex h-14 w-11 flex-shrink-0 items-center justify-center rounded bg-gray-200 text-gray-500">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 line-clamp-2">{b.title}</p>
                    <p className="text-xs text-gray-600">{b.authors}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {b.subjects.join(', ')} · {b.indexedSections} indexed segments
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {chapters.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-800">Chapters (optional multi-select)</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {chapters.map((c) => (
                  <label
                    key={c.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                      model.chapterIds.includes(c.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <input type="checkbox" checked={model.chapterIds.includes(c.id)} onChange={() => model.toggleChapter(c.id)} />
                    {c.title}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedBook && model.chapterIds.length > 0 && excerpts.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowExcerpts((s) => !s)}
            className="text-sm font-semibold text-primary-600 hover:text-primary-500"
          >
            {showExcerpts ? 'Hide' : 'Show'} excerpt preview
          </button>
          {showExcerpts && (
            <ul className="mt-2 space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700">
              {excerpts.slice(0, 3).map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
