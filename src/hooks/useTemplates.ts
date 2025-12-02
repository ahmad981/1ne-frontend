import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlignmentResponse,
  FrameworkResponse,
  PagedResponse,
  StandardItemResponse,
  TemplateListParams,
  TemplateResponse,
} from '../api/types'
import {
  alignTemplatesByCode,
  alignTemplatesByGoal,
  fetchFrameworks,
  fetchStandardItems,
  fetchTemplates,
} from '../api/templates'
import { ApiError } from '../api/client'

interface HookState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

const useFetch = <T,>(fetcher: (signal: AbortSignal) => Promise<T>, deps: unknown[]): HookState<T> => {
  const [state, setState] = useState<HookState<T>>({ data: null, loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()
    setState((prev) => ({ ...prev, loading: true, error: null }))

    fetcher(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setState({ data: result, loading: false, error: null })
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof ApiError ? error.message : 'Unable to load data'
        setState({ data: null, loading: false, error: message })
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}

export const useFrameworks = () => {
  return useFetch<FrameworkResponse[]>(
    (signal) => fetchFrameworks(signal),
    [],
  )
}

export const useTemplatesSearch = (params: TemplateListParams) => {
  const serialized = useMemo(() => JSON.stringify(params ?? {}), [params])

  return useFetch<PagedResponse<TemplateResponse>>(
    (signal) => fetchTemplates(JSON.parse(serialized) as TemplateListParams, signal),
    [serialized],
  )
}

export const useStandardItems = (frameworkCode?: string | null, subject?: string, grade?: string) => {
  const serialized = useMemo(
    () => ({ frameworkCode, subject: subject || undefined, grade: grade || undefined }),
    [frameworkCode, subject, grade],
  )

  return useFetch<StandardItemResponse[] | null>(
    (signal) => {
      if (!serialized.frameworkCode) {
        return Promise.resolve<StandardItemResponse[]>([])
      }
      return fetchStandardItems(serialized.frameworkCode, { subject: serialized.subject, grade: serialized.grade }, signal)
    },
    [serialized.frameworkCode, serialized.subject, serialized.grade],
  )
}

export const useTemplateAlignment = () => {
  const [state, setState] = useState<HookState<AlignmentResponse>>({ data: null, loading: false, error: null })

  const run = useCallback(async (action: 'goal' | 'code', value: string) => {
    if (!value) return
    setState({ data: null, loading: true, error: null })
    try {
      const result = action === 'goal' ? await alignTemplatesByGoal(value) : await alignTemplatesByCode(value)
      setState({ data: result, loading: false, error: null })
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Unable to complete alignment'
      setState({ data: null, loading: false, error: message })
    }
  }, [])

  return {
    ...state,
    alignGoal: (goal: string) => run('goal', goal),
    alignCode: (code: string) => run('code', code),
  }
}
