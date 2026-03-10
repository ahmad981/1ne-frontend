// Import from centralized API config
import { API_BASE_URL } from '../config/api'

// Base URL from centralized config
export const baseURL = API_BASE_URL;

// Endpoints (relative paths - axios instance in http.js already has baseURL configured)
const endPoints = {
  /*********************** Authentication *************************/
  // Login User
  login: `/api/v1/auth/login`,

  // Unified Signup
  signup: `/api/v1/auth/signup`,

  // Register User (deprecated)
  register: `/api/v1/auth/register`,

  // Teacher Signup (deprecated)
  teacherSignup: `/api/v1/auth/signup/teacher`,

  // Student Signup (deprecated)
  studentSignup: `/api/v1/auth/signup/student`,

  // Parent Signup (deprecated)
  parentSignup: `/api/v1/auth/signup/parent`,

  // Forgot Password
  forgotPassword: `/api/v1/auth/forgot-password`,

  // Reset Password
  resetPassword: `/api/v1/auth/reset-password`,

  // Refresh Token
  refreshToken: `/api/v1/auth/refresh`,

  // Logout
  logout: `/api/v1/auth/logout`,

  // Verify Email
  verifyEmail: `/api/v1/auth/verify-email`,

  // Resend Verification
  resendVerification: `/api/v1/auth/resend-verification`,

  // Profile Details
  profileDetails: `/api/v1/auth/me`,

  // Update Profile
  updateProfile: `/api/v1/auth/me`,

  // Update Profile (with teaching context) - returns { profile, context_resolution_status }
  updateProfileWithContext: `/api/v1/users/profile`,

  // Metadata for teaching context dropdowns
  metadataCountries: `/api/v1/metadata/countries`,
  metadataRegions: `/api/v1/metadata/regions`,
  metadataSubjects: `/api/v1/metadata/subjects`,
  metadataCurriculums: `/api/v1/metadata/curriculums`,
  metadataGradeBands: `/api/v1/metadata/grade-bands`,
  metadataSchoolTypes: `/api/v1/metadata/school-types`,
  metadataLanguages: `/api/v1/metadata/languages`,
  metadataYearsExperience: `/api/v1/metadata/years-experience`,

  // Change Password
  changePassword: `/api/v1/auth/me/change-password`,

  // Membership Management
  memberships: `/api/v1/auth/memberships`,
  switchMembership: `/api/v1/auth/memberships/switch`,

  // Session Management
  sessions: `/api/v1/auth/sessions`,
  logoutAll: `/api/v1/auth/logout-all`,

  /*********************** Authentication *************************/
};

export default endPoints;

