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
  demoQuizzes,
  demoWorksheets,
  type DemoAssignment,
  type DemoExam,
  type DemoQuiz,
  type DemoWorksheet,
} from './demo/teacherToolsDemoData'

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

  const api = useMemo(
    () =>
      createTeacherToolsMockApi({
        getExtras: () => extrasRef.current,
        setExtras,
      }),
    []
  )

  const value = useMemo<TeacherToolsDemoContextValue>(() => {
    const allQuizzes = [...demoQuizzes, ...extras.extraQuizzes]
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
  }, [extras, api])

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
