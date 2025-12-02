import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Youtube,
  Image,
  BookOpen,
  History,
  Menu,
  X,
  LogOut,
  GraduationCap,
  User,
  Settings,
  ChevronDown,
  Lightbulb,
  Bell,
  Mail,
  Shield,
  BarChart3,
  ClipboardCheck,
  ChevronRight,
  Coins,
  Zap,
} from 'lucide-react'

type MenuItem = {
  path: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  iconColor: string
  iconBg: string
  subItems?: {
    path: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }[]
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [messagesDropdownOpen, setMessagesDropdownOpen] = useState(false)
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false)
  const messagesTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const notificationsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems: MenuItem[] = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      iconColor: 'text-primary-600',
      iconBg: 'bg-primary-50',
    },
    {
      path: '/dashboard/templates',
      icon: FileText,
      label: 'Templates Library',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      path: '/dashboard/chatbots',
      icon: MessageSquare,
      label: 'Specialized Chatbots',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      path: '/dashboard/youtube-quiz',
      icon: Youtube,
      label: 'YouTube Quiz Generator',
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
    },
    {
      path: '/dashboard/pixgen',
      icon: Image,
      label: 'PixGen (AI Media Studio)',
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50',
    },
    {
      path: '/dashboard/learning-hub',
      icon: BookOpen,
      label: 'Professional Learning Hub',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
    {
      path: '/dashboard/personalization',
      icon: Settings,
      label: 'Personalization',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
    },
    {
      path: '/dashboard/administration',
      icon: Shield,
      label: 'Administration',
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      subItems: [
        {
          path: '/dashboard/administration/reporting',
          label: 'Reporting',
          icon: BarChart3,
        },
        {
          path: '/dashboard/administration/assessment',
          label: 'Assessment',
          icon: ClipboardCheck,
        },
      ],
    },
    {
      path: '/dashboard/history',
      icon: History,
      label: 'History',
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-50',
    },
    {
      path: '/dashboard/profile',
      icon: User,
      label: 'Profile',
      iconColor: 'text-pink-500',
      iconBg: 'bg-pink-50',
    },
    {
      path: '/dashboard/settings',
      icon: Settings,
      label: 'Settings',
      iconColor: 'text-gray-600',
      iconBg: 'bg-gray-100',
    },
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  const toggleSubMenu = (path: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  // Auto-expand menu if on a sub-page
  useEffect(() => {
    const expanded: Record<string, boolean> = {}
    menuItems.forEach((item) => {
      if (item.subItems) {
        const isOnSubPage = item.subItems.some((subItem) => location.pathname.startsWith(subItem.path))
        if (isOnSubPage) {
          expanded[item.path] = true
        }
      }
    })
    setExpandedMenus((prev) => ({ ...prev, ...expanded }))
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-6 h-6 text-primary-600" />
          <span className="font-bold text-lg text-gray-900">Teacher Assistant</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 bg-white border-r border-gray-200
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900 hidden lg:block">
                Teacher Assistant
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              const hasSubItems = item.subItems && item.subItems.length > 0
              const isExpanded = expandedMenus[item.path] || false

              if (hasSubItems) {
                return (
                  <div key={item.path}>
                    <button
                      onClick={() => toggleSubMenu(item.path)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                        ${
                          active
                            ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200 ${
                            active ? 'bg-primary-100 text-primary-600' : `${item.iconBg} ${item.iconColor}`
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                        {item.subItems?.map((subItem) => {
                          const SubIcon = subItem.icon
                          const subActive = isActive(subItem.path)
                          return (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`
                                flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200
                                ${
                                  subActive
                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }
                              `}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span className="text-sm">{subItem.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      active
                        ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200 ${
                      active ? 'bg-primary-100 text-primary-600' : `${item.iconBg} ${item.iconColor}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top Header Bar with Profile Dropdown */}
        <div className="hidden lg:block fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 z-30">
          <div className="h-full px-6 flex items-center justify-end gap-4">
            {/* Token Counter */}
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                  <Coins className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-gray-600">Tokens</span>
                    <Zap className="h-3 w-3 text-amber-500" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-gray-900">12,450</span>
                    <span className="text-xs text-gray-500">/ 50,000</span>
                  </div>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-300 mx-1" />
              <div className="flex items-center gap-1">
                <div className="h-2 w-20 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                    style={{ width: '25%' }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600">25%</span>
              </div>
            </div>

            {/* Messages Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (messagesTimeoutRef.current) {
                  clearTimeout(messagesTimeoutRef.current)
                }
                messagesTimeoutRef.current = setTimeout(() => {
                  setMessagesDropdownOpen(true)
                }, 200)
              }}
              onMouseLeave={() => {
                if (messagesTimeoutRef.current) {
                  clearTimeout(messagesTimeoutRef.current)
                }
                messagesTimeoutRef.current = setTimeout(() => {
                  setMessagesDropdownOpen(false)
                }, 300)
              }}
            >
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-primary-200 hover:text-primary-600">
                <Mail className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-semibold text-white">
                  3
                </span>
              </button>

              {/* Messages Dropdown Menu */}
              {messagesDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Messages</h3>
                      <span className="text-xs text-gray-500">3 new</span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[
                      {
                        id: 1,
                        sender: 'Sarah Johnson',
                        preview: 'Thanks for sharing the lesson plan template!',
                        time: '2 min ago',
                        unread: true,
                      },
                      {
                        id: 2,
                        sender: 'Michael Chen',
                        preview: 'Can we schedule a meeting to discuss the assessment?',
                        time: '1 hour ago',
                        unread: true,
                      },
                      {
                        id: 3,
                        sender: 'Emily Davis',
                        preview: 'The new chatbot feature looks great!',
                        time: '3 hours ago',
                        unread: true,
                      },
                    ].map((message) => (
                      <button
                        key={message.id}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                            <span className="text-xs font-semibold">
                              {message.sender.split(' ').map((n) => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {message.sender}
                              </p>
                              {message.unread && (
                                <span className="flex h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-1">{message.preview}</p>
                            <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <button className="w-full text-center text-sm font-semibold text-primary-600 hover:text-primary-500">
                      View all messages
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (notificationsTimeoutRef.current) {
                  clearTimeout(notificationsTimeoutRef.current)
                }
                notificationsTimeoutRef.current = setTimeout(() => {
                  setNotificationsDropdownOpen(true)
                }, 200)
              }}
              onMouseLeave={() => {
                if (notificationsTimeoutRef.current) {
                  clearTimeout(notificationsTimeoutRef.current)
                }
                notificationsTimeoutRef.current = setTimeout(() => {
                  setNotificationsDropdownOpen(false)
                }, 300)
              }}
            >
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-primary-200 hover:text-primary-600">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-semibold text-white">
                  5
                </span>
              </button>

              {/* Notifications Dropdown Menu */}
              {notificationsDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <span className="text-xs text-gray-500">5 new</span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[
                      {
                        id: 1,
                        type: 'success',
                        title: 'Quiz Generated Successfully',
                        message: 'Your YouTube quiz has been generated and is ready to use.',
                        time: '5 min ago',
                        unread: true,
                      },
                      {
                        id: 2,
                        type: 'info',
                        title: 'New Template Available',
                        message: 'A new STEM activity template has been added to the library.',
                        time: '1 hour ago',
                        unread: true,
                      },
                      {
                        id: 3,
                        type: 'warning',
                        title: 'Token Usage Alert',
                        message: 'You have used 80% of your monthly token allocation.',
                        time: '2 hours ago',
                        unread: true,
                      },
                      {
                        id: 4,
                        type: 'info',
                        title: 'Assessment Completed',
                        message: 'Quarterly Performance Review has been completed by all students.',
                        time: '3 hours ago',
                        unread: true,
                      },
                      {
                        id: 5,
                        type: 'success',
                        title: 'Report Generated',
                        message: 'Your monthly usage report is ready for download.',
                        time: '1 day ago',
                        unread: true,
                      },
                    ].map((notification) => (
                      <button
                        key={notification.id}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                              notification.type === 'success'
                                ? 'bg-green-100 text-green-600'
                                : notification.type === 'warning'
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            <Bell className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                              {notification.unread && (
                                <span className="flex h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <button className="w-full text-center text-sm font-semibold text-primary-600 hover:text-primary-500">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div
              className="relative"
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <button className="flex items-center space-x-3 rounded-xl px-3 py-2 transition hover:bg-primary-50/40">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <ChevronDown className="w-4 h-4 text-primary-500" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      // TODO: Navigate to profile page
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      // TODO: Navigate to settings page
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      handleLogout()
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Profile Button */}
        <div className="lg:hidden fixed top-3 right-4 z-50">
          <div
            className="relative"
            onMouseEnter={() => setProfileDropdownOpen(true)}
            onMouseLeave={() => setProfileDropdownOpen(false)}
          >
            <div className="mb-3 flex items-center justify-end gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-primary-200 hover:text-primary-600">
                <Mail className="h-5 w-5" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-primary-200 hover:text-primary-600">
                <Bell className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="h-11 w-11 overflow-hidden rounded-full"
            >
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </button>

            {/* Mobile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>

                {/* Menu Items */}
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false)
                    // TODO: Navigate to profile page
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false)
                    // TODO: Navigate to settings page
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <main className="pt-20 lg:pt-24 px-6 lg:px-8">{children}</main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}

export default DashboardLayout

