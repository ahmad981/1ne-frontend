// Library import
import { Navigate } from 'react-router-dom';

// Local import
import { Layout } from '../components/Shared';
import { isAuthenticatedUser } from '../utils/utils';
import Login from '../panels/Authentication/Login';
import Signup from '../panels/Authentication/SignUp';
import ForgotPassword from '../panels/Authentication/ForgotPassword';
import DashboardHome from '../panels/UserPanel/Dashboard/DashboardHome';
import TeacherDashboard from '../panels/UserPanel/Teacher/Dashboard';

// Import Teacher modules
import TemplatesLibrary from '../panels/UserPanel/Teacher/TemplatesLibrary';
import TemplateRunner from '../panels/UserPanel/Teacher/TemplatesLibrary/TemplateRunner';
import GeneralLessonPlanner from '../panels/UserPanel/Teacher/TemplatesLibrary/GeneralLessonPlanner';
import StemActivityGenerator from '../panels/UserPanel/Teacher/TemplatesLibrary/StemActivityGenerator';
import ProjectBasedLearningPlanner from '../panels/UserPanel/Teacher/TemplatesLibrary/ProjectBasedLearningPlanner';
import SummativeAssessmentBuilder from '../panels/UserPanel/Teacher/TemplatesLibrary/SummativeAssessmentBuilder';
import FormativeAssessmentGenerator from '../panels/UserPanel/Teacher/TemplatesLibrary/FormativeAssessmentGenerator';
import BehaviourPlanBuilder from '../panels/UserPanel/Teacher/TemplatesLibrary/BehaviourPlanBuilder';
import IcebreakerIdeaGenerator from '../panels/UserPanel/Teacher/TemplatesLibrary/IcebreakerIdeaGenerator';
import ActivityPlanner from '../panels/UserPanel/Teacher/TemplatesLibrary/ActivityPlanner';
import NewsletterArticleGenerator from '../panels/UserPanel/Teacher/TemplatesLibrary/NewsletterArticleGenerator';
import MultiLessonPlanner from '../panels/UserPanel/Teacher/TemplatesLibrary/MultiLessonPlanner';
import RealWorldMathProblemGenerator from '../panels/UserPanel/Teacher/TemplatesLibrary/RealWorldMathProblemGenerator';
import MathGameBuilder from '../panels/UserPanel/Teacher/TemplatesLibrary/MathGameBuilder';
import BudgetMasterChallenge from '../panels/UserPanel/Teacher/TemplatesLibrary/BudgetMasterChallenge';
import ExperimentIdeaGenerator from '../panels/UserPanel/Teacher/TemplatesLibrary/ExperimentIdeaGenerator';
import LearningIntentionBreakdown from '../panels/UserPanel/Teacher/TemplatesLibrary/LearningIntentionBreakdown';
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
import ExploreUseCases from '../panels/UserPanel/Teacher/ExploreUseCases';

// Common routes (accessible to all authenticated users)
export const commonRoutes = [
  {
    path: '/',
    moduleName: 'Base',
    element: <Navigate to='/dashboard' replace />,
  },
  {
    path: '/dashboard',
    moduleName: 'Dashboard',
    element: (
      <Layout>
        <TeacherDashboard />
      </Layout>
    ),
  },
  {
    path: '/settings',
    moduleName: 'Settings',
    element: (
      <Layout>
        <TeacherDashboard />
      </Layout>
    ),
  },
];

// Teacher-specific routes
export const teacherRoutes = [
  {
    path: '/templates',
    moduleName: 'Templates Library',
    element: (
      <Layout>
        <TemplatesLibrary />
      </Layout>
    ),
    child: [
      {
        path: '/templates/:slug',
        moduleName: 'Template Runner',
        element: (
          <Layout>
            <TemplateRunner />
          </Layout>
        ),
      },
      {
        path: '/templates/general-lesson-planner',
        moduleName: 'General Lesson Planner',
        element: (
          <Layout>
            <GeneralLessonPlanner />
          </Layout>
        ),
      },
      {
        path: '/templates/stem-activity-generator',
        moduleName: 'STEM Activity Generator',
        element: (
          <Layout>
            <StemActivityGenerator />
          </Layout>
        ),
      },
      {
        path: '/templates/project-based-learning-planner',
        moduleName: 'Project Based Learning Planner',
        element: (
          <Layout>
            <ProjectBasedLearningPlanner />
          </Layout>
        ),
      },
      {
        path: '/templates/summative-assessment-builder',
        moduleName: 'Summative Assessment Builder',
        element: (
          <Layout>
            <SummativeAssessmentBuilder />
          </Layout>
        ),
      },
      {
        path: '/templates/formative-assessment-generator',
        moduleName: 'Formative Assessment Generator',
        element: (
          <Layout>
            <FormativeAssessmentGenerator />
          </Layout>
        ),
      },
      {
        path: '/templates/behaviour-plan-builder',
        moduleName: 'Behaviour Plan Builder',
        element: (
          <Layout>
            <BehaviourPlanBuilder />
          </Layout>
        ),
      },
      {
        path: '/templates/icebreaker-idea-generator',
        moduleName: 'Icebreaker Idea Generator',
        element: (
          <Layout>
            <IcebreakerIdeaGenerator />
          </Layout>
        ),
      },
      {
        path: '/templates/activity-planner',
        moduleName: 'Activity Planner',
        element: (
          <Layout>
            <ActivityPlanner />
          </Layout>
        ),
      },
      {
        path: '/templates/newsletter-article-generator',
        moduleName: 'Newsletter Article Generator',
        element: (
          <Layout>
            <NewsletterArticleGenerator />
          </Layout>
        ),
      },
      {
        path: '/templates/multi-lesson-planner',
        moduleName: 'Multi Lesson Planner',
        element: (
          <Layout>
            <MultiLessonPlanner />
          </Layout>
        ),
      },
      {
        path: '/templates/real-world-math-problem-generator',
        moduleName: 'Real World Math Problem Generator',
        element: (
          <Layout>
            <RealWorldMathProblemGenerator />
          </Layout>
        ),
      },
      {
        path: '/templates/math-game-builder',
        moduleName: 'Math Game Builder',
        element: (
          <Layout>
            <MathGameBuilder />
          </Layout>
        ),
      },
      {
        path: '/templates/budget-master-challenge',
        moduleName: 'Budget Master Challenge',
        element: (
          <Layout>
            <BudgetMasterChallenge />
          </Layout>
        ),
      },
      {
        path: '/templates/experiment-idea-generator',
        moduleName: 'Experiment Idea Generator',
        element: (
          <Layout>
            <ExperimentIdeaGenerator />
          </Layout>
        ),
      },
      {
        path: '/templates/learning-intention-breakdown',
        moduleName: 'Learning Intention Breakdown',
        element: (
          <Layout>
            <LearningIntentionBreakdown />
          </Layout>
        ),
      },
    ],
  },
  {
    path: '/chatbots',
    moduleName: 'Specialized Chatbots',
    element: (
      <Layout>
        <SpecializedChatbots />
      </Layout>
    ),
    child: [
      {
        path: '/chatbots/core-academics',
        moduleName: 'Core Academics Showcase',
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
    moduleName: 'YouTube Quiz Generator',
    element: (
      <Layout>
        <YouTubeQuizGenerator />
      </Layout>
    ),
    child: [
      {
        path: '/youtube-quiz/results',
        moduleName: 'Quiz Results',
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
    moduleName: 'PixGen (AI Media Studio)',
    element: (
      <Layout>
        <PixGen />
      </Layout>
    ),
  },
  {
    path: '/learning-hub',
    moduleName: 'Professional Learning Hub',
    element: (
      <Layout>
        <ProfessionalLearningHub />
      </Layout>
    ),
  },
  {
    path: '/personalization',
    moduleName: 'Personalization',
    element: (
      <Layout>
        <Personalization />
      </Layout>
    ),
  },
  {
    path: '/administration',
    moduleName: 'Administration',
    element: (
      <Layout>
        <Reporting />
      </Layout>
    ),
    child: [
      {
        path: '/administration/reporting',
        moduleName: 'Reporting',
        element: (
          <Layout>
            <Reporting />
          </Layout>
        ),
      },
      {
        path: '/administration/assessment',
        moduleName: 'Assessment',
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
    moduleName: 'History',
    element: (
      <Layout>
        <History />
      </Layout>
    ),
  },
  {
    path: '/analytics',
    moduleName: 'Analytics',
    element: (
      <Layout>
        <Analytics />
      </Layout>
    ),
  },
  {
    path: '/use-cases',
    moduleName: 'Explore Use Cases',
    element: (
      <Layout>
        <ExploreUseCases />
      </Layout>
    ),
  },
];

// Principal-specific routes (to be implemented)
export const principalRoutes = [];

// Student-specific routes (to be implemented)
export const studentRoutes = [];

// Parent-specific routes (to be implemented)
export const parentRoutes = [];

// Auth routes
export const authRoutes = [
  {
    path: '/',
    moduleName: 'Base',
    element: isAuthenticatedUser() ? (
      <Navigate to='/dashboard' replace />
    ) : (
      <Navigate to='/login' replace />
    ),
  },
  {
    path: '/login',
    moduleName: 'Login',
    element: <Login />,
  },
  {
    path: '/signup',
    moduleName: 'Signup',
    element: <Signup />,
  },
  {
    path: '/forgot-password',
    moduleName: 'Forgot password',
    element: <ForgotPassword />,
  },
  {
    path: '*',
    element: isAuthenticatedUser() ? (
      <Navigate to='/dashboard' replace />
    ) : (
      <Navigate to='/login' replace />
    ),
  },
];
