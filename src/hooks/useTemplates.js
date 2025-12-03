import { useCallback, useEffect, useMemo, useState } from 'react'
// Removed TypeScript type imports - using plain JavaScript
import {
  alignTemplatesByCode,
  alignTemplatesByGoal,
  fetchFrameworks,
  fetchStandardItems,
  fetchTemplates,
} from '../api/templates'
import { ApiError } from '../api/client'

const useFetch = (fetcher, deps) => {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()
    setState((prev) => ({ ...prev, loading: true, error: null }))

    fetcher(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setState({ data: result, loading: false, error: null })
        }
      })
      .catch((error) => {
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
  return useFetch(
    (signal) => fetchFrameworks(signal),
    [],
  )
}

export const useTemplatesSearch = (params) => {
  const serialized = useMemo(() => JSON.stringify(params || {}), [params])

  return useFetch(
    (signal) => fetchTemplates(JSON.parse(serialized), signal),
    [serialized],
  )
}

export const useStandardItems = (frameworkCode, subject, grade) => {
  const serialized = useMemo(
    () => ({ frameworkCode, subject: subject || undefined, grade: grade || undefined }),
    [frameworkCode, subject, grade],
  )

  return useFetch(
    (signal) => {
      if (!serialized.frameworkCode) {
        return Promise.resolve([])
      }
      return fetchStandardItems(serialized.frameworkCode, { subject: serialized.subject, grade: serialized.grade }, signal)
    },
    [serialized.frameworkCode, serialized.subject, serialized.grade],
  )
}

export const useTemplateAlignment = () => {
  const [state, setState] = useState({ data: null, loading: false, error: null })

  const run = useCallback(async (action, value) => {
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
    alignGoal: (goal) => run('goal', goal),
    alignCode: (code) => run('code', code),
  }
}
