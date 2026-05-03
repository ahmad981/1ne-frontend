import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Settings2,
  Bell,
  Moon,
  Sun,
  Globe,
  Palette,
  Laptop,
  Cloud,
  Link2,
  ArrowDownToLine,
  Coins,
  Zap,
  TrendingUp,
  Clock,
  BarChart3,
  Loader2,
  ChevronRight,
} from 'lucide-react'
import { creditBalanceUiPercents } from '../utils/creditBalanceUi'
import {
  getCreditBalance,
  getUsageSummary,
  getUsageBreakdown,
  getTransactionHistory,
  CreditBalance,
  UsageSummary,
  UsageBreakdownItem,
  CreditTransaction,
} from '../api/subscriptions'
import ActivateCreditsModal from '../components/ActivateCreditsModal'

type Tab = 'general' | 'notifications' | 'plan' | 'integrations' | 'developer' | 'export'

const TABS: { key: Tab; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'plan', label: 'Plan & Credits' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'developer', label: 'Developer' },
  { key: 'export', label: 'Export' },
]

// ── Plan & Credits Tab ────────────────────────────────────────────────────────

function PlanCreditsTab() {
  const [balance, setBalance] = useState<CreditBalance | null>(null)
  const [summary, setSummary] = useState<UsageSummary | null>(null)
  const [breakdown, setBreakdown] = useState<UsageBreakdownItem[]>([])
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activateOpen, setActivateOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const [bal, sum, bk, txns] = await Promise.all([
          getCreditBalance(),
          getUsageSummary(),
          getUsageBreakdown(30),
          getTransactionHistory(1, 10),
        ])
        if (!mounted) return
        setBalance(bal)
        setSummary(sum)
        setBreakdown(bk.breakdown)
        setTransactions(txns.items)
      } catch {
        // Graceful — tables may not exist yet
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [activateOpen]) // re-fetch after modal closes

  const bal = balance?.balance ?? 0
  const total = balance?.total_allocated ?? 0
  const { ratio, barWidthPct, labelPct } = creditBalanceUiPercents(bal, total)

  const barColor = ratio > 0.5 ? 'bg-emerald-500' : ratio > 0.2 ? 'bg-amber-500' : 'bg-red-500'
  const pctColor = ratio > 0.5 ? 'text-emerald-600' : ratio > 0.2 ? 'text-amber-600' : 'text-red-600'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Balance card */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <Coins className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your credits</h2>
              {balance?.subscription_started_at && (
                <p className="text-xs text-gray-400">
                  Member since{' '}
                  {new Date(balance.subscription_started_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setActivateOpen(true)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition"
          >
            + Activate code
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{bal.toLocaleString()}</span>
            {total > 0 && (
              <span className="text-sm text-gray-400">/ {total.toLocaleString()} credits</span>
            )}
          </div>

          {total > 0 && (
            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.min(100, barWidthPct)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className={`font-semibold ${pctColor}`}>{labelPct}% remaining</span>
                {balance?.expires_at && !balance.auto_renew && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Expires{' '}
                    {new Date(balance.expires_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
                {balance?.auto_renew && (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <Zap className="h-3 w-3" />
                    Auto-renewing
                  </span>
                )}
              </div>
            </div>
          )}

          {bal === 0 && !loading && (
            <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">No active credits. Activate a code to get started.</p>
              <button
                onClick={() => setActivateOpen(true)}
                className="mt-2 text-sm font-semibold text-primary-600 hover:text-primary-500"
              >
                Activate credits →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Usage breakdown */}
      {breakdown.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Usage breakdown</h2>
            </div>
            <span className="text-xs text-gray-400">Last 30 days</span>
          </div>
          <div className="space-y-3">
            {breakdown.map((item) => (
              <div key={item.feature_key} className="flex items-center gap-3">
                <div className="w-32 shrink-0 text-sm font-medium text-gray-700 truncate">
                  {item.display_name}
                </div>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all duration-500"
                    style={{ width: `${item.pct_of_total}%` }}
                  />
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm font-semibold text-gray-700">{item.credits}</span>
                  <span className="text-xs text-gray-400 ml-1">cr</span>
                </div>
                <span className="w-10 text-right text-xs text-gray-400">{item.pct_of_total}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction history */}
      {transactions.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">Activity</h2>
          </div>
          <div className="space-y-1">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    txn.type === 'credit' || txn.type === 'renewal'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {txn.type === 'credit' || txn.type === 'renewal'
                      ? <Zap className="h-3.5 w-3.5" />
                      : <Coins className="h-3.5 w-3.5" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {txn.description || txn.feature_key || 'Activity'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(txn.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={`text-sm font-semibold ${
                    txn.amount > 0 ? 'text-emerald-600' : 'text-gray-700'
                  }`}>
                    {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {txn.balance_after.toLocaleString()} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ActivateCreditsModal open={activateOpen} onClose={() => setActivateOpen(false)} />
    </div>
  )
}

// ── Main Settings page ────────────────────────────────────────────────────────

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [theme] = useState<'system' | 'light' | 'dark'>('system')
  const [language] = useState('English (United States)')

  const initialTab = (searchParams.get('tab') as Tab) || 'general'
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  useEffect(() => {
    const tab = searchParams.get('tab') as Tab
    if (tab && TABS.some((t) => t.key === tab)) setActiveTab(tab)
  }, [searchParams])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setSearchParams(tab === 'general' ? {} : { tab })
  }

  const integrations = [
    { name: 'Google Classroom', status: 'Connected', description: 'Sync assignments and rosters automatically.' },
    { name: 'Microsoft Teams', status: 'Available', description: 'Enable Teams meetings and assignment syncing.' },
    { name: 'Canvas LMS', status: 'Coming soon', description: 'Direct gradebook integration for Canvas users.' },
  ]

  const notificationPrefs = [
    { label: 'Product updates & release notes', channel: 'Email + in-app' },
    { label: 'Lesson plan reminders', channel: 'Email only' },
    { label: 'Weekly insights report', channel: 'In-app only' },
  ]

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'plan' ? (
        <PlanCreditsTab />
      ) : (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            {activeTab === 'general' && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">General preferences</h2>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary-500" />
                      <div>
                        <p className="font-medium text-gray-900">Language</p>
                        <p>{language}</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">Change</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Laptop className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-gray-900">Time zone</p>
                        <p>America/Denver (MT)</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">Adjust</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Palette className="h-5 w-5 text-rose-500" />
                      <div>
                        <p className="font-medium text-gray-900">Interface theme</p>
                        <p className="capitalize">{theme} (follows device)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Sun className="h-4 w-4" />
                      <Moon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
                <div className="space-y-4 text-sm text-gray-600">
                  {notificationPrefs.map((pref) => (
                    <div key={pref.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{pref.label}</p>
                        <p className="text-xs text-gray-500">Current channel: {pref.channel}</p>
                      </div>
                      <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">Edit</button>
                    </div>
                  ))}
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                    Manage notification defaults
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  {integrations.map((integration) => (
                    <div key={integration.name} className="rounded-lg border border-gray-100 px-4 py-3 hover:border-primary-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Cloud className="h-5 w-5 text-sky-500" />
                          <div>
                            <p className="font-medium text-gray-900">{integration.name}</p>
                            <p className="text-xs text-gray-500">{integration.description}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                          {integration.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                    Add new integration
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {(activeTab === 'developer' || activeTab === 'general') && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">API & developer access</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <Link2 className="h-5 w-5 text-fuchsia-600" />
                    <div>
                      <p className="font-medium text-gray-900">Connected apps</p>
                      <p>3 apps have access to your teaching workspace.</p>
                    </div>
                  </div>
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                    Manage API tokens
                  </button>
                </div>
              </div>
            )}

            {(activeTab === 'export' || activeTab === 'general') && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Export & backup</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ArrowDownToLine className="h-5 w-5 text-sky-600" />
                      <div>
                        <p className="font-medium text-gray-900">Download workspace data</p>
                        <p className="text-xs text-gray-500">Templates, assessments, and chat history</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                      Export
                    </button>
                  </div>
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                    Schedule weekly backups
                  </button>
                </div>
              </div>
            )}
          </aside>
        </section>
      )}
    </div>
  )
}

export default Settings
