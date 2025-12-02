import { useState } from 'react'
import {
  History as HistoryIcon,
  Clock,
  TrendingUp,
  FileText,
  Calendar,
  Filter,
  Search,
  Star,
  Copy,
  Edit,
  Share2,
  Pin,
  PinOff,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  X,
  Download,
  Eye,
  Sparkles,
  Zap,
  Layers,
  MessageSquare,
  GraduationCap,
  Grid3x3,
  List,
} from 'lucide-react'

interface HistoryItem {
  id: string
  title: string
  type: 'Lesson Plan' | 'Assessment' | 'Activity' | 'Communication' | 'PD Resource'
  subject: string
  class: string
  createdDate: string
  lastUsed: string
  templateUsed: string
  status: 'Draft' | 'Used in class' | 'Shared/Exported'
  pinned: boolean
  performanceHint?: 'Effective' | 'Needs improvement'
  usageCount: number
  color: string
}

const historyItems: HistoryItem[] = [
  {
    id: '1',
    title: 'Photosynthesis Lab – 6B',
    type: 'Lesson Plan',
    subject: 'Science',
    class: '6B',
    createdDate: '2024-02-27',
    lastUsed: '2 days ago',
    templateUsed: 'Science Experiment Idea Generator',
    status: 'Used in class',
    pinned: true,
    performanceHint: 'Effective',
    usageCount: 3,
    color: 'blue',
  },
  {
    id: '2',
    title: 'Fractions Assessment – Grade 5',
    type: 'Assessment',
    subject: 'Mathematics',
    class: '5A',
    createdDate: '2024-02-25',
    lastUsed: '1 week ago',
    templateUsed: 'Formative Assessment Generator',
    status: 'Used in class',
    pinned: false,
    performanceHint: 'Effective',
    usageCount: 2,
    color: 'green',
  },
  {
    id: '3',
    title: 'Water Cycle Activity',
    type: 'Activity',
    subject: 'Science',
    class: '4B',
    createdDate: '2024-02-20',
    lastUsed: '2 weeks ago',
    templateUsed: 'STEM Activity Generator',
    status: 'Used in class',
    pinned: false,
    usageCount: 1,
    color: 'purple',
  },
  {
    id: '4',
    title: 'Parent Newsletter – March',
    type: 'Communication',
    subject: 'General',
    class: 'All Classes',
    createdDate: '2024-02-15',
    lastUsed: '3 weeks ago',
    templateUsed: 'Newsletter Article Generator',
    status: 'Shared/Exported',
    pinned: true,
    usageCount: 1,
    color: 'orange',
  },
  {
    id: '5',
    title: 'Differentiation Strategies Workshop',
    type: 'PD Resource',
    subject: 'Professional Development',
    class: 'N/A',
    createdDate: '2024-02-10',
    lastUsed: '1 month ago',
    templateUsed: 'Professional Learning Hub',
    status: 'Draft',
    pinned: false,
    usageCount: 0,
    color: 'indigo',
  },
  {
    id: '6',
    title: 'Grammar Game Builder',
    type: 'Activity',
    subject: 'English',
    class: '7C',
    createdDate: '2024-02-28',
    lastUsed: '1 day ago',
    templateUsed: 'Grammar Game & Quiz Maker',
    status: 'Used in class',
    pinned: false,
    performanceHint: 'Effective',
    usageCount: 2,
    color: 'purple',
  },
]

const typeColors: Record<string, string> = {
  'Lesson Plan': 'bg-blue-100 text-blue-700 border-blue-200',
  Assessment: 'bg-green-100 text-green-700 border-green-200',
  Activity: 'bg-purple-100 text-purple-700 border-purple-200',
  Communication: 'bg-orange-100 text-orange-700 border-orange-200',
  'PD Resource': 'bg-indigo-100 text-indigo-700 border-indigo-200',
}

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-600',
  'Used in class': 'bg-emerald-100 text-emerald-700',
  'Shared/Exported': 'bg-amber-100 text-amber-700',
}

const quickStats = {
  totalItems: 47,
  thisWeek: 8,
  pinned: 3,
  mostUsed: 'Science Experiment Generator',
}

const History = () => {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFilter, setSelectedFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRangePreset, setDateRangePreset] = useState<string>('All')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')

  const getDateRange = () => {
    const today = new Date()
    const startOfToday = new Date(today)
    startOfToday.setHours(0, 0, 0, 0)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    switch (dateRangePreset) {
      case 'Today':
        return { start: startOfToday, end: new Date() }
      case 'This week':
        return { start: startOfWeek, end: new Date() }
      case 'Last 30 days':
        return { start: thirtyDaysAgo, end: new Date() }
      case 'This month':
        return { start: startOfMonth, end: new Date() }
      case 'Custom':
        return {
          start: customStartDate ? new Date(customStartDate) : null,
          end: customEndDate ? new Date(customEndDate) : null,
        }
      default:
        return { start: null, end: null }
    }
  }

  const filteredItems = historyItems.filter((item) => {
    if (selectedFilter !== 'All' && item.type !== selectedFilter) return false
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false

    // Date range filtering
    if (dateRangePreset !== 'All') {
      const range = getDateRange()
      const itemDate = new Date(item.createdDate)
      if (range.start && itemDate < range.start) return false
      if (range.end) {
        const endDate = new Date(range.end)
        endDate.setHours(23, 59, 59, 999)
        if (itemDate > endDate) return false
      }
    }

    return true
  })

  const pinnedItems = historyItems.filter((item) => item.pinned)
  const recentItems = historyItems.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 px-8 py-12 text-white shadow-xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/90">
              <HistoryIcon className="h-4 w-4" /> Your Teaching Archive
            </div>
            <h1 className="text-4xl font-semibold leading-tight">Everything you've created, all in one place</h1>
            <p className="text-base text-white/80">
              Quickly find, reuse, and improve your best teaching resources. Your personal library of lessons,
              assessments, and activities.
            </p>
          </div>

          <div className="grid w-full max-w-sm gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Total items</span>
              <span className="text-2xl font-semibold">{quickStats.totalItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">This week</span>
              <span className="text-2xl font-semibold">{quickStats.thisWeek}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Pinned</span>
              <span className="text-2xl font-semibold">{quickStats.pinned}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Bar */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="group cursor-pointer rounded-2xl border-2 border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Continue working</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">Last 3 items</p>
            </div>
            <Zap className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 space-y-2">
            {recentItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="w-full text-left text-xs text-gray-600 hover:text-blue-600"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="group cursor-pointer rounded-2xl border-2 border-gray-200 bg-white p-5 transition hover:border-amber-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Pinned items</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">{pinnedItems.length} saved</p>
            </div>
            <Pin className="h-8 w-8 text-amber-500" />
          </div>
          <div className="mt-4 space-y-2">
            {pinnedItems.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="w-full text-left text-xs text-gray-600 hover:text-amber-600"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="group cursor-pointer rounded-2xl border-2 border-gray-200 bg-white p-5 transition hover:border-green-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Most used</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">This month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 space-y-2">
            {historyItems
              .sort((a, b) => b.usageCount - a.usageCount)
              .slice(0, 3)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="w-full text-left text-xs text-gray-600 hover:text-green-600"
                >
                  {item.title} ({item.usageCount}x)
                </button>
              ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your history..."
                    className="w-64 rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="flex gap-2">
                  {['All', 'Lesson Plan', 'Assessment', 'Activity', 'Communication', 'PD Resource'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        selectedFilter === filter
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg p-2 transition ${
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg p-2 transition ${
                    viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-600" />
                <p className="text-sm font-semibold text-gray-900">Date range</p>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {['All', 'Today', 'This week', 'Last 30 days', 'This month', 'Custom'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setDateRangePreset(preset)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      dateRangePreset === preset
                        ? 'bg-slate-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              {dateRangePreset === 'Custom' && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="flex-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Start date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">End date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                  {(customStartDate || customEndDate) && (
                    <button
                      onClick={() => {
                        setCustomStartDate('')
                        setCustomEndDate('')
                      }}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Items Display */}
          {viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer rounded-2xl border-2 border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {item.pinned && <Pin className="h-4 w-4 text-amber-500" />}
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600">
                          {item.title}
                        </h3>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${typeColors[item.type]}`}
                        >
                          {item.type}
                        </span>
                        <span className="text-xs text-gray-500">{item.subject}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{item.class}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {item.createdDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {item.lastUsed}
                        </div>
                        {item.usageCount > 0 && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Used {item.usageCount}x
                          </div>
                        )}
                      </div>
                      {item.performanceHint && (
                        <div className="mt-3 flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
                          <Star className="h-3 w-3" />
                          {item.performanceHint}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Toggle pin
                      }}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-amber-500"
                    >
                      {item.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Duplicate
                      }}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Edit
                      }}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Share
                      }}
                      className="ml-auto rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${typeColors[item.type]}`}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {item.pinned && <Pin className="h-3.5 w-3.5 text-amber-500" />}
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                          {item.title}
                        </h3>
                        {item.performanceHint && (
                          <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            <Star className="h-3 w-3" />
                            {item.performanceHint}
                          </div>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span>{item.subject}</span>
                        <span>•</span>
                        <span>{item.class}</span>
                        <span>•</span>
                        <span>{item.lastUsed}</span>
                        {item.usageCount > 0 && (
                          <>
                            <span>•</span>
                            <span>Used {item.usageCount}x</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Sidebar */}
        {selectedItem ? (
          <aside className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Details</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-base font-semibold text-gray-900">{selectedItem.title}</h4>
                <p className="mt-1 text-sm text-gray-500">Template: {selectedItem.templateUsed}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Type</span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeColors[selectedItem.type]}`}>
                    {selectedItem.type}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[selectedItem.status]}`}>
                    {selectedItem.status}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Created</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedItem.createdDate}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Last used</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedItem.lastUsed}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Times used</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedItem.usageCount}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Quick actions</p>
                <div className="space-y-2">
                  <button className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500">
                    Open & Edit
                  </button>
                  <button className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:bg-blue-50">
                    Duplicate
                  </button>
                  <button className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:bg-blue-50">
                    Export PDF
                  </button>
                </div>
              </div>

              {selectedItem.performanceHint && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-semibold text-green-900">Marked as effective</p>
                  </div>
                  <p className="mt-2 text-xs text-green-700">
                    This resource has been flagged as working well in your classroom.
                  </p>
                </div>
              )}
            </div>
          </aside>
        ) : (
          <aside className="rounded-3xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="text-center">
              <Sparkles className="mx-auto h-12 w-12 text-blue-500" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Select an item</h3>
              <p className="mt-2 text-sm text-gray-600">
                Click on any item from your history to view details, edit, duplicate, or export it.
              </p>
            </div>
          </aside>
        )}
      </section>
    </div>
  )
}

export default History
