export type StatusFilterOption = { value: string; label: string }

/** Human-readable status filters for list pages (used when tab is “All”). */
export const QUIZ_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: '', label: 'Any status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'archived', label: 'Archived' },
]

export const ASSIGNMENT_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: '', label: 'Any status' },
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'pending_review', label: 'Pending review' },
  { value: 'graded', label: 'Graded' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'archived', label: 'Archived' },
]

export const WORKSHEET_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: '', label: 'Any status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export const EXAM_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: '', label: 'Any status' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

/** Overview “activity kind” filter (matches `activityFeed[].type`). */
export const OVERVIEW_ACTIVITY_STATUS_OPTIONS: StatusFilterOption[] = [
  { value: '', label: 'All activity types' },
  { value: 'submission', label: 'Submissions & hand-ins' },
  { value: 'graded', label: 'Grading & scores' },
  { value: 'schedule', label: 'Scheduling' },
  { value: 'draft', label: 'Drafts & edits' },
  { value: 'analytics', label: 'Analytics & opens' },
  { value: 'template', label: 'Templates' },
  { value: 'archive', label: 'Archive' },
]
