// Library import
import React from 'react';

// Local imports
import { Layout } from '../components/Shared';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Youtube,
  Image,
  BookOpen,
  History as HistoryIcon,
  User,
  Settings,
  Shield,
  BarChart3,
  ClipboardCheck,
} from 'lucide-react';
import TeacherDashboard from '../panels/UserPanel/Teacher/Dashboard';
import TemplatesLibrary from '../panels/UserPanel/Teacher/TemplatesLibrary';
import SpecializedChatbots from '../panels/UserPanel/Teacher/SpecializedChatbots';
import CoreAcademicsShowcase from '../panels/UserPanel/Teacher/SpecializedChatbots/CoreAcademicsShowcase';
import YouTubeQuizGenerator from '../panels/UserPanel/Teacher/YouTubeQuiz';
import QuizResults from '../panels/UserPanel/Teacher/YouTubeQuiz/QuizResults';
import PixGen from '../panels/UserPanel/Teacher/PixGen';
import ProfessionalLearningHub from '../panels/UserPanel/Teacher/ProfessionalLearningHub';
import History from '../panels/UserPanel/Teacher/History';
import Personalization from '../panels/UserPanel/Teacher/Personalization';
import Analytics from '../panels/UserPanel/Teacher/Analytics';
import Reporting from '../panels/UserPanel/Teacher/Administration/Reporting';
import Assessment from '../panels/UserPanel/Teacher/Administration/Assessment';

// SIDEMENU ROUTES - Role-based menu configuration
export const sideMenuRoutes = (role) => {
  // Default to teacher role if not specified
  const userRole = role || 'teacher';
  
  // Teacher menu routes
  if (userRole === 'teacher' || userRole === 'TEACHER') {
    return [
      {
        path: '/dashboard',
        text: 'Dashboard',
        icon: <LayoutDashboard height={19} width={19} />,
        element: (
          <Layout>
            <TeacherDashboard />
          </Layout>
        ),
      },
      {
        path: '/templates',
        text: 'Templates Library',
        icon: <FileText height={19} width={19} />,
        element: (
          <Layout>
            <TemplatesLibrary />
          </Layout>
        ),
        child: [
          {
            path: '/templates/core-academics',
            moduleName: 'Core Academics',
            childIcon: <FileText height={18} width={18} />,
            element: (
              <Layout>
                <CoreAcademicsShowcase />
              </Layout>
            ),
          },
        ],
      },
      {
        path: '/chatbots',
        text: 'Specialized Chatbots',
        icon: <MessageSquare height={19} width={19} />,
        element: (
          <Layout>
            <SpecializedChatbots />
          </Layout>
        ),
        child: [
          {
            path: '/chatbots/core-academics',
            moduleName: 'Core Academics',
            childIcon: <MessageSquare height={18} width={18} />,
            element: (
              <Layout>
                <CoreAcademicsShowcase />
              </Layout>
            ),
          },
        ],
      },
      {
        path: '/youtube-quiz',
        text: 'YouTube Quiz Generator',
        icon: <Youtube height={19} width={19} />,
        element: (
          <Layout>
            <YouTubeQuizGenerator />
          </Layout>
        ),
        child: [
          {
            path: '/youtube-quiz/results',
            moduleName: 'Quiz Results',
            childIcon: <Youtube height={18} width={18} />,
            element: (
              <Layout>
                <QuizResults />
              </Layout>
            ),
          },
        ],
      },
      {
        path: '/pixgen',
        text: 'PixGen (AI Media Studio)',
        icon: <Image height={19} width={19} />,
        element: (
          <Layout>
            <PixGen />
          </Layout>
        ),
      },
      {
        path: '/learning-hub',
        text: 'Professional Learning Hub',
        icon: <BookOpen height={19} width={19} />,
        element: (
          <Layout>
            <ProfessionalLearningHub />
          </Layout>
        ),
      },
      {
        path: '/personalization',
        text: 'Personalization',
        icon: <Settings height={19} width={19} />,
        element: (
          <Layout>
            <Personalization />
          </Layout>
        ),
      },
      {
        path: '/administration',
        text: 'Administration',
        icon: <Shield height={19} width={19} />,
        element: (
          <Layout>
            <Reporting />
          </Layout>
        ),
        child: [
          {
            path: '/administration/reporting',
            moduleName: 'Reporting',
            childIcon: <BarChart3 height={18} width={18} />,
            element: (
              <Layout>
                <Reporting />
              </Layout>
            ),
          },
          {
            path: '/administration/assessment',
            moduleName: 'Assessment',
            childIcon: <ClipboardCheck height={18} width={18} />,
            element: (
              <Layout>
                <Assessment />
              </Layout>
            ),
          },
        ],
      },
      {
        path: '/history',
        text: 'History',
        icon: <HistoryIcon height={19} width={19} />,
        element: (
          <Layout>
            <History />
          </Layout>
        ),
      },
      {
        path: '/analytics',
        text: 'Analytics',
        icon: <BarChart3 height={19} width={19} />,
        element: (
          <Layout>
            <Analytics />
          </Layout>
        ),
      },
      {
        path: '/profile',
        text: 'Profile',
        icon: <User height={19} width={19} />,
        element: (
          <Layout>
            <TeacherDashboard />
          </Layout>
        ),
      },
      {
        path: '/settings',
        text: 'Settings',
        icon: <Settings height={19} width={19} />,
        element: (
          <Layout>
            <TeacherDashboard />
          </Layout>
        ),
      },
    ];
  }
  
  // Principal menu routes (to be implemented)
  if (userRole === 'principal' || userRole === 'PRINCIPAL') {
    return [
      {
        path: '/dashboard',
        text: 'Dashboard',
        icon: <LayoutDashboard height={19} width={19} />,
        element: (
          <Layout>
            <TeacherDashboard /> {/* Placeholder */}
          </Layout>
        ),
      },
    ];
  }
  
  // Student menu routes (to be implemented)
  if (userRole === 'student' || userRole === 'STUDENT') {
    return [
      {
        path: '/dashboard',
        text: 'Dashboard',
        icon: <LayoutDashboard height={19} width={19} />,
        element: (
          <Layout>
            <TeacherDashboard /> {/* Placeholder */}
          </Layout>
        ),
      },
    ];
  }
  
  // Parent menu routes (to be implemented)
  if (userRole === 'parent' || userRole === 'PARENT') {
    return [
      {
        path: '/dashboard',
        text: 'Dashboard',
        icon: <LayoutDashboard height={19} width={19} />,
        element: (
          <Layout>
            <TeacherDashboard /> {/* Placeholder */}
          </Layout>
        ),
      },
    ];
  }
  
  // Default fallback (teacher routes)
  return [
    {
      path: '/dashboard',
      text: 'Dashboard',
      icon: <LayoutDashboard height={19} width={19} />,
      element: (
        <Layout>
          <TeacherDashboard />
        </Layout>
      ),
    },
  ];
};
