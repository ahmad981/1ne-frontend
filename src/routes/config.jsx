// Library import
import { Navigate } from 'react-router-dom';

// Local import
import { RoleBasedRedirect } from './routeHelpers';
import { Login } from '../panels/Authentication/Login';
import { SignUp } from '../panels/Authentication/SignUp';
import SignupEntry from '../pages/auth/SignupEntry';
import IndividualSignup from '../pages/auth/IndividualSignup';
import InstitutionAdminSignup from '../pages/auth/InstitutionAdminSignup';
import OrganizationAdminSignup from '../pages/auth/OrganizationAdminSignup';
import { ForgotPassword } from '../panels/Authentication/ForgotPassword';
import { ResetPassword } from '../panels/Authentication/ResetPassword';
import { VerifyEmail } from '../panels/Authentication/VerifyEmail';
import DashboardLayout from '../components/DashboardLayout';
import { ComingSoon } from '../components/shared/ComingSoon';

// Page imports
import DashboardHome from '../pages/DashboardHome';
import TemplatesLibrary from '../pages/features/TemplatesLibrary';
import TemplateRunner from '../pages/features/TemplateRunner';
import GeneralLessonPlanner from '../pages/features/GeneralLessonPlanner';
import StemActivityGenerator from '../pages/features/StemActivityGenerator';
import ProjectBasedLearningPlanner from '../pages/features/ProjectBasedLearningPlanner';
import SummativeAssessmentBuilder from '../pages/features/SummativeAssessmentBuilder';
import FormativeAssessmentGenerator from '../pages/features/FormativeAssessmentGenerator';
import BehaviourPlanBuilder from '../pages/features/BehaviourPlanBuilder';
import IcebreakerIdeaGenerator from '../pages/features/IcebreakerIdeaGenerator';
import ActivityPlanner from '../pages/features/ActivityPlanner';
import NewsletterArticleGenerator from '../pages/features/NewsletterArticleGenerator';
import MultiLessonPlanner from '../pages/features/MultiLessonPlanner';
import RealWorldMathProblemGenerator from '../pages/features/RealWorldMathProblemGenerator';
import MathGameBuilder from '../pages/features/MathGameBuilder';
import BudgetMasterChallenge from '../pages/features/BudgetMasterChallenge';
import ExperimentIdeaGenerator from '../pages/features/ExperimentIdeaGenerator';
import LearningIntentionBreakdown from '../pages/features/LearningIntentionBreakdown';
import SpecializedChatbots from '../pages/features/SpecializedChatbots';
import GeneralTeachingAssistantChat from '../pages/features/GeneralTeachingAssistantChat';
import GPT4TeachingAssistantChat from '../pages/features/GPT4TeachingAssistantChat';
import ClaudeEducationProChat from '../pages/features/ClaudeEducationProChat';
import GeminiEducationSuiteChat from '../pages/features/GeminiEducationSuiteChat';
import CodingProgrammingTutor from '../pages/features/CodingProgrammingTutor';
import VisualArtsStudioAssistant from '../pages/features/VisualArtsStudioAssistant';
import BusinessStudiesMentor from '../pages/features/BusinessStudiesMentor';
import CareerReadinessCoach from '../pages/features/CareerReadinessCoach';
import LabSafetyProtocolAdvisor from '../pages/features/LabSafetyProtocolAdvisor';
import EnvironmentalScienceGuide from '../pages/features/EnvironmentalScienceGuide';
import MusicPerformanceCoach from '../pages/features/MusicPerformanceCoach';
import DramaTheaterDirector from '../pages/features/DramaTheaterDirector';
import DigitalLiteracyAdvisor from '../pages/features/DigitalLiteracyAdvisor';
import AIMachineLearningEducator from '../pages/features/AIMachineLearningEducator';
import MarketingBrandingStrategist from '../pages/features/MarketingBrandingStrategist';
import LiteracyLabCoach from '../pages/features/LiteracyLabCoach';
import LiteratureAnalysisExpert from '../pages/features/LiteratureAnalysisExpert';
import GrammarWritingMentor from '../pages/features/GrammarWritingMentor';
import AdaptiveMathStrategist from '../pages/features/AdaptiveMathStrategist';
import AlgebraGeometryTutor from '../pages/features/AlgebraGeometryTutor';
import STEMInquiryMentor from '../pages/features/STEMInquiryMentor';
import ProblemSolvingCoach from '../pages/features/ProblemSolvingCoach';
import { AdvancedKnowledgeSkillsCoach } from '../pages/features/AdvancedKnowledgeSkillsCoach';
import UNECAcademicDevelopment from '../pages/features/UNECAcademicDevelopment';
import YouTubeQuizGenerator from '../pages/features/YouTubeQuizGenerator';
import QuizResults from '../pages/features/QuizResults';
import PixGen from '../pages/features/PixGen';
import ProfessionalLearningHub from '../pages/features/ProfessionalLearningHub';
import ClassroomManagementCourse from '../pages/features/ClassroomManagementCourse';
import AssessmentStrategiesCourse from '../pages/features/AssessmentStrategiesCourse';
import DifferentiationCourse from '../pages/features/DifferentiationCourse';
import StudentEngagementCourse from '../pages/features/StudentEngagementCourse';
import DigitalLiteracyCourse from '../pages/features/DigitalLiteracyCourse';
import DifferentiationTutorial from '../pages/features/DifferentiationTutorial';
import LessonPlannerTutorial from '../pages/features/LessonPlannerTutorial';
import AssessmentTutorial from '../pages/features/AssessmentTutorial';
import BloomsTaxonomyResearch from '../pages/features/BloomsTaxonomyResearch';
import EvidenceBasedTeachingResearch from '../pages/features/EvidenceBasedTeachingResearch';
import AssessmentResearch from '../pages/features/AssessmentResearch';
import SELBehaviorResearch from '../pages/features/SELBehaviorResearch';
import GrowthMindsetResearch from '../pages/features/GrowthMindsetResearch';
import CognitiveLoadTheoryResearch from '../pages/features/CognitiveLoadTheoryResearch';
import MetacognitionResearch from '../pages/features/MetacognitionResearch';
import ScaffoldingResearch from '../pages/features/ScaffoldingResearch';
import StudentEngagementPath from '../pages/features/StudentEngagementPath';
import AdvancedDifferentiationPath from '../pages/features/AdvancedDifferentiationPath';
import AIAssistedAssessmentPath from '../pages/features/AIAssistedAssessmentPath';
import AIAssessmentIntroModule from '../pages/features/AIAssessmentIntroModule';
import AutomatedRubricsModule from '../pages/features/AutomatedRubricsModule';
import InstantFeedbackModule from '../pages/features/InstantFeedbackModule';
import FormativeAutomationModule from '../pages/features/FormativeAutomationModule';
import SummativeAIDesignModule from '../pages/features/SummativeAIDesignModule';
import TieredInstructionModule from '../pages/features/TieredInstructionModule';
import ContentDifferentiationModule from '../pages/features/ContentDifferentiationModule';
import ProcessDifferentiationModule from '../pages/features/ProcessDifferentiationModule';
import ProductDifferentiationModule from '../pages/features/ProductDifferentiationModule';
import AssessmentDifferentiationModule from '../pages/features/AssessmentDifferentiationModule';
import AdvancedGroupingModule from '../pages/features/AdvancedGroupingModule';
import STEMMasteryCourse from '../pages/features/STEMMasteryCourse';
import LiteracyExpertCourse from '../pages/features/LiteracyExpertCourse';
import NGSSFoundationsModule from '../pages/features/NGSSFoundationsModule';
import EngineeringDesignModule from '../pages/features/EngineeringDesignModule';
import ComputationalThinkingModule from '../pages/features/ComputationalThinkingModule';
import LabSafetyModule from '../pages/features/LabSafetyModule';
import PhenomenaDrivenModule from '../pages/features/PhenomenaDrivenModule';
import DataLiteracyModule from '../pages/features/DataLiteracyModule';
import STEMIntegrationModule from '../pages/features/STEMIntegrationModule';
import NGSSAssessmentModule from '../pages/features/NGSSAssessmentModule';
import GamificationFundamentals from '../pages/features/GamificationFundamentals';
import PointsBadgesLeaderboards from '../pages/features/PointsBadgesLeaderboards';
import InquiryLearningHooks from '../pages/features/InquiryLearningHooks';
import QuestBasedLearning from '../pages/features/QuestBasedLearning';
import CollaborativeGameMechanics from '../pages/features/CollaborativeGameMechanics';
import AdaptiveGamification from '../pages/features/AdaptiveGamification';
import GamifiedAssessment from '../pages/features/GamifiedAssessment';
import AdvancedInquiryFrameworks from '../pages/features/AdvancedInquiryFrameworks';
import History from '../pages/features/History';
import Personalization from '../pages/features/Personalization';
import Analytics from '../pages/features/Analytics';
import Reporting from '../pages/features/Reporting';
import Assessment from '../pages/features/Assessment';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Subscription from '../pages/Subscription';
import ExploreUseCases from '../pages/ExploreUseCases';

import TeacherToolsOverview from '../pages/features/teacher-tools/TeacherToolsOverview';
import QuizList from '../pages/features/teacher-tools/quiz/QuizList';
import QuizCreate from '../pages/features/teacher-tools/quiz/QuizCreate';
import QuizDetail from '../pages/features/teacher-tools/quiz/QuizDetail';
import QuizSubmissions from '../pages/features/teacher-tools/quiz/QuizSubmissions';
import QuizAnalytics from '../pages/features/teacher-tools/quiz/QuizAnalytics';
import AssignmentList from '../pages/features/teacher-tools/assignment/AssignmentList';
import AssignmentCreate from '../pages/features/teacher-tools/assignment/AssignmentCreate';
import AssignmentDetail from '../pages/features/teacher-tools/assignment/AssignmentDetail';
import AssignmentSubmissions from '../pages/features/teacher-tools/assignment/AssignmentSubmissions';
import AssignmentAnalytics from '../pages/features/teacher-tools/assignment/AssignmentAnalytics';
import WorksheetList from '../pages/features/teacher-tools/worksheet/WorksheetList';
import WorksheetCreate from '../pages/features/teacher-tools/worksheet/WorksheetCreate';
import WorksheetDetail from '../pages/features/teacher-tools/worksheet/WorksheetDetail';
import WorksheetResponses from '../pages/features/teacher-tools/worksheet/WorksheetResponses';
import WorksheetAnalytics from '../pages/features/teacher-tools/worksheet/WorksheetAnalytics';
import ExamList from '../pages/features/teacher-tools/exams/ExamList';
import ExamCreate from '../pages/features/teacher-tools/exams/ExamCreate';
import ExamDetail from '../pages/features/teacher-tools/exams/ExamDetail';
import ExamCandidates from '../pages/features/teacher-tools/exams/ExamCandidates';
import ExamResults from '../pages/features/teacher-tools/exams/ExamResults';
import ExamAnalytics from '../pages/features/teacher-tools/exams/ExamAnalytics';
import TeacherToolsTemplates from '../pages/features/teacher-tools/templates/TeacherToolsTemplates';
import TeacherToolsUnifiedAnalytics from '../pages/features/teacher-tools/analytics/TeacherToolsUnifiedAnalytics';

export const commonRoutes = [
  {
    path: '/',
    moduleName: 'Base',
    element: <RoleBasedRedirect />,
  },
  {
    path: '/settings',
    moduleName: 'Settings',
    element: (
      <DashboardLayout>
        <Settings />
      </DashboardLayout>
    ),
  },
  {
    path: '/profile',
    moduleName: 'Profile',
    element: (
      <DashboardLayout>
        <Profile />
      </DashboardLayout>
    ),
  },
  {
    path: '/subscription',
    moduleName: 'Subscription',
    element: (
      <DashboardLayout>
        <Subscription />
      </DashboardLayout>
    ),
  },
];

export const teacherRoutes = [
  {
    path: '/dashboard',
    moduleName: 'Dashboard',
    element: (
      <DashboardLayout>
        <DashboardHome />
      </DashboardLayout>
    ),
  },
  {
    path: '/teacher-tools',
    moduleName: 'Teacher Tools',
    element: (
      <DashboardLayout>
        <TeacherToolsOverview />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/teacher-tools/quiz',
        moduleName: 'Quiz',
        element: (
          <DashboardLayout>
            <QuizList />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/quiz/create',
        moduleName: 'Create Quiz',
        element: (
          <DashboardLayout>
            <QuizCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/quiz/:quizId/edit',
        moduleName: 'Edit Quiz',
        element: (
          <DashboardLayout>
            <QuizCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/quiz/:quizId',
        moduleName: 'Quiz Detail',
        element: (
          <DashboardLayout>
            <QuizDetail />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/quiz/:quizId/submissions',
        moduleName: 'Quiz Submissions',
        element: (
          <DashboardLayout>
            <QuizSubmissions />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/quiz/:quizId/analytics',
        moduleName: 'Quiz Analytics',
        element: (
          <DashboardLayout>
            <QuizAnalytics />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/assignment',
        moduleName: 'Assignment',
        element: (
          <DashboardLayout>
            <AssignmentList />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/assignment/create',
        moduleName: 'Create Assignment',
        element: (
          <DashboardLayout>
            <AssignmentCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/assignment/:assignmentId/edit',
        moduleName: 'Edit Assignment',
        element: (
          <DashboardLayout>
            <AssignmentCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/assignment/:assignmentId',
        moduleName: 'Assignment Detail',
        element: (
          <DashboardLayout>
            <AssignmentDetail />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/assignment/:assignmentId/submissions',
        moduleName: 'Assignment Submissions',
        element: (
          <DashboardLayout>
            <AssignmentSubmissions />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/assignment/:assignmentId/analytics',
        moduleName: 'Assignment Analytics',
        element: (
          <DashboardLayout>
            <AssignmentAnalytics />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/worksheet',
        moduleName: 'Worksheet',
        element: (
          <DashboardLayout>
            <WorksheetList />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/worksheet/create',
        moduleName: 'Create Worksheet',
        element: (
          <DashboardLayout>
            <WorksheetCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/worksheet/:worksheetId/edit',
        moduleName: 'Edit Worksheet',
        element: (
          <DashboardLayout>
            <WorksheetCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/worksheet/:worksheetId',
        moduleName: 'Worksheet Detail',
        element: (
          <DashboardLayout>
            <WorksheetDetail />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/worksheet/:worksheetId/responses',
        moduleName: 'Worksheet Responses',
        element: (
          <DashboardLayout>
            <WorksheetResponses />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/worksheet/:worksheetId/analytics',
        moduleName: 'Worksheet Analytics',
        element: (
          <DashboardLayout>
            <WorksheetAnalytics />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams',
        moduleName: 'Exams',
        element: (
          <DashboardLayout>
            <ExamList />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams/create',
        moduleName: 'Create Exam',
        element: (
          <DashboardLayout>
            <ExamCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams/:examId/edit',
        moduleName: 'Edit Exam',
        element: (
          <DashboardLayout>
            <ExamCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams/:examId',
        moduleName: 'Exam Detail',
        element: (
          <DashboardLayout>
            <ExamDetail />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams/:examId/candidates',
        moduleName: 'Exam Candidates',
        element: (
          <DashboardLayout>
            <ExamCandidates />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams/:examId/results',
        moduleName: 'Exam Results',
        element: (
          <DashboardLayout>
            <ExamResults />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams/:examId/analytics',
        moduleName: 'Exam Analytics',
        element: (
          <DashboardLayout>
            <ExamAnalytics />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/templates',
        moduleName: 'Teacher Tools Templates',
        element: (
          <DashboardLayout>
            <TeacherToolsTemplates />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/analytics',
        moduleName: 'Teacher Tools Analytics',
        element: (
          <DashboardLayout>
            <TeacherToolsUnifiedAnalytics />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: '/templates',
    moduleName: 'Templates Library',
    element: (
      <DashboardLayout>
        <TemplatesLibrary />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/templates/:slug',
        moduleName: 'Template Runner',
        element: (
          <DashboardLayout>
            <TemplateRunner />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/general-lesson-planner',
        moduleName: 'General Lesson Planner',
        element: (
          <DashboardLayout>
            <GeneralLessonPlanner />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/stem-activity-generator',
        moduleName: 'STEM Activity Generator',
        element: (
          <DashboardLayout>
            <StemActivityGenerator />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/project-based-learning-planner',
        moduleName: 'Project Based Learning Planner',
        element: (
          <DashboardLayout>
            <ProjectBasedLearningPlanner />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/summative-assessment-builder',
        moduleName: 'Summative Assessment Builder',
        element: (
          <DashboardLayout>
            <SummativeAssessmentBuilder />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/formative-assessment-generator',
        moduleName: 'Formative Assessment Generator',
        element: (
          <DashboardLayout>
            <FormativeAssessmentGenerator />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/behaviour-plan-builder',
        moduleName: 'Behaviour Plan Builder',
        element: (
          <DashboardLayout>
            <BehaviourPlanBuilder />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/icebreaker-idea-generator',
        moduleName: 'Icebreaker Idea Generator',
        element: (
          <DashboardLayout>
            <IcebreakerIdeaGenerator />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/activity-planner',
        moduleName: 'Activity Planner',
        element: (
          <DashboardLayout>
            <ActivityPlanner />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/newsletter-article-generator',
        moduleName: 'Newsletter Article Generator',
        element: (
          <DashboardLayout>
            <NewsletterArticleGenerator />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/multi-lesson-planner',
        moduleName: 'Multi Lesson Planner',
        element: (
          <DashboardLayout>
            <MultiLessonPlanner />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/real-world-math-problem-generator',
        moduleName: 'Real World Math Problem Generator',
        element: (
          <DashboardLayout>
            <RealWorldMathProblemGenerator />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/math-game-builder',
        moduleName: 'Math Game Builder',
        element: (
          <DashboardLayout>
            <MathGameBuilder />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/budget-master-challenge',
        moduleName: 'Budget Master Challenge',
        element: (
          <DashboardLayout>
            <BudgetMasterChallenge />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/experiment-idea-generator',
        moduleName: 'Experiment Idea Generator',
        element: (
          <DashboardLayout>
            <ExperimentIdeaGenerator />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/learning-intention-breakdown',
        moduleName: 'Learning Intention Breakdown',
        element: (
          <DashboardLayout>
            <LearningIntentionBreakdown />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: '/chatbots',
    moduleName: 'Specialized Chatbots',
    element: (
      <DashboardLayout>
        <SpecializedChatbots />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/chatbots/general-teaching-assistant',
        moduleName: 'General Teaching Assistant',
        element: (
          <DashboardLayout>
            <GeneralTeachingAssistantChat />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/gpt4-teaching-assistant',
        moduleName: 'GPT4 Teaching Assistant',
        element: (
          <DashboardLayout>
            <GPT4TeachingAssistantChat />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/claude-education-pro',
        moduleName: 'Claude Education Pro',
        element: (
          <DashboardLayout>
            <ClaudeEducationProChat />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/gemini-education-suite',
        moduleName: 'Gemini Education Suite',
        element: (
          <DashboardLayout>
            <GeminiEducationSuiteChat />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/coding-programming-tutor',
        moduleName: 'Coding Programming Tutor',
        element: (
          <DashboardLayout>
            <CodingProgrammingTutor />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/visual-arts-studio-assistant',
        moduleName: 'Visual Arts Studio Assistant',
        element: (
          <DashboardLayout>
            <VisualArtsStudioAssistant />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/business-studies-mentor',
        moduleName: 'Business Studies Mentor',
        element: (
          <DashboardLayout>
            <BusinessStudiesMentor />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/career-readiness-coach',
        moduleName: 'Career Readiness Coach',
        element: (
          <DashboardLayout>
            <CareerReadinessCoach />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/lab-safety-protocol-advisor',
        moduleName: 'Lab Safety Protocol Advisor',
        element: (
          <DashboardLayout>
            <LabSafetyProtocolAdvisor />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/environmental-science-guide',
        moduleName: 'Environmental Science Guide',
        element: (
          <DashboardLayout>
            <EnvironmentalScienceGuide />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/music-performance-coach',
        moduleName: 'Music Performance Coach',
        element: (
          <DashboardLayout>
            <MusicPerformanceCoach />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/drama-theater-director',
        moduleName: 'Drama Theater Director',
        element: (
          <DashboardLayout>
            <DramaTheaterDirector />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/digital-literacy-advisor',
        moduleName: 'Digital Literacy Advisor',
        element: (
          <DashboardLayout>
            <DigitalLiteracyAdvisor />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/ai-machine-learning-educator',
        moduleName: 'AI Machine Learning Educator',
        element: (
          <DashboardLayout>
            <AIMachineLearningEducator />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/marketing-branding-strategist',
        moduleName: 'Marketing Branding Strategist',
        element: (
          <DashboardLayout>
            <MarketingBrandingStrategist />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/literacy-lab-coach',
        moduleName: 'Literacy Lab Coach',
        element: (
          <DashboardLayout>
            <LiteracyLabCoach />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/literature-analysis-expert',
        moduleName: 'Literature Analysis Expert',
        element: (
          <DashboardLayout>
            <LiteratureAnalysisExpert />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/grammar-writing-mentor',
        moduleName: 'Grammar Writing Mentor',
        element: (
          <DashboardLayout>
            <GrammarWritingMentor />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/advanced-knowledge-skills-coach',
        moduleName: 'Advanced Knowledge Skills Coach',
        element: (
          <DashboardLayout>
            <AdvancedKnowledgeSkillsCoach />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/unec-academic-development',
        moduleName: 'UNEC Academic Development',
        element: (
          <DashboardLayout>
            <UNECAcademicDevelopment />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/adaptive-math-strategist',
        moduleName: 'Adaptive Math Strategist',
        element: (
          <DashboardLayout>
            <AdaptiveMathStrategist />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/algebra-geometry-tutor',
        moduleName: 'Algebra Geometry Tutor',
        element: (
          <DashboardLayout>
            <AlgebraGeometryTutor />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/stem-inquiry-mentor',
        moduleName: 'STEM Inquiry Mentor',
        element: (
          <DashboardLayout>
            <STEMInquiryMentor />
          </DashboardLayout>
        ),
      },
      {
        path: '/chatbots/problem-solving-coach',
        moduleName: 'Problem Solving Coach',
        element: (
          <DashboardLayout>
            <ProblemSolvingCoach />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: '/youtube-quiz',
    moduleName: 'YouTube Quiz Generator',
    element: (
      <DashboardLayout>
        <YouTubeQuizGenerator />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/youtube-quiz/results',
        moduleName: 'Quiz Results',
        element: (
          <DashboardLayout>
            <QuizResults />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: '/pixgen',
    moduleName: 'PixGen (AI Media Studio)',
    element: (
      <DashboardLayout>
        <PixGen />
      </DashboardLayout>
    ),
  },
  {
    path: '/learning-hub',
    moduleName: 'Professional Learning Hub',
    element: (
      <DashboardLayout>
        <ProfessionalLearningHub />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/learning-hub/classroom-management',
        moduleName: 'Classroom Management Course',
        element: (
          <DashboardLayout>
            <ClassroomManagementCourse />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/assessment-strategies',
        moduleName: 'Assessment Strategies Course',
        element: (
          <DashboardLayout>
            <AssessmentStrategiesCourse />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/differentiation-course',
        moduleName: 'Differentiation Course',
        element: (
          <DashboardLayout>
            <DifferentiationCourse />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/student-engagement-course',
        moduleName: 'Student Engagement Course',
        element: (
          <DashboardLayout>
            <StudentEngagementCourse />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/digital-literacy-course',
        moduleName: 'Digital Literacy Course',
        element: (
          <DashboardLayout>
            <DigitalLiteracyCourse />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/differentiation-tutorial',
        moduleName: 'Differentiation Tutorial',
        element: (
          <DashboardLayout>
            <DifferentiationTutorial />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/lesson-planner-tutorial',
        moduleName: 'Lesson Planner Tutorial',
        element: (
          <DashboardLayout>
            <LessonPlannerTutorial />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/assessment-tutorial',
        moduleName: 'Assessment Tutorial',
        element: (
          <DashboardLayout>
            <AssessmentTutorial />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/blooms-taxonomy',
        moduleName: 'Blooms Taxonomy Research',
        element: (
          <DashboardLayout>
            <BloomsTaxonomyResearch />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/evidence-based-teaching',
        moduleName: 'Evidence Based Teaching Research',
        element: (
          <DashboardLayout>
            <EvidenceBasedTeachingResearch />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/assessment-research',
        moduleName: 'Assessment Research',
        element: (
          <DashboardLayout>
            <AssessmentResearch />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/sel-behavior-research',
        moduleName: 'SEL Behavior Research',
        element: (
          <DashboardLayout>
            <SELBehaviorResearch />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/growth-mindset-research',
        moduleName: 'Growth Mindset Research',
        element: (
          <DashboardLayout>
            <GrowthMindsetResearch />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/cognitive-load-research',
        moduleName: 'Cognitive Load Research',
        element: (
          <DashboardLayout>
            <CognitiveLoadTheoryResearch />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/metacognition-research',
        moduleName: 'Metacognition Research',
        element: (
          <DashboardLayout>
            <MetacognitionResearch />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/scaffolding-research',
        moduleName: 'Scaffolding Research',
        element: (
          <DashboardLayout>
            <ScaffoldingResearch />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/student-engagement-path',
        moduleName: 'Student Engagement Path',
        element: (
          <DashboardLayout>
            <StudentEngagementPath />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/advanced-differentiation-path',
        moduleName: 'Advanced Differentiation Path',
        element: (
          <DashboardLayout>
            <AdvancedDifferentiationPath />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/tiered-instruction-module',
        moduleName: 'Tiered Instruction Module',
        element: (
          <DashboardLayout>
            <TieredInstructionModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/content-differentiation-module',
        moduleName: 'Content Differentiation Module',
        element: (
          <DashboardLayout>
            <ContentDifferentiationModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/process-differentiation-module',
        moduleName: 'Process Differentiation Module',
        element: (
          <DashboardLayout>
            <ProcessDifferentiationModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/product-differentiation-module',
        moduleName: 'Product Differentiation Module',
        element: (
          <DashboardLayout>
            <ProductDifferentiationModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/assessment-differentiation-module',
        moduleName: 'Assessment Differentiation Module',
        element: (
          <DashboardLayout>
            <AssessmentDifferentiationModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/advanced-grouping-module',
        moduleName: 'Advanced Grouping Module',
        element: (
          <DashboardLayout>
            <AdvancedGroupingModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/ai-assessment-path',
        moduleName: 'AI Assessment Path',
        element: (
          <DashboardLayout>
            <AIAssistedAssessmentPath />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/ai-assessment-intro-module',
        moduleName: 'AI Assessment Intro Module',
        element: (
          <DashboardLayout>
            <AIAssessmentIntroModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/automated-rubrics-module',
        moduleName: 'Automated Rubrics Module',
        element: (
          <DashboardLayout>
            <AutomatedRubricsModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/instant-feedback-module',
        moduleName: 'Instant Feedback Module',
        element: (
          <DashboardLayout>
            <InstantFeedbackModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/formative-automation-module',
        moduleName: 'Formative Automation Module',
        element: (
          <DashboardLayout>
            <FormativeAutomationModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/summative-ai-design-module',
        moduleName: 'Summative AI Design Module',
        element: (
          <DashboardLayout>
            <SummativeAIDesignModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/stem-mastery',
        moduleName: 'STEM Mastery Course',
        element: (
          <DashboardLayout>
            <STEMMasteryCourse />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/literacy-expert',
        moduleName: 'Literacy Expert Course',
        element: (
          <DashboardLayout>
            <LiteracyExpertCourse />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/ngss-foundations',
        moduleName: 'NGSS Foundations Module',
        element: (
          <DashboardLayout>
            <NGSSFoundationsModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/engineering-design',
        moduleName: 'Engineering Design Module',
        element: (
          <DashboardLayout>
            <EngineeringDesignModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/computational-thinking',
        moduleName: 'Computational Thinking Module',
        element: (
          <DashboardLayout>
            <ComputationalThinkingModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/lab-safety',
        moduleName: 'Lab Safety Module',
        element: (
          <DashboardLayout>
            <LabSafetyModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/phenomena-driven',
        moduleName: 'Phenomena Driven Module',
        element: (
          <DashboardLayout>
            <PhenomenaDrivenModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/data-literacy',
        moduleName: 'Data Literacy Module',
        element: (
          <DashboardLayout>
            <DataLiteracyModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/stem-integration',
        moduleName: 'STEM Integration Module',
        element: (
          <DashboardLayout>
            <STEMIntegrationModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/ngss-assessment',
        moduleName: 'NGSS Assessment Module',
        element: (
          <DashboardLayout>
            <NGSSAssessmentModule />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/gamification-fundamentals',
        moduleName: 'Gamification Fundamentals',
        element: (
          <DashboardLayout>
            <GamificationFundamentals />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/points-badges-leaderboards',
        moduleName: 'Points Badges Leaderboards',
        element: (
          <DashboardLayout>
            <PointsBadgesLeaderboards />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/inquiry-learning-hooks',
        moduleName: 'Inquiry Learning Hooks',
        element: (
          <DashboardLayout>
            <InquiryLearningHooks />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/quest-based-learning',
        moduleName: 'Quest Based Learning',
        element: (
          <DashboardLayout>
            <QuestBasedLearning />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/collaborative-game-mechanics',
        moduleName: 'Collaborative Game Mechanics',
        element: (
          <DashboardLayout>
            <CollaborativeGameMechanics />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/adaptive-gamification',
        moduleName: 'Adaptive Gamification',
        element: (
          <DashboardLayout>
            <AdaptiveGamification />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/gamified-assessment',
        moduleName: 'Gamified Assessment',
        element: (
          <DashboardLayout>
            <GamifiedAssessment />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/advanced-inquiry-frameworks',
        moduleName: 'Advanced Inquiry Frameworks',
        element: (
          <DashboardLayout>
            <AdvancedInquiryFrameworks />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: '/history',
    moduleName: 'History',
    element: (
      <DashboardLayout>
        <History />
      </DashboardLayout>
    ),
  },
  {
    path: '/personalization',
    moduleName: 'Personalization',
    element: (
      <DashboardLayout>
        <Personalization />
      </DashboardLayout>
    ),
  },
  {
    path: '/analytics',
    moduleName: 'Analytics',
    element: (
      <DashboardLayout>
        <Analytics />
      </DashboardLayout>
    ),
  },
  {
    path: '/administration',
    moduleName: 'Administration',
    element: (
      <DashboardLayout>
        <ComingSoon />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/administration/reporting',
        moduleName: 'Reporting',
        element: (
          <DashboardLayout>
            <Reporting />
          </DashboardLayout>
        ),
      },
      {
        path: '/administration/assessment',
        moduleName: 'Assessment',
        element: (
          <DashboardLayout>
            <Assessment />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: '/use-cases',
    moduleName: 'Explore Use Cases',
    element: (
      <DashboardLayout>
        <ExploreUseCases />
      </DashboardLayout>
    ),
  },
];

export const superAdminRoutes = [
  {
    path: '/administration',
    moduleName: 'Administration',
    element: (
      <DashboardLayout>
        <ComingSoon />
      </DashboardLayout>
    ),
  },
];

export const orgAdminRoutes = [
  {
    path: '/organization',
    moduleName: 'Organization',
    element: (
      <DashboardLayout>
        <ComingSoon />
      </DashboardLayout>
    ),
  },
];

export const schoolAdminRoutes = [
  {
    path: '/school',
    moduleName: 'School',
    element: (
      <DashboardLayout>
        <ComingSoon />
      </DashboardLayout>
    ),
  },
];

export const studentRoutes = [
  {
    path: '/student',
    moduleName: 'Student',
    element: (
      <DashboardLayout>
        <ComingSoon />
      </DashboardLayout>
    ),
  },
];

export const parentRoutes = [
  {
    path: '/parent',
    moduleName: 'Parent',
    element: (
      <DashboardLayout>
        <ComingSoon />
      </DashboardLayout>
    ),
  },
];

// Auth routes
export const authRoutes = [
  {
    path: '/',
    moduleName: 'Base',
    element: <Navigate to='/login' replace />,
  },
  {
    path: '/login',
    moduleName: 'Login',
    element: <Login />,
  },
  {
    path: '/signup',
    moduleName: 'Signup Entry',
    element: <SignupEntry />,
  },
  {
    path: '/signup/individual',
    moduleName: 'Individual Signup',
    element: <IndividualSignup />,
  },
  {
    path: '/signup/institution',
    moduleName: 'Institution Admin Signup',
    element: <InstitutionAdminSignup />,
  },
  {
    path: '/signup/organization',
    moduleName: 'Organization Admin Signup',
    element: <OrganizationAdminSignup />,
  },
  {
    path: '/signup/legacy',
    moduleName: 'Legacy Signup',
    element: <SignUp />,
  },
  {
    path: '/forgot-password',
    moduleName: 'Forgot password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    moduleName: 'Reset Password',
    element: <ResetPassword />,
  },
  {
    path: '/verify-email',
    moduleName: 'Verify Email',
    element: <VerifyEmail />,
  },
  {
    path: '*',
    element: <Navigate to='/login' replace />,
  },
];
