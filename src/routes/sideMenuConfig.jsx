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
  Crown,
  Wrench,
  Home,
  ListChecks,
  ClipboardList,
  FileSpreadsheet,
  Award,
  FolderOpen,
  Upload,
} from 'lucide-react';

const teacherMenu = [
  { path: '/dashboard', text: 'Dashboard', icon: LayoutDashboard },
  {
    path: '/teacher-tools',
    text: 'Teacher Tools',
    icon: Wrench,
    child: [
      { path: '/teacher-tools', text: 'Overview', icon: Home },
      { path: '/teacher-tools/quiz', text: 'Quiz', icon: ListChecks },
      { path: '/teacher-tools/assignment', text: 'Assignment', icon: ClipboardList },
      { path: '/teacher-tools/worksheet', text: 'Worksheet', icon: FileSpreadsheet },
      { path: '/teacher-tools/exams', text: 'Exams', icon: Award },
      { path: '/teacher-tools/templates', text: 'Templates', icon: FileText },
      { path: '/teacher-tools/analytics', text: 'Analytics', icon: BarChart3 },
    ],
  },
  { path: '/templates', text: 'Templates Library', icon: FileText },
  { path: '/worksheets/generate', text: 'Worksheet Generator', icon: ClipboardList, moduleName: 'Worksheet Generator' },
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
      { path: '/administration/reporting', text: 'Reporting', moduleName: 'Reporting', icon: BarChart3, childIcon: BarChart3 },
      { path: '/administration/assessment', text: 'Assessment', moduleName: 'Assessment', icon: ClipboardCheck, childIcon: ClipboardCheck },
      { path: '/admin/content-packs', text: 'Content Management', moduleName: 'Content Management', icon: BookOpen, childIcon: BookOpen },
    ],
  },
  { path: '/history', text: 'History', icon: History },
  { path: '/analytics', text: 'Analytics', icon: BarChart3 },
  { path: '/use-cases', text: 'Explore Use Cases', icon: Lightbulb },
  { path: '/profile', text: 'Profile', icon: User },
  { path: '/subscription', text: 'Subscription', icon: Crown },
  { path: '/settings', text: 'Settings', icon: Settings },
];

const superAdminMenu = [
  {
    path: '/administration',
    text: 'Administration',
    icon: Shield,
    child: [
      { path: '/admin/content-packs', text: 'Content Management', moduleName: 'Content Management', icon: BookOpen, childIcon: BookOpen },
    ],
  },
  { path: '/profile', text: 'Profile', icon: User },
  { path: '/settings', text: 'Settings', icon: Settings },
];

const orgAdminMenu = [
  { path: '/organization', text: 'Organization', icon: Building2 },
  {
    path: '/admin/content-packs',
    text: 'Content Management',
    icon: BookOpen,
    child: [
      { path: '/admin/content-packs', text: 'Content Packs', moduleName: 'Content Packs', icon: FolderOpen, childIcon: FolderOpen },
      { path: '/admin/documents', text: 'Documents', moduleName: 'Documents', icon: FileText, childIcon: FileText },
      { path: '/admin/documents/upload', text: 'Upload Document', moduleName: 'Upload Document', icon: Upload, childIcon: Upload },
    ],
  },
  { path: '/profile', text: 'Profile', icon: User },
  { path: '/settings', text: 'Settings', icon: Settings },
];

const schoolAdminMenu = [
  { path: '/school', text: 'School', icon: School },
  {
    path: '/admin/content-packs',
    text: 'Content Management',
    icon: BookOpen,
    child: [
      { path: '/admin/content-packs', text: 'Content Packs', moduleName: 'Content Packs', icon: FolderOpen, childIcon: FolderOpen },
      { path: '/admin/documents', text: 'Documents', moduleName: 'Documents', icon: FileText, childIcon: FileText },
      { path: '/admin/documents/upload', text: 'Upload Document', moduleName: 'Upload Document', icon: Upload, childIcon: Upload },
    ],
  },
  { path: '/profile', text: 'Profile', icon: User },
  { path: '/settings', text: 'Settings', icon: Settings },
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
