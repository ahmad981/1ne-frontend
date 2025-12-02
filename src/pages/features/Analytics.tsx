import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  GraduationCap,
  Users,
  Star,
  Activity,
} from 'lucide-react'

const overallMetrics = {
  overallProgress: 68,
  coursesCompleted: 12,
  coursesInProgress: 5,
  totalHours: 24.5,
  certificatesEarned: 2,
  currentStreak: 5,
  weeklyGoal: 3,
  weeklyCompleted: 2,
  rankPercentile: 35,
}

const monthlyTrend = [
  { month: 'Oct', completed: 8, hours: 12.5 },
  { month: 'Nov', completed: 10, hours: 15.2 },
  { month: 'Dec', completed: 7, hours: 11.8 },
  { month: 'Jan', completed: 9, hours: 14.3 },
  { month: 'Feb', completed: 12, hours: 24.5 },
]

const skillProgress = [
  {
    category: 'Classroom Management',
    progress: 85,
    completed: 3,
    total: 4,
    trend: '+5%',
    trendDirection: 'up',
  },
  {
    category: 'Assessment Strategies',
    progress: 100,
    completed: 4,
    total: 4,
    trend: 'Complete',
    trendDirection: 'neutral',
  },
  {
    category: 'Differentiation',
    progress: 45,
    completed: 2,
    total: 5,
    trend: '+12%',
    trendDirection: 'up',
  },
  {
    category: 'Student Engagement',
    progress: 30,
    completed: 1,
    total: 4,
    trend: '+8%',
    trendDirection: 'up',
  },
  {
    category: 'Digital Literacy & AI',
    progress: 20,
    completed: 1,
    total: 6,
    trend: '+5%',
    trendDirection: 'up',
  },
]

const weeklyActivity = [
  { day: 'Mon', courses: 2, hours: 3.5 },
  { day: 'Tue', courses: 1, hours: 2.0 },
  { day: 'Wed', courses: 3, hours: 4.5 },
  { day: 'Thu', courses: 2, hours: 3.0 },
  { day: 'Fri', courses: 1, hours: 1.5 },
  { day: 'Sat', courses: 0, hours: 0 },
  { day: 'Sun', courses: 1, hours: 1.5 },
]

const courseCompletionRate = [
  { category: 'Completed', value: 12, color: 'bg-green-500' },
  { category: 'In Progress', value: 5, color: 'bg-blue-500' },
  { category: 'Not Started', value: 8, color: 'bg-gray-300' },
]

const performanceInsights = [
  {
    title: 'Completion rate improvement',
    description: 'Your completion rate increased by 12% this month compared to last month.',
    trend: '+12%',
    positive: true,
  },
  {
    title: 'Learning velocity',
    description: 'You\'re completing courses 25% faster than your average pace.',
    trend: '+25%',
    positive: true,
  },
  {
    title: 'Skill balance',
    description: 'Focus on Digital Literacy & AI to improve overall skill balance.',
    trend: 'Needs attention',
    positive: false,
  },
]

const achievementTimeline = [
  {
    date: '2024-02-20',
    title: 'Assessment Mastery Certificate',
    type: 'Certificate',
    description: 'Completed all assessment strategy courses',
  },
  {
    date: '2024-02-19',
    title: '5-Day Learning Streak',
    type: 'Milestone',
    description: 'Consistent daily learning for 5 days',
  },
  {
    date: '2024-02-15',
    title: '10 Courses Completed',
    type: 'Milestone',
    description: 'Reached 10 completed micro-courses',
  },
  {
    date: '2024-02-10',
    title: 'First Certificate Earned',
    type: 'Certificate',
    description: 'Completed Classroom Management track',
  },
]

const comparisonMetrics = {
  yourAverage: 2.4,
  peerAverage: 2.1,
  yourCompletion: 68,
  peerCompletion: 62,
}

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

  const maxCourses = Math.max(...weeklyActivity.map((d) => d.courses))
  const maxHours = Math.max(...weeklyActivity.map((d) => d.hours))

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-12 text-white shadow-xl">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/90">
              <BarChart3 className="h-4 w-4" /> Performance Analytics
            </div>
            <h1 className="text-4xl font-semibold leading-tight">Your professional learning insights</h1>
            <p className="text-base text-white/80">
              Deep dive into your progress, trends, and performance metrics to understand your growth journey and
              identify opportunities for improvement.
            </p>
          </div>

          <div className="grid w-full max-w-md gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Overall progress</p>
              <p className="mt-2 text-3xl font-semibold">{overallMetrics.overallProgress}%</p>
              <p className="text-xs text-white/70">Across all learning areas</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Rank percentile</p>
              <p className="mt-2 text-3xl font-semibold">Top {overallMetrics.rankPercentile}%</p>
              <p className="text-xs text-white/70">Above average performance</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Learning streak</p>
              <p className="mt-2 text-3xl font-semibold">{overallMetrics.currentStreak} days</p>
              <p className="text-xs text-white/70">Keep the momentum!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Period Selector */}
      <section className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <p className="text-sm font-semibold text-gray-900">Time period</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                selectedPeriod === period
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </section>

      {/* Key Metrics Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Courses completed</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{overallMetrics.coursesCompleted}</p>
              <p className="mt-1 text-xs text-gray-500">{overallMetrics.coursesInProgress} in progress</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-green-600">+3 this month</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total PD hours</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{overallMetrics.totalHours}</p>
              <p className="mt-1 text-xs text-gray-500">This month</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-blue-600">+10.2 hrs vs last month</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Certificates earned</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{overallMetrics.certificatesEarned}</p>
              <p className="mt-1 text-xs text-gray-500">Ready for portfolios</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Award className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <Star className="h-4 w-4 text-amber-600" />
            <span className="text-amber-600">2 new this quarter</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Weekly goal progress</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {overallMetrics.weeklyCompleted}/{overallMetrics.weeklyGoal}
              </p>
              <p className="mt-1 text-xs text-gray-500">Courses this week</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Target className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-purple-500 transition-all"
                style={{
                  width: `${(overallMetrics.weeklyCompleted / overallMetrics.weeklyGoal) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trend Chart */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly progress trend</h3>
              <p className="mt-1 text-sm text-gray-600">Courses completed and hours logged over time</p>
            </div>
            <BarChart3 className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="mt-6">
            <div className="flex items-end justify-between gap-2">
              {monthlyTrend.map((data, idx) => (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end justify-center gap-1">
                    <div
                      className="w-full rounded-t-lg bg-indigo-500 transition hover:bg-indigo-600"
                      style={{ height: `${(data.completed / 12) * 120}px` }}
                    />
                    <div
                      className="w-full rounded-t-lg bg-purple-400 transition opacity-70"
                      style={{ height: `${(data.hours / 24.5) * 120}px` }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-500">{data.month}</p>
                  <p className="text-xs text-gray-400">{data.completed} courses</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-indigo-500" />
                <span>Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-purple-400" />
                <span>Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Weekly activity breakdown</h3>
              <p className="mt-1 text-sm text-gray-600">Daily learning patterns this week</p>
            </div>
            <Activity className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="mt-6">
            <div className="flex items-end justify-between gap-2">
              {weeklyActivity.map((day, idx) => (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end justify-center gap-1">
                    <div
                      className="w-full rounded-t-lg bg-indigo-500 transition hover:bg-indigo-600"
                      style={{ height: `${(day.courses / maxCourses) * 100}px` }}
                    />
                    <div
                      className="w-full rounded-t-lg bg-pink-400 transition opacity-70"
                      style={{ height: `${(day.hours / maxHours) * 100}px` }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-500">{day.day}</p>
                  <p className="text-xs text-gray-400">{day.courses} courses</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Completion Pie */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Course status distribution</h3>
              <p className="mt-1 text-sm text-gray-600">Breakdown of all enrolled courses</p>
            </div>
            <PieChart className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="mt-6 flex items-center justify-center">
            <div className="relative h-48 w-48">
              <svg className="h-48 w-48 -rotate-90 transform">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="16"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeDasharray={`${(12 / 25) * 502.4} 502.4`}
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="16"
                  strokeDasharray={`${(5 / 25) * 502.4} 502.4`}
                  strokeDashoffset={`-${(12 / 25) * 502.4}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-semibold text-gray-900">25</p>
                <p className="text-xs text-gray-500">Total courses</p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {courseCompletionRate.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded ${item.color}`} />
                  <span className="text-sm text-gray-600">{item.category}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Progress */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Skill area progress</h3>
              <p className="mt-1 text-sm text-gray-600">Detailed breakdown by competency</p>
            </div>
            <Target className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="mt-6 space-y-4">
            {skillProgress.map((skill, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{skill.category}</span>
                  <div className="flex items-center gap-2">
                    {skill.trendDirection === 'up' && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <ArrowUpRight className="h-3 w-3" />
                        {skill.trend}
                      </div>
                    )}
                    {skill.trendDirection === 'neutral' && (
                      <span className="text-xs text-gray-500">{skill.trend}</span>
                    )}
                    <span className="text-xs font-semibold text-gray-600">
                      {skill.completed}/{skill.total}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full transition-all ${
                      skill.progress === 100
                        ? 'bg-green-500'
                        : skill.progress >= 50
                          ? 'bg-blue-500'
                          : skill.progress >= 30
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Insights */}
      <section className="grid gap-6 lg:grid-cols-3">
        {performanceInsights.map((insight, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-6 ${
              insight.positive
                ? 'border-green-200 bg-green-50'
                : 'border-amber-200 bg-amber-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
                <p className="mt-2 text-xs text-gray-600">{insight.description}</p>
              </div>
              {insight.positive ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
            </div>
            <div className="mt-4">
              <span
                className={`text-lg font-semibold ${
                  insight.positive ? 'text-green-700' : 'text-amber-700'
                }`}
              >
                {insight.trend}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Comparison & Achievement Timeline */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Peer Comparison */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Peer comparison</h3>
              <p className="mt-1 text-sm text-gray-600">How you compare to other educators</p>
            </div>
            <Users className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="mt-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Weekly learning hours</span>
                <span className="text-sm font-semibold text-gray-900">
                  {comparisonMetrics.yourAverage} hrs/week
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{ width: `${(comparisonMetrics.yourAverage / 5) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Peer average: {comparisonMetrics.peerAverage} hrs/week
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Completion rate</span>
                <span className="text-sm font-semibold text-gray-900">
                  {comparisonMetrics.yourCompletion}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${comparisonMetrics.yourCompletion}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Peer average: {comparisonMetrics.peerCompletion}%
              </p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-green-600" />
                <p className="text-xs font-semibold text-green-900">Above average performance</p>
              </div>
              <p className="mt-1 text-xs text-green-700">
                You're performing better than {100 - overallMetrics.rankPercentile}% of educators in your network.
              </p>
            </div>
          </div>
        </div>

        {/* Achievement Timeline */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Achievement timeline</h3>
              <p className="mt-1 text-sm text-gray-600">Your milestones and certificates</p>
            </div>
            <Award className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="mt-6 space-y-4">
            {achievementTimeline.map((achievement, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    {achievement.type === 'Certificate' ? (
                      <Award className="h-5 w-5" />
                    ) : (
                      <Star className="h-5 w-5" />
                    )}
                  </div>
                  {idx < achievementTimeline.length - 1 && (
                    <div className="mt-2 h-full w-0.5 bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      {achievement.type}
                    </span>
                    <span className="text-xs text-gray-500">{achievement.date}</span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-gray-900">{achievement.title}</h4>
                  <p className="mt-1 text-xs text-gray-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Export & Actions */}
      <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Export analytics report</h3>
            <p className="mt-1 text-sm text-gray-600">
              Download a comprehensive PDF report of your performance metrics for appraisals, portfolios, or personal
              tracking.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Export PDF
            </button>
            <button className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
              Share report
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Analytics


