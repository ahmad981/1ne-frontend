import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useStoreData } from '../../../hooks/useStoreData';
import { logoutUser } from '../../../redux/features/auth/authSlice';
import {
  Bell,
  Mail,
  User,
  Settings,
  ChevronDown,
  LogOut,
  Coins,
  Zap,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';

export const Header = ({ sideMenuOpen, setSideMenuOpen }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [messagesDropdownOpen, setMessagesDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const messagesTimeoutRef = useRef(null);
  const notificationsTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useStoreData();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // Get user display name and email
  const userName = user?.first_name || user?.name || 'User';
  const userEmail = user?.email || '';

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-6 h-6 text-primary-600" />
          <span className="font-bold text-lg text-gray-900">Teacher Assistant</span>
        </div>
        <button
          onClick={() => setSideMenuOpen(!sideMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sideMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-gray-200 z-30 pt-0 lg:pt-0">
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
              clearTimeout(messagesTimeoutRef.current);
            }
            messagesTimeoutRef.current = setTimeout(() => {
              setMessagesDropdownOpen(true);
            }, 200);
          }}
          onMouseLeave={() => {
            if (messagesTimeoutRef.current) {
              clearTimeout(messagesTimeoutRef.current);
            }
            messagesTimeoutRef.current = setTimeout(() => {
              setMessagesDropdownOpen(false);
            }, 300);
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
              clearTimeout(notificationsTimeoutRef.current);
            }
            notificationsTimeoutRef.current = setTimeout(() => {
              setNotificationsDropdownOpen(true);
            }, 200);
          }}
          onMouseLeave={() => {
            if (notificationsTimeoutRef.current) {
              clearTimeout(notificationsTimeoutRef.current);
            }
            notificationsTimeoutRef.current = setTimeout(() => {
              setNotificationsDropdownOpen(false);
            }, 300);
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

        {/* Profile Dropdown */}
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
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/profile');
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Profile</span>
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  handleLogout();
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
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/profile');
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Profile</span>
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  handleLogout();
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
    </>
  );
};

