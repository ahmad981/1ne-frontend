import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  SYSTEM_BOOKS,
  aggregateCatalogTopicsFromBooks,
  estimateIndexedSegmentsMatched,
  getBooksForSubjectGrade,
  searchBooks,
  type DemoBook,
} from '../../demo/demoContentLibrary'
import { buildRagScopeGenerationContext, type GenerationSourceContext } from '../../demo/generationFromSources'

const EMPTY_BOOKS: DemoBook[] = []

export interface UseQuizRagScopeOptions {
  subject: string
  grade: string
  extraBooks?: DemoBook[]
  /** Hydrate when editing an existing quiz (demo persistence). */
  initialSelectedBookIds?: string[]
  initialScopeTopics?: string[]
  initialScopeRefinement?: string
}

export function useQuizRagScope({
  subject,
  grade,
  extraBooks = EMPTY_BOOKS,
  initialSelectedBookIds,
  initialScopeTopics,
  initialScopeRefinement,
}: UseQuizRagScopeOptions) {
  const catalog = useMemo(() => [...SYSTEM_BOOKS, ...extraBooks], [extraBooks])

  const pool = useMemo(
    () => getBooksForSubjectGrade(subject, grade, extraBooks),
    [subject, grade, extraBooks]
  )

  const [catalogQuery, setCatalogQuery] = useState('')
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>(() => initialSelectedBookIds ?? [])
  const [selectedTopics, setSelectedTopics] = useState<string[]>(() => initialScopeTopics ?? [])
  const [scopeRefinement, setScopeRefinement] = useState(initialScopeRefinement ?? '')
  const [generateWithoutSources, setGenerateWithoutSources] = useState(false)
  const [topicQuery, setTopicQuery] = useState('')
  const [topicsIndexing, setTopicsIndexing] = useState(false)
  const [catalogBusy, setCatalogBusy] = useState(false)

  useEffect(() => {
    if (initialSelectedBookIds === undefined) return
    setSelectedBookIds(initialSelectedBookIds)
  }, [initialSelectedBookIds])

  useEffect(() => {
    if (initialScopeTopics === undefined) return
    setSelectedTopics(initialScopeTopics)
  }, [initialScopeTopics])

  useEffect(() => {
    if (initialScopeRefinement === undefined) return
    setScopeRefinement(initialScopeRefinement)
  }, [initialScopeRefinement])

  useEffect(() => {
    setCatalogBusy(true)
    const t = window.setTimeout(() => setCatalogBusy(false), 280)
    return () => window.clearTimeout(t)
  }, [subject, grade])

  useEffect(() => {
    setSelectedBookIds((prev) => prev.filter((id) => pool.some((b) => b.id === id)))
  }, [pool])

  useEffect(() => {
    if (generateWithoutSources) {
      setSelectedBookIds([])
      setSelectedTopics([])
      setTopicsIndexing(false)
      setCatalogQuery('')
      return
    }
  }, [generateWithoutSources])

  useEffect(() => {
    if (generateWithoutSources) return
    if (selectedBookIds.length === 0) {
      setSelectedTopics([])
      setTopicsIndexing(false)
      return
    }
    setTopicsIndexing(true)
    const t = window.setTimeout(() => {
      setSelectedTopics((prev) => {
        const available = new Set(aggregateCatalogTopicsFromBooks(selectedBookIds, catalog))
        return prev.filter((x) => available.has(x))
      })
      setTopicsIndexing(false)
    }, 450)
    return () => window.clearTimeout(t)
  }, [selectedBookIds, catalog, generateWithoutSources])

  const filteredCatalog = useMemo(() => searchBooks(catalogQuery, pool), [catalogQuery, pool])

  const availableTopics = useMemo(
    () => aggregateCatalogTopicsFromBooks(selectedBookIds, catalog),
    [selectedBookIds, catalog]
  )

  const topicOptionsFiltered = useMemo(() => {
    const q = topicQuery.trim().toLowerCase()
    if (!q) return availableTopics
    return availableTopics.filter((t) => t.toLowerCase().includes(q))
  }, [availableTopics, topicQuery])

  const estimatedSegments = useMemo(
    () => estimateIndexedSegmentsMatched(selectedBookIds, selectedTopics, catalog),
    [selectedBookIds, selectedTopics, catalog]
  )

  const combinedTopicLabel = useMemo(() => {
    const base = selectedTopics.join(' · ')
    return scopeRefinement.trim() ? `${base} — ${scopeRefinement.trim()}` : base || 'General scope'
  }, [selectedTopics, scopeRefinement])

  const toggleBook = useCallback((id: string) => {
    setSelectedBookIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const removeBook = useCallback((id: string) => {
    setSelectedBookIds((prev) => prev.filter((x) => x !== id))
  }, [])

  const toggleTopic = useCallback((topic: string) => {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]))
  }, [])

  const clearAllTopics = useCallback(() => setSelectedTopics([]), [])

  const getGenerationContext = useCallback((): GenerationSourceContext => {
    return buildRagScopeGenerationContext({
      subject,
      grade,
      materialMode: generateWithoutSources ? 'none' : 'system',
      groundingEnabled: !generateWithoutSources,
      selectedBookIds,
      selectedScopeTopics: selectedTopics,
      scopeRefinement,
      allBooks: catalog,
    })
  }, [subject, grade, generateWithoutSources, selectedBookIds, selectedTopics, scopeRefinement, catalog])

  const generationSignature = useMemo(
    () =>
      [subject, grade, generateWithoutSources ? 'nosource' : 'source', selectedBookIds.join(','), selectedTopics.join('|'), scopeRefinement].join('~'),
    [subject, grade, generateWithoutSources, selectedBookIds, selectedTopics, scopeRefinement]
  )

  const isDirty = useMemo(
    () =>
      selectedBookIds.length > 0 ||
      selectedTopics.length > 0 ||
      generateWithoutSources ||
      !!scopeRefinement.trim() ||
      !!catalogQuery ||
      !!topicQuery,
    [selectedBookIds.length, selectedTopics.length, generateWithoutSources, scopeRefinement, catalogQuery, topicQuery]
  )

  const resetSources = useCallback(() => {
    setCatalogQuery('')
    setSelectedBookIds([])
    setSelectedTopics([])
    setScopeRefinement('')
    setGenerateWithoutSources(false)
    setTopicQuery('')
  }, [])

  /** Short book titles for review badges + generator rotation. */
  const ragSourceLabels = useMemo(() => {
    return selectedBookIds
      .map((id) => catalog.find((b) => b.id === id))
      .filter((b): b is DemoBook => Boolean(b))
      .map((b) => {
        const t = b.title
        return t.length > 40 ? `${t.slice(0, 38)}…` : t
      })
  }, [selectedBookIds, catalog])

  return {
    catalog,
    pool,
    catalogQuery,
    setCatalogQuery,
    filteredCatalog,
    catalogBusy,
    generateWithoutSources,
    setGenerateWithoutSources,
    selectedBookIds,
    toggleBook,
    removeBook,
    topicQuery,
    setTopicQuery,
    availableTopics,
    topicOptionsFiltered,
    topicsIndexing,
    selectedTopics,
    toggleTopic,
    clearAllTopics,
    scopeRefinement,
    setScopeRefinement,
    estimatedSegments,
    combinedTopicLabel,
    getGenerationContext,
    generationSignature,
    isDirty,
    resetSources,
    ragSourceLabels,
  }
}

export type QuizRagScopeModel = ReturnType<typeof useQuizRagScope>
