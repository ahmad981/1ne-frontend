import {
  demoClasses,
  type DemoAssignment,
  type DemoExam,
  type DemoQuiz,
  type DemoWorksheet,
} from '../demo/teacherToolsDemoData'
import { djb2 } from '../demo/generationFromSources'
import type { FilterValues } from '../components'

export function scoreDistributionForQuiz(quiz: DemoQuiz, range: '7d' | '30d' | 'all') {
  const h = djb2(`${quiz.id}|${range}|${quiz.submissionCount}`)
  const scale = range === '7d' ? 0.6 : range === '30d' ? 0.85 : 1
  const bump = (i: number) => 1 + ((h >> (i * 3)) % 7)
  const raw = [bump(0), bump(1), bump(2), bump(3), bump(4)].map((v, i) =>
    Math.round((v + (h % 5)) * (1 + i * 0.08) * scale * (1 + (quiz.submissionCount % 7) * 0.02))
  )
  const max = Math.max(...raw, 1)
  return [
    { label: '0–20', value: raw[0], max },
    { label: '21–40', value: raw[1], max },
    { label: '41–60', value: raw[2], max },
    { label: '61–80', value: raw[3], max },
    { label: '81–100', value: raw[4], max },
  ]
}

export function questionDifficultyForQuiz(quiz: DemoQuiz) {
  const h = djb2(quiz.id + quiz.topic)
  const n = Math.min(8, Math.max(4, (quiz.questions % 5) + 4))
  return Array.from({ length: n }, (_, i) => {
    const v = 5 + ((h + i * 17) % 28)
    const colorClass = v > 20 ? 'bg-rose-500' : v > 12 ? 'bg-amber-400' : 'bg-emerald-400'
    return { label: `Q${i + 1}`, value: v, max: 100, colorClass }
  })
}

export function unifiedToolPoints(filters: FilterValues) {
  const key = `${filters.q}|${filters.subject}|${filters.grade}|${filters.classKey}|${filters.status}`
  const twist = (label: string, base: number) => {
    const x = djb2(key + label) % 25
    let v = base + x - 12
    if (filters.subject === 'Mathematics' && (label === 'Quiz' || label === 'Sheet')) v += 14
    if (filters.subject === 'English' && label === 'Assign') v += 12
    if (filters.subject === 'Biology' && (label === 'Sheet' || label === 'Exam')) v += 10
    if (filters.grade === 'Grade 8' && label === 'Quiz') v += 8
    if (filters.q && !label.toLowerCase().includes(filters.q.toLowerCase().slice(0, 2))) v -= 5
    return Math.max(8, Math.min(95, v))
  }
  const raw = [
    { label: 'Quiz', value: twist('Quiz', 44) },
    { label: 'Assign', value: twist('Assign', 38) },
    { label: 'Sheet', value: twist('Sheet', 31) },
    { label: 'Exam', value: twist('Exam', 16) },
  ]
  const max = Math.max(...raw.map((r) => r.value), 1)
  return raw.map((r) => ({ ...r, max }))
}

export function unifiedStatCards(filters: FilterValues) {
  const key = `${filters.subject}|${filters.grade}|${filters.classKey}`
  const n = (base: number, tag: string) => {
    const x = djb2(key + tag) % 18
    return Math.max(8, base + x - 6)
  }
  return [
    { label: 'Content created', value: String(n(118, 'c')) },
    { label: 'Pending grading', value: String(n(14, 'p')) },
    { label: 'Avg class performance', value: `${n(76, 'a')}%` },
    { label: 'Review workload', value: n(14, 'r') > 12 ? 'High' : n(14, 'r') > 8 ? 'Medium' : 'Low' },
  ]
}

export function unifiedWeeklyPublishes(filters: FilterValues) {
  const v = 2.8 + (djb2(`${filters.subject}|${filters.grade}`) % 20) / 10
  return Math.round(v * 10) / 10
}

export function assignmentSubmissionBars(a: DemoAssignment, range: '7d' | '30d' | 'all') {
  const h = djb2(`${a.id}|sub|${range}|${a.submitted}|${a.assignedCount}`)
  const labels =
    range === '7d' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] : range === '30d' ? ['W1', 'W2', 'W3', 'W4'] : ['M1', 'M2', 'M3', 'M4', 'M5']
  const scale = range === '7d' ? 0.72 : range === '30d' ? 0.9 : 1
  const rate =
    a.assignedCount > 0 ? Math.min(95, Math.round((a.submitted / Math.max(1, a.assignedCount)) * 100)) : 45 + (h % 35)
  return labels.map((label, i) => {
    const t = (i + 1) / labels.length
    const v = Math.round((rate * t + 8 + ((h >> (i * 2)) % 18)) * scale)
    return { label, value: Math.min(100, Math.max(8, v)), max: 100 }
  })
}

export function worksheetClassMasteryBars(w: DemoWorksheet, range: '7d' | '30d' | 'all') {
  const classKeys = w.classes.length ? w.classes : ['g8c', 'g6b', 'g5a']
  const labels = classKeys.map((key) => demoClasses.find((c) => c.key === key)?.label ?? key)
  const h = djb2(`${w.id}|classes|${range}|${labels.join('|')}`)
  const scale = range === '7d' ? 0.88 : range === '30d' ? 0.96 : 1
  return labels.map((label, i) => {
    const base = 52 + ((h + i * 23) % 42)
    return {
      label: label.length > 8 ? `${label.slice(0, 7)}…` : label,
      value: Math.min(100, Math.round(base * scale + (range === 'all' ? 6 : 0))),
      max: 100,
    }
  })
}

export function examSectionPerformanceBars(e: DemoExam, range: '7d' | '30d' | 'all') {
  const h = djb2(`${e.id}|${e.subject}|${e.examType}|${range}`)
  const scale = range === '7d' ? 0.9 : range === '30d' ? 0.97 : 1
  const labels = ['Sec A', 'Sec B', 'Sec C', 'Short answ.']
  return labels.map((label, i) => ({
    label,
    value: Math.min(100, Math.round((58 + ((h + i * 19) % 35)) * scale)),
    max: 100,
  }))
}

