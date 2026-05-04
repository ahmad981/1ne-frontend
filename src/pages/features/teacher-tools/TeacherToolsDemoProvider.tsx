/* eslint-disable react-refresh/only-export-components -- session context + mock API hook */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createTeacherToolsMockApi, type TeacherToolsMockApi, type TeacherToolsSessionExtras } from './api/teacherToolsMockApi'
import {
  demoAssignments,
  demoExams,
  demoWorksheets,
  type DemoAssignment,
  type DemoExam,
  type DemoQuiz,
  type DemoWorksheet,
} from './demo/teacherToolsDemoData'
import { store } from '../../../redux/store'
import { quizApiSlice } from '../../../redux/features/teacherTools/quiz/quizApiSlice'
import {
  adaptApiItemToDemoQuiz,
  adaptDemoQuizPatchToApiPatch,
  adaptDemoQuizToCreatePayload,
} from '../../../api/quizApiAdapters'

const STORAGE_KEY = 'teacherTools_session_v1'
const LEGACY_STORAGE_KEY = 'teacherToolsDemo_v1'
const PERSIST_VERSION = 1

export type TeacherToolsDemoExtras = TeacherToolsSessionExtras

function emptyExtras(): TeacherToolsDemoExtras {
  return {
    extraQuizzes: [],
    extraAssignments: [],
    extraWorksheets: [],
    extraExams: [],
  }
}

function parseExtras(raw: string | null): TeacherToolsDemoExtras | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { v?: number } & Partial<TeacherToolsDemoExtras>
    if (parsed.v !== PERSIST_VERSION) return null
    return {
      extraQuizzes: Array.isArray(parsed.extraQuizzes) ? parsed.extraQuizzes : [],
      extraAssignments: Array.isArray(parsed.extraAssignments) ? parsed.extraAssignments : [],
      extraWorksheets: Array.isArray(parsed.extraWorksheets) ? parsed.extraWorksheets : [],
      extraExams: Array.isArray(parsed.extraExams) ? parsed.extraExams : [],
    }
  } catch {
    return null
  }
}

function loadExtras(): TeacherToolsDemoExtras {
  let raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) raw = sessionStorage.getItem(LEGACY_STORAGE_KEY)
  return parseExtras(raw) ?? emptyExtras()
}

export interface TeacherToolsDemoContextValue extends TeacherToolsDemoExtras {
  allQuizzes: DemoQuiz[]
  allAssignments: DemoAssignment[]
  allWorksheets: DemoWorksheet[]
  allExams: DemoExam[]
  api: TeacherToolsMockApi
}

const TeacherToolsDemoContext = createContext<TeacherToolsDemoContextValue | null>(null)

export function TeacherToolsDemoProvider({ children }: { children: ReactNode }) {
  const [extras, setExtras] = useState<TeacherToolsDemoExtras>(() => loadExtras())
  const extrasRef = useRef(extras)
  extrasRef.current = extras
  const [quizItems, setQuizItems] = useState<DemoQuiz[]>([])

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ v: PERSIST_VERSION, ...extras }))
      } catch {
        /* ignore quota */
      }
    }, 400)
    return () => window.clearTimeout(t)
  }, [extras])

  const api = useMemo<TeacherToolsMockApi>(() => {
    const mockApi = createTeacherToolsMockApi({
      getExtras: () => extrasRef.current,
      setExtras,
    })

    return {
      // ── REAL backend quiz methods ──────────────────────────────────────────
      listQuizzes: async () => {
        const res = await store.dispatch(
          quizApiSlice.endpoints.listQuizzes.initiate({ page_size: 200 }, { forceRefetch: true }),
        ).unwrap()
        const mapped = res.items.map(adaptApiItemToDemoQuiz)
        setQuizItems(mapped)
        return mapped
      },

      getQuiz: async (id: string) => {
        try {
          const item = await store.dispatch(quizApiSlice.endpoints.getQuiz.initiate(id)).unwrap()
          const mapped = adaptApiItemToDemoQuiz(item)
          setQuizItems((prev) => {
            const next = prev.some((q) => q.id === mapped.id) ? prev.map((q) => (q.id === mapped.id ? mapped : q)) : [...prev, mapped]
            return next
          })
          return mapped
        } catch {
          return undefined
        }
      },

      createQuiz: async (q: DemoQuiz) => {
        await store.dispatch(
          quizApiSlice.endpoints.createQuiz.initiate(adaptDemoQuizToCreatePayload(q)),
        ).unwrap()
        await store.dispatch(quizApiSlice.endpoints.listQuizzes.initiate({ page_size: 200 }, { forceRefetch: true })).unwrap().then((r) => {
          setQuizItems(r.items.map(adaptApiItemToDemoQuiz))
        })
      },

      updateQuiz: async (id: string, patch: Partial<DemoQuiz>) => {
        try {
          await store.dispatch(
            quizApiSlice.endpoints.patchQuiz.initiate({ id, patch: adaptDemoQuizPatchToApiPatch(patch) }),
          ).unwrap()
          const refreshed = await store.dispatch(quizApiSlice.endpoints.getQuiz.initiate(id, { forceRefetch: true })).unwrap()
          const mapped = adaptApiItemToDemoQuiz(refreshed)
          setQuizItems((prev) => prev.map((q) => (q.id === id ? mapped : q)))
          return { ok: true as const }
        } catch (err: unknown) {
          const status = (err as { status?: number }).status
          if (status === 404) return { ok: false as const, error: 'NOT_FOUND' }
          if (status === 403) return { ok: false as const, error: 'READ_ONLY' }
          return { ok: false as const, error: String(err) }
        }
      },

      deleteQuiz: async (id: string) => {
        try {
          await store.dispatch(quizApiSlice.endpoints.deleteQuiz.initiate(id)).unwrap()
          setQuizItems((prev) => prev.filter((q) => q.id !== id))
          return { ok: true as const }
        } catch (err: unknown) {
          const status = (err as { status?: number }).status
          if (status === 404) return { ok: false as const, error: 'NOT_FOUND' }
          return { ok: false as const, error: String(err) }
        }
      },

      duplicateQuiz: async (id: string) => {
        try {
          const res = await store.dispatch(quizApiSlice.endpoints.duplicateQuiz.initiate(id)).unwrap()
          await store.dispatch(quizApiSlice.endpoints.listQuizzes.initiate({ page_size: 200 }, { forceRefetch: true })).unwrap().then((r) => {
            setQuizItems(r.items.map(adaptApiItemToDemoQuiz))
          })
          return { ok: true as const, id: res.id }
        } catch (err: unknown) {
          const status = (err as { status?: number }).status
          if (status === 404) return { ok: false as const, error: 'NOT_FOUND' }
          return { ok: false as const, error: String(err) }
        }
      },

      // ── MOCK assignment/worksheet/exam methods (unchanged) ─────────────────
      listAssignments: mockApi.listAssignments,
      getAssignment: mockApi.getAssignment,
      createAssignment: mockApi.createAssignment,
      updateAssignment: mockApi.updateAssignment,
      deleteAssignment: mockApi.deleteAssignment,
      duplicateAssignment: mockApi.duplicateAssignment,

      listWorksheets: mockApi.listWorksheets,
      getWorksheet: mockApi.getWorksheet,
      createWorksheet: mockApi.createWorksheet,
      updateWorksheet: mockApi.updateWorksheet,
      deleteWorksheet: mockApi.deleteWorksheet,
      duplicateWorksheet: mockApi.duplicateWorksheet,

      listExams: mockApi.listExams,
      getExam: mockApi.getExam,
      createExam: mockApi.createExam,
      updateExam: mockApi.updateExam,
      deleteExam: mockApi.deleteExam,
      duplicateExam: mockApi.duplicateExam,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    void api.listQuizzes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo<TeacherToolsDemoContextValue>(() => {
    const allQuizzes = quizItems
    const allAssignments = [...demoAssignments, ...extras.extraAssignments]
    const allWorksheets = [...demoWorksheets, ...extras.extraWorksheets]
    const allExams = [...demoExams, ...extras.extraExams]
    return {
      ...extras,
      allQuizzes,
      allAssignments,
      allWorksheets,
      allExams,
      api,
    }
  }, [extras, api, quizItems])

  return <TeacherToolsDemoContext.Provider value={value}>{children}</TeacherToolsDemoContext.Provider>
}

export function useTeacherToolsDemo(): TeacherToolsDemoContextValue {
  const ctx = useContext(TeacherToolsDemoContext)
  if (!ctx) {
    throw new Error('useTeacherToolsDemo must be used within TeacherToolsDemoProvider')
  }
  return ctx
}

export function useTeacherToolsApi(): TeacherToolsMockApi {
  return useTeacherToolsDemo().api
}
