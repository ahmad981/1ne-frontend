// Library imports
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Youtube,
  Image,
  BookOpen,
  History,
  User,
  Settings,
  Shield,
  BarChart3,
  ClipboardCheck,
  Building2,
  School,
  GraduationCap,
  Users,
  Lightbulb,
} from 'lucide-react';

const teacherMenu = [
  { path: '/dashboard', text: 'Dashboard', icon: LayoutDashboard },
  { path: '/templates', text: 'Templates Library', icon: FileText },
  { path: '/chatbots', text: 'Specialized Chatbots', icon: MessageSquare },
  { path: '/youtube-quiz', text: 'YouTube Quiz Generator', icon: Youtube },
  { path: '/pixgen', text: 'PixGen (AI Media Studio)', icon: Image },
  { path: '/learning-hub', text: 'Professional Learning Hub', icon: BookOpen },
  { path: '/personalization', text: 'Personalization', icon: Settings },
  {
    path: '/administration',
    text: 'Administration',
    icon: Shield,
    child: [
      { path: '/administration/reporting', text: 'Reporting', icon: BarChart3 },
      { path: '/administration/assessment', text: 'Assessment', icon: ClipboardCheck },
    ],
  },
  { path: '/history', text: 'History', icon: History },
  { path: '/analytics', text: 'Analytics', icon: BarChart3 },
  { path: '/use-cases', text: 'Explore Use Cases', icon: Lightbulb },
  { path: '/profile', text: 'Profile', icon: User },
  { path: '/settings', text: 'Settings', icon: Settings },
];

const superAdminMenu = [
  { path: '/administration', text: 'Administration', icon: Shield },
  { path: '/profile', text: 'Profile', icon: User },
  { path: '/settings', text: 'Settings', icon: Settings },
];

const orgAdminMenu = [
  { path: '/organization', text: 'Organization', icon: Building2 },
];

const schoolAdminMenu = [
  { path: '/school', text: 'School', icon: School },
];

const studentMenu = [
  { path: '/student', text: 'Student', icon: GraduationCap },
];

const parentMenu = [
  { path: '/parent', text: 'Parent', icon: Users },
];

export const sideMenuRoutes = (role) => {
  switch (role) {
    case 'super_admin':
      return superAdminMenu;
    case 'org_admin':
      return orgAdminMenu;
    case 'school_admin':
      return schoolAdminMenu;
    case 'teacher':
      return teacherMenu;
    case 'student':
      return studentMenu;
    case 'parent':
      return parentMenu;
    default:
      return [];
  }
};
