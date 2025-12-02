import { useState } from 'react'
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Building2,
  MapPin,
  PencilLine,
  ShieldCheck,
  Bell,
  Clock,
  Sparkles,
  FileCheck2,
  MessageSquare,
} from 'lucide-react'

const Profile = () => {
  const [contactInfo] = useState({
    email: 'teacher@example.com',
    phone: '+1 (555) 123-4567',
    organization: 'Riverdale Middle School',
    location: 'Denver, CO',
  })

  const [preferences] = useState({
    lessonFormat: 'Teacher-friendly text',
    defaultGrade: '6th Grade',
    preferredSubjects: ['Science', 'Mathematics'],
  })

  const notifications = [
    {
      title: 'Templates Library update',
      timestamp: 'Today, 9:12 AM',
      message: 'New cross-curricular STEM units were added to your recommended list.',
    },
    {
      title: 'AI Coach follow-up',
      timestamp: 'Yesterday, 4:37 PM',
      message: 'Download the latest feedback summary for your Grade 6 Forces lesson.',
    },
    {
      title: 'Professional learning reminder',
      timestamp: 'Mon, 10:00 AM',
      message: 'Your AI in the Classroom webinar starts tomorrow at 4 PM.',
    },
  ]

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80"
              alt="Teacher profile"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 rounded-2xl border border-white/60" />
          </div>
          <div className="flex-1 min-w-[240px] space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">Alex Morgan</h1>
            <p className="text-sm text-gray-600">Grade 6 Science & STEM Coordinator</p>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">
              <GraduationCap className="h-4 w-4" />
              Premium Educator Plan
            </div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:border-primary-300 hover:bg-primary-50">
            <PencilLine className="h-4 w-4" />
            Edit profile
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Contact information</h2>
              <button className="text-sm font-medium text-primary-600 hover:text-primary-500">Update</button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{contactInfo.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">School/Organization</p>
                  <p className="text-sm text-gray-600">{contactInfo.organization}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{contactInfo.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Courses & teaching settings</h2>
              <button className="text-sm font-medium text-primary-600 hover:text-primary-500">Manage</button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Active courses</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Grade 6 Science</p>
                      <p className="text-xs text-gray-500">Class 6A, 6B, 6C</p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Active</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Grade 5 Mathematics</p>
                      <p className="text-xs text-gray-500">Class 5A</p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Active</span>
                  </div>
                </div>
                <button className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-500">+ Add course</button>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Important settings</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Auto-save lesson drafts</span>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Default assessment format</span>
                    <span className="text-sm font-medium text-gray-900">Formative</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Preferred lesson duration</span>
                    <span className="text-sm font-medium text-gray-900">45 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Curriculum standards</span>
                    <span className="text-sm font-medium text-gray-900">NGSS, Common Core</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Security & compliance</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Multi-factor authentication is enabled for your account.</span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Last password update: 34 days ago.</span>
              </div>
              <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                Manage security settings
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent notifications</h2>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.title} className="rounded-lg bg-gray-50 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.timestamp}</p>
                  <p className="mt-2 text-sm text-gray-600">{notification.message}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-primary-600">
            <Clock className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-gray-900">Activity timeline</h2>
          </div>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-500">
            View all activity
          </button>
        </div>
        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Shared a new Grade 6 STEM unit with the department</p>
              <p className="text-xs text-gray-500">Today, 8:45 AM</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <FileCheck2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Published a formative assessment for Unit 3</p>
              <p className="text-xs text-gray-500">Yesterday, 3:10 PM</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Received AI coaching recommendations for differentiation</p>
              <p className="text-xs text-gray-500">Mon, 5:30 PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile
