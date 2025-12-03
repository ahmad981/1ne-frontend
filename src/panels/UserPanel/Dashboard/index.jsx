import { Routes, Route } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import TemplatesLibrary from './features/TemplatesLibrary';
import TemplateRunner from './features/TemplateRunner';
import GeneralLessonPlanner from './features/GeneralLessonPlanner';
import StemActivityGenerator from './features/StemActivityGenerator';
import ProjectBasedLearningPlanner from './features/ProjectBasedLearningPlanner';
import SummativeAssessmentBuilder from './features/SummativeAssessmentBuilder';
import FormativeAssessmentGenerator from './features/FormativeAssessmentGenerator';
import BehaviourPlanBuilder from './features/BehaviourPlanBuilder';
import IcebreakerIdeaGenerator from './features/IcebreakerIdeaGenerator';
import ActivityPlanner from './features/ActivityPlanner';
import NewsletterArticleGenerator from './features/NewsletterArticleGenerator';
import MultiLessonPlanner from './features/MultiLessonPlanner';
import RealWorldMathProblemGenerator from './features/RealWorldMathProblemGenerator';
import MathGameBuilder from './features/MathGameBuilder';
import BudgetMasterChallenge from './features/BudgetMasterChallenge';
import ExperimentIdeaGenerator from './features/ExperimentIdeaGenerator';
import LearningIntentionBreakdown from './features/LearningIntentionBreakdown';
import SpecializedChatbots from './features/SpecializedChatbots';
import YouTubeQuizGenerator from './features/YouTubeQuizGenerator';
import QuizResults from './features/QuizResults';
import PixGen from './features/PixGen';
import ProfessionalLearningHub from './features/ProfessionalLearningHub';
import History from './features/History';
import Personalization from './features/Personalization';
import Analytics from './features/Analytics';
import Reporting from './features/Reporting';
import Assessment from './features/Assessment';
import Profile from '../Profile';
import Settings from '../Settings';
import ExploreUseCases from './ExploreUseCases';
import CoreAcademicsShowcase from './features/CoreAcademicsShowcase';

const Dashboard = () => {
  return (
    <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="templates" element={<TemplatesLibrary />} />
        <Route path="templates/:slug" element={<TemplateRunner />} />
        <Route path="templates/general-lesson-planner" element={<GeneralLessonPlanner />} />
        <Route path="templates/stem-activity-generator" element={<StemActivityGenerator />} />
        <Route
          path="templates/project-based-learning-planner"
          element={<ProjectBasedLearningPlanner />}
        />
        <Route
          path="templates/summative-assessment-builder"
          element={<SummativeAssessmentBuilder />}
        />
        <Route
          path="templates/formative-assessment-generator"
          element={<FormativeAssessmentGenerator />}
        />
        <Route
          path="templates/behaviour-plan-builder"
          element={<BehaviourPlanBuilder />}
        />
        <Route
          path="templates/icebreaker-idea-generator"
          element={<IcebreakerIdeaGenerator />}
        />
        <Route path="templates/activity-planner" element={<ActivityPlanner />} />
        <Route
          path="templates/newsletter-article-generator"
          element={<NewsletterArticleGenerator />}
        />
        <Route
          path="templates/multi-lesson-planner"
          element={<MultiLessonPlanner />}
        />
        <Route
          path="templates/real-world-math-problem-generator"
          element={<RealWorldMathProblemGenerator />}
        />
        <Route
          path="templates/math-game-builder"
          element={<MathGameBuilder />}
        />
        <Route
          path="templates/budget-master-challenge"
          element={<BudgetMasterChallenge />}
        />
        <Route
          path="templates/experiment-idea-generator"
          element={<ExperimentIdeaGenerator />}
        />
        <Route
          path="templates/learning-intention-breakdown"
          element={<LearningIntentionBreakdown />}
        />
        <Route path="chatbots" element={<SpecializedChatbots />} />
        <Route path="chatbots/core-academics" element={<CoreAcademicsShowcase />} />
        <Route path="youtube-quiz" element={<YouTubeQuizGenerator />} />
        <Route path="youtube-quiz/results" element={<QuizResults />} />
        <Route path="pixgen" element={<PixGen />} />
        <Route path="learning-hub" element={<ProfessionalLearningHub />} />
        <Route path="history" element={<History />} />
        <Route path="personalization" element={<Personalization />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="administration/reporting" element={<Reporting />} />
        <Route path="administration/assessment" element={<Assessment />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="use-cases" element={<ExploreUseCases />} />
      </Routes>
  );
};

export default Dashboard;

