import { useState } from 'react'
import {
  Settings2,
  Bell,
  Moon,
  Sun,
  Globe,
  Palette,
  Laptop,
  GraduationCap,
  Cloud,
  Link2,
  ShieldCheck,
  ArrowDownToLine,
} from 'lucide-react'

const Settings = () => {
  const [theme] = useState<'system' | 'light' | 'dark'>('system')
  const [language] = useState('English (United States)')
  const integrations = [
    { name: 'Google Classroom', status: 'Connected', description: 'Sync assignments and rosters automatically.' },
    { name: 'Microsoft Teams', status: 'Available', description: 'Enable Teams meetings and assignment syncing.' },
    { name: 'Canvas LMS', status: 'Coming soon', description: 'Direct gradebook integration for Canvas users.' },
  ]

  const notificationPrefs = [
    {
      label: 'Product updates & release notes',
      channel: 'Email + in-app',
    },
    {
      label: 'Lesson plan reminders',
      channel: 'Email only',
    },
    {
      label: 'Weekly insights report',
      channel: 'In-app only',
    },
  ]

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6">
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
        </div>

        <aside className="space-y-6">
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
        </aside>
      </section>
    </div>
  )
}

export default Settings
