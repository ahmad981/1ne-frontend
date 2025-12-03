// Base URL
export const baseURL = 'https://api.1ne.ai/api';

// Endpoints
const endPoints = {
  /*********************** Authentication *************************/
  // Login User
  login: `${baseURL}/v1/users/login/`,

  // Register User
  register: `${baseURL}/v1/users/personal-info-registration/`,

  // Forgot Password
  forgotPassword: `${baseURL}/v1/users/forgotpassword/`,

  // Reset Password
  resetPassword: `${baseURL}/v1/users/reset-password/`,

  // Update Profile
  updateProfile: `${baseURL}/v1/users/update-profile/`,

  // Update Password
  updatePassword: `${baseURL}/v1/users/passwordupdate/`,

  // Profile Details
  profileDetails: `${baseURL}/v1/users/profile-details/`,

  /*********************** Authentication *************************/

  /************************* Teacher Assistant ****************************/
  // Example Teacher Assistant endpoint (fake URL for now)
  teacherAssistant: `${baseURL}/v1/teacher-assistant/`,
  /************************* Teacher Assistant ****************************/
};

export default endPoints;

