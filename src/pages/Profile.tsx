import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../hooks/useSnackbar';
import { CustomInput, CustomButton, ProfilePictureUpload } from '../components/shared';
import { TeacherContextForm, getDefaultTeacherContextForm, validateTeacherContext } from '../components/profile/TeacherContextForm';
import { getProfileDetails, updateProfile, changePassword, updateUserEmail } from '../redux/features/auth/authSlice';
import { setAuthToken } from '../redux/http';
import { validateEmail, validatePassword } from '../utils/utils';
import { baseURL } from '../redux/constant';
import { Lock, User, Mail, Phone, AtSign, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useSnackbar();
  const { profileDetails, loading, error, updatePasswordLoading, user } = useSelector((state) => state.auth);
  
  // Helper function to format role name professionally
  const formatRoleName = (role) => {
    if (!role) return '';
    
    const roleStr = typeof role === 'string' ? role : (role?.name ? (typeof role.name === 'string' ? role.name : role.name?.value || role.name?.toString() || '') : role?.toString() || '');
    
    // Map role names to display format
    const roleMap = {
      'super_admin': 'Super Admin',
      'org_admin': 'Organization Admin',
      'organization_admin': 'Organization Admin',
      'school_admin': 'School Admin',
      'institution_admin': 'Institution Admin',
      'teacher': 'Teacher',
      'student': 'Student',
      'parent': 'Parent',
    };
    
    return roleMap[roleStr.toLowerCase()] || roleStr
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Helper function to get role badge color
  const getRoleBadgeColor = (role) => {
    if (!role) return 'bg-gray-100 text-gray-700';
    
    const roleStr = typeof role === 'string' ? role : (role?.name ? (typeof role.name === 'string' ? role.name : role.name?.value || role.name?.toString() || '') : role?.toString() || '').toLowerCase();
    
    const colorMap = {
      'super_admin': 'bg-purple-100 text-purple-700',
      'org_admin': 'bg-blue-100 text-blue-700',
      'organization_admin': 'bg-blue-100 text-blue-700',
      'school_admin': 'bg-indigo-100 text-indigo-700',
      'institution_admin': 'bg-indigo-100 text-indigo-700',
      'teacher': 'bg-green-100 text-green-700',
      'student': 'bg-amber-100 text-amber-700',
      'parent': 'bg-teal-100 text-teal-700',
    };
    
    return colorMap[roleStr] || 'bg-gray-100 text-gray-700';
  };
  
  // Get user role - handle enum format
  const getUserRole = () => {
    try {
      // Try profileDetails roles first
      if (profileDetails?.roles && Array.isArray(profileDetails.roles) && profileDetails.roles.length > 0) {
        const firstRole = profileDetails.roles[0];
        if (firstRole?.name) {
          // Handle enum format: role.name.value or role.name directly
          if (typeof firstRole.name === 'string') {
            return firstRole.name;
          }
          const roleValue = firstRole.name?.value || firstRole.name?.toString() || '';
          return roleValue || null;
        }
      }
      // Fallback to user.role
      return user?.role || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  };
  
  const userRole = getUserRole();
  const formattedRole = userRole ? formatRoleName(userRole) : '';
  const roleBadgeColor = userRole ? getRoleBadgeColor(userRole) : 'bg-gray-100 text-gray-700';

  // Active tab state
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: '',
  });

  // Initial form data for change detection
  const [initialFormData, setInitialFormData] = useState(null);

  // Teaching context form state
  const [teacherContextForm, setTeacherContextForm] = useState(getDefaultTeacherContextForm);
  const [initialTeacherContext, setInitialTeacherContext] = useState(null);
  const [teacherContextErrors, setTeacherContextErrors] = useState({});

  // Form errors
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile picture state
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [removeProfilePicture, setRemoveProfilePicture] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  // Password change form state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Email change warning
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [pendingEmailChange, setPendingEmailChange] = useState(false);

  // Load profile data on mount
  useEffect(() => {
    dispatch(getProfileDetails());
  }, [dispatch]);

  // Populate form when profileDetails loads
  useEffect(() => {
    if (profileDetails) {
      const data = {
        first_name: profileDetails.first_name || '',
        last_name: profileDetails.last_name || '',
        email: profileDetails.email || '',
        phone: profileDetails.phone || '',
        username: profileDetails.username || '',
      };
      
      setFormData(data);
      setInitialFormData(data);

      // Teaching context from profile
      const tc = profileDetails.teacher_context;
      if (tc) {
        const tcForm = {
          country: tc.country || '',
          region: tc.region || '',
          school_type: tc.school_type || '',
          grade_band: tc.grade_band || '',
          subjects: Array.isArray(tc.subjects) ? tc.subjects : [],
          language_preference: tc.language_preference || '',
          school_name: tc.school_name || '',
          city: tc.city || '',
          postal_code: tc.postal_code || '',
          curriculum_framework: tc.curriculum_framework || '',
          years_experience: tc.years_experience || '',
          professional_goals: Array.isArray(tc.professional_goals) ? tc.professional_goals : [],
        };
        setTeacherContextForm(tcForm);
        setInitialTeacherContext(tcForm);
      } else {
        setTeacherContextForm(getDefaultTeacherContextForm());
        setInitialTeacherContext(getDefaultTeacherContextForm());
      }
      
      // Set profile picture URL
      if (profileDetails.profile_picture_url) {
        const urlValue = profileDetails.profile_picture_url;
        let fullUrl;
        
        if (urlValue.startsWith('http')) {
          fullUrl = urlValue;
        } else if (urlValue.startsWith('/')) {
          fullUrl = `${baseURL}${urlValue}`;
        } else {
          fullUrl = `${baseURL}/static/profile_pictures/${urlValue}`;
        }
        
        setProfilePictureUrl(fullUrl);
      } else {
        setProfilePictureUrl(null);
      }
    }
  }, [profileDetails]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if email is being changed
    if (name === 'email' && initialFormData && value !== initialFormData.email) {
      if (!showEmailWarning && !pendingEmailChange) {
        setShowEmailWarning(true);
        setPendingEmailChange(true);
      }
    } else if (name === 'email' && initialFormData && value === initialFormData.email) {
      setShowEmailWarning(false);
      setPendingEmailChange(false);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    setFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // Validate profile form
  const validateForm = () => {
    const errors = {};

    if (!formData.first_name || formData.first_name.trim().length === 0) {
      errors.first_name = 'First name is required';
    } else if (formData.first_name.trim().length > 100) {
      errors.first_name = 'First name must be 100 characters or less';
    }

    if (!formData.last_name || formData.last_name.trim().length === 0) {
      errors.last_name = 'Last name is required';
    } else if (formData.last_name.trim().length > 100) {
      errors.last_name = 'Last name must be 100 characters or less';
    }

    if (!formData.email || formData.email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (formData.phone && formData.phone.trim().length > 20) {
      errors.phone = 'Phone number must be 20 characters or less';
    }

    if (formData.username) {
      const username = formData.username.trim();
      if (username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      } else if (username.length > 100) {
        errors.username = 'Username must be 100 characters or less';
      } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        errors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.current_password) {
      errors.current_password = 'Current password is required';
    }

    if (!passwordData.new_password) {
      errors.new_password = 'New password is required';
    } else {
      const passwordValidation = validatePassword(passwordData.new_password);
      if (!passwordValidation.length) {
        errors.new_password = 'Password must be at least 10 characters';
      } else if (!passwordValidation.upper || !passwordValidation.lower || !passwordValidation.number || !passwordValidation.specialChar) {
        errors.new_password = 'Password must contain uppercase, lowercase, number, and special character';
      }
    }

    if (!passwordData.confirm_password) {
      errors.confirm_password = 'Please confirm your new password';
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const hasTeacherContextChanges = () => {
    if (!initialTeacherContext) return true;
    const a = teacherContextForm;
    const b = initialTeacherContext;
    return (
      a.country !== b.country ||
      a.region !== b.region ||
      a.school_type !== b.school_type ||
      a.grade_band !== b.grade_band ||
      (a.subjects || []).length !== (b.subjects || []).length ||
      (a.subjects || []).some((s, i) => (b.subjects || [])[i] !== s) ||
      a.language_preference !== b.language_preference ||
      (a.school_name || '') !== (b.school_name || '') ||
      (a.city || '') !== (b.city || '') ||
      (a.postal_code || '') !== (b.postal_code || '') ||
      (a.curriculum_framework || '') !== (b.curriculum_framework || '') ||
      (a.years_experience || '') !== (b.years_experience || '') ||
      (a.professional_goals || []).length !== (b.professional_goals || []).length ||
      (a.professional_goals || []).some((g, i) => (b.professional_goals || [])[i] !== g)
    );
  };

  // Check if profile form has changes
  const hasChanges = () => {
    if (!initialFormData) return false;

    const textFieldsChanged = 
      formData.first_name !== initialFormData.first_name ||
      formData.last_name !== initialFormData.last_name ||
      formData.email !== initialFormData.email ||
      formData.phone !== initialFormData.phone ||
      formData.username !== initialFormData.username;

    const pictureChanged = profilePictureFile !== null || removeProfilePicture;
    const teachingContextChanged = hasTeacherContextChanges();

    return textFieldsChanged || pictureChanged || teachingContextChanged;
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      setRemoveProfilePicture(false);
    }
  };

  // Handle profile picture remove
  const handleProfilePictureRemove = () => {
    setProfilePictureFile(null);
    setRemoveProfilePicture(true);
    setProfilePictureUrl(null);
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    setPasswordErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // Handle profile form submission (single PUT /auth/me with personal + picture + teaching_context)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (hasTeacherContextChanges()) {
      const tcErrors = validateTeacherContext(teacherContextForm);
      setTeacherContextErrors(tcErrors);
      if (Object.keys(tcErrors).length > 0) {
        toast.error('Please complete all required Teaching Context fields');
        return;
      }
    }

    if (!hasChanges()) {
      toast.info('No changes to save');
      return;
    }

    const emailChanged = initialFormData && formData.email !== initialFormData.email;
    if (emailChanged && !showEmailWarning) {
      setShowEmailWarning(true);
      return;
    }

    setIsSubmitting(true);
    setTeacherContextErrors({});

    try {
      const submitFormData = new FormData();
      if (initialFormData) {
        if (formData.first_name !== initialFormData.first_name) submitFormData.append('first_name', formData.first_name.trim());
        if (formData.last_name !== initialFormData.last_name) submitFormData.append('last_name', formData.last_name.trim());
        if (formData.email !== initialFormData.email) submitFormData.append('email', formData.email.trim().toLowerCase());
        if ('phone' in formData) submitFormData.append('phone', formData.phone?.trim() ?? '');
        if ('username' in formData) submitFormData.append('username', formData.username?.trim() ?? '');
      } else {
        submitFormData.append('first_name', formData.first_name.trim());
        submitFormData.append('last_name', formData.last_name.trim());
        submitFormData.append('email', formData.email.trim().toLowerCase());
        if (formData.phone?.trim()) submitFormData.append('phone', formData.phone.trim());
        if (formData.username?.trim()) submitFormData.append('username', formData.username.trim());
      }
      if (removeProfilePicture) submitFormData.append('remove_profile_picture', 'true');
      else if (profilePictureFile) submitFormData.append('profile_picture', profilePictureFile);

      const tcFilled =
        teacherContextForm.country &&
        teacherContextForm.region &&
        teacherContextForm.school_type &&
        teacherContextForm.grade_band &&
        Array.isArray(teacherContextForm.subjects) &&
        teacherContextForm.subjects.length > 0 &&
        teacherContextForm.language_preference;
      if (tcFilled) {
        submitFormData.append(
          'teaching_context',
          JSON.stringify({
            country: teacherContextForm.country,
            region: teacherContextForm.region,
            school_type: teacherContextForm.school_type,
            grade_band: teacherContextForm.grade_band,
            subjects: teacherContextForm.subjects,
            language_preference: teacherContextForm.language_preference,
            school_name: teacherContextForm.school_name || null,
            city: teacherContextForm.city || null,
            postal_code: teacherContextForm.postal_code || null,
            curriculum_framework: teacherContextForm.curriculum_framework || null,
            years_experience: teacherContextForm.years_experience || null,
            professional_goals: teacherContextForm.professional_goals?.length ? teacherContextForm.professional_goals : null,
          })
        );
      }

      const result = await dispatch(updateProfile(submitFormData));

      if (result?.meta?.requestStatus === 'fulfilled') {
        const response = result.payload;
        if (response?.access_token) {
          setAuthToken(response.access_token);
          localStorage.setItem('access_token', response.access_token);
          if (response?.email) {
            dispatch(updateUserEmail({ email: response.email, email_verified: false }));
          }
        }
        toast.success(response?.message || 'Profile updated successfully!');
        setProfilePictureFile(null);
        setRemoveProfilePicture(false);
        setShowEmailWarning(false);
        setPendingEmailChange(false);
        setInitialFormData(response);
        setFormData({
          first_name: response?.first_name || '',
          last_name: response?.last_name || '',
          email: response?.email || '',
          phone: response?.phone || '',
          username: response?.username || '',
        });
        if (response?.teacher_context) {
          const tc = response.teacher_context;
          const tcForm = {
            country: tc.country || '',
            region: tc.region || '',
            school_type: tc.school_type || '',
            grade_band: tc.grade_band || '',
            subjects: Array.isArray(tc.subjects) ? tc.subjects : [],
            language_preference: tc.language_preference || '',
            school_name: tc.school_name || '',
            city: tc.city || '',
            postal_code: tc.postal_code || '',
            curriculum_framework: tc.curriculum_framework || '',
            years_experience: tc.years_experience || '',
            professional_goals: Array.isArray(tc.professional_goals) ? tc.professional_goals : [],
          };
          setTeacherContextForm(tcForm);
          setInitialTeacherContext(tcForm);
        }
        if (response?.profile_picture_url !== undefined) {
          const urlValue = response.profile_picture_url;
          if (urlValue) {
            const fullUrl = urlValue.startsWith('http') ? urlValue : urlValue.startsWith('/') ? `${baseURL}${urlValue}` : `${baseURL}/static/profile_pictures/${urlValue}`;
            setProfilePictureUrl(fullUrl);
          } else setProfilePictureUrl(null);
        }
      } else {
        const errorMessage = result?.payload || error || 'Failed to update profile';
        if (typeof errorMessage === 'string') toast.error(errorMessage);
        else if (errorMessage?.detail) toast.error(errorMessage.detail);
        else toast.error('Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsChangingPassword(true);

    try {
      const result = await dispatch(changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      }));

      if (result?.meta?.requestStatus === 'fulfilled') {
        toast.success('Password changed successfully!');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
        setPasswordErrors({});
      } else {
        const errorMessage = result?.payload || 'Failed to change password';
        if (typeof errorMessage === 'string') {
          toast.error(errorMessage);
        } else if (errorMessage?.detail) {
          toast.error(errorMessage.detail);
        } else {
          toast.error('Failed to change password. Please try again.');
        }
      }
    } catch (err) {
      console.error('Password change error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Loading state
  if (loading && !profileDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profileDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-danger mb-4">Failed to load profile data</p>
          <CustomButton
            onClick={() => dispatch(getProfileDetails())}
            className="!bg-primary !text-white"
          >
            Retry
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              {formattedRole && formattedRole.trim() && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${roleBadgeColor || 'bg-gray-100 text-gray-700'}`}>
                  {formattedRole}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Manage your account information and security</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile Information
              </div>
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'password'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Change Password
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Change Warning */}
              {showEmailWarning && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-900 mb-1">Email Change Notice</h3>
                    <p className="text-sm text-amber-700">
                      Changing your email address will send a verification email to your new address. 
                      Please check your new email and verify it to complete the change. You'll stay logged in.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailWarning(false);
                      setPendingEmailChange(false);
                      if (initialFormData) {
                        setFormData((prev) => ({ ...prev, email: initialFormData.email }));
                      }
                    }}
                    className="text-amber-700 hover:text-amber-900 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Profile Picture Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
                <ProfilePictureUpload
                  firstName={(() => {
                    // Use full name for initials: first_name + last_name
                    const fullName = `${formData.first_name || ''} ${formData.last_name || ''}`.trim();
                    return fullName || profileDetails?.full_name || profileDetails?.username || user?.full_name || user?.username || profileDetails?.first_name || 'User';
                  })()}
                  currentImageUrl={profilePictureUrl}
                  value={profilePictureFile}
                  onChange={handleProfilePictureChange}
                  onRemove={handleProfilePictureRemove}
                  showRemoveButton={!!profilePictureUrl || !!profilePictureFile}
                  disabled={isSubmitting || loading}
                  label=""
                  avatarSize="w-24 h-24 md:w-32 md:h-32"
                />
              </div>

              {/* Context resolution status (after submit) */}
              {profileDetails?.context_resolution_status === 'resolved' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-800">Your educational context is resolved. You’ll get accurate recommendations in the Professional Learning Hub.</p>
                </div>
              )}
              {profileDetails?.context_resolution_status === 'partial' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">We found a partial match</p>
                    <p className="text-sm text-amber-700 mt-1">Consider completing curriculum framework and grade band for better recommendations.</p>
                  </div>
                </div>
              )}
              {profileDetails?.context_resolution_status === 'not_found' && profileDetails?.teacher_context && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Complete your context for better recommendations</p>
                    <p className="text-sm text-amber-700 mt-1">
                      We were unable to automatically identify detailed educational context based on the information provided.
                      To ensure accurate recommendations in the Professional Learning Hub, please review or complete the following fields.
                    </p>
                  </div>
                </div>
              )}

              {/* Personal Information Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <CustomInput
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      error={!!formErrors.first_name}
                      errorMsg={formErrors.first_name}
                      required
                      disabled={isSubmitting || loading}
                      placeholder="Enter your first name"
                      icon={<User className="w-4 h-4" />}
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <CustomInput
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      error={!!formErrors.last_name}
                      errorMsg={formErrors.last_name}
                      required
                      disabled={isSubmitting || loading}
                      placeholder="Enter your last name"
                      icon={<User className="w-4 h-4" />}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <CustomInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!formErrors.email}
                      errorMsg={formErrors.email}
                      required
                      disabled={isSubmitting || loading}
                      placeholder="Enter your email"
                      icon={<Mail className="w-4 h-4" />}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <CustomInput
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      error={!!formErrors.phone}
                      errorMsg={formErrors.phone}
                      disabled={isSubmitting || loading}
                      placeholder="Enter your phone number"
                      icon={<Phone className="w-4 h-4" />}
                    />
                  </div>

                  {/* Username */}
                  <div className="md:col-span-2">
                    <CustomInput
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      error={!!formErrors.username}
                      errorMsg={formErrors.username}
                      disabled={isSubmitting || loading}
                      placeholder="Enter your username (optional)"
                      icon={<AtSign className="w-4 h-4" />}
                    />
                    <p className="text-xs text-gray-500 mt-1 ml-1">Choose a unique username for your profile</p>
                  </div>
                </div>
              </div>

              {/* Teaching Context & Professional Environment */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Teaching Context & Professional Environment</h2>
                <p className="text-sm text-gray-600 mb-6">
                  This information helps us map you to your national education framework and personalize the Professional Learning Hub.
                </p>
                <TeacherContextForm
                  value={teacherContextForm}
                  onChange={setTeacherContextForm}
                  errors={teacherContextErrors}
                  disabled={isSubmitting || loading}
                  showOptional={profileDetails?.context_resolution_status === 'not_found' || !profileDetails?.context_resolution_status}
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                <CustomButton
                  type="button"
                  onClick={() => {
                    if (initialFormData) {
                      setFormData(initialFormData);
                      setFormErrors({});
                      setTeacherContextErrors({});
                      if (initialTeacherContext) setTeacherContextForm(initialTeacherContext);
                      setProfilePictureFile(null);
                      setRemoveProfilePicture(false);
                      setShowEmailWarning(false);
                      setPendingEmailChange(false);
                      if (profileDetails?.profile_picture_url) {
                        const urlValue = profileDetails.profile_picture_url;
                        let fullUrl;
                        if (urlValue.startsWith('http')) {
                          fullUrl = urlValue;
                        } else if (urlValue.startsWith('/')) {
                          fullUrl = `${baseURL}${urlValue}`;
                        } else {
                          fullUrl = `${baseURL}/static/profile_pictures/${urlValue}`;
                        }
                        setProfilePictureUrl(fullUrl);
                      } else {
                        setProfilePictureUrl(null);
                      }
                    }
                  }}
                  disabled={!hasChanges() || isSubmitting || loading}
                  variant="outlined"
                  className="!border-gray-300 !text-gray-700 hover:!bg-gray-50"
                >
                  Cancel
                </CustomButton>
                
                <CustomButton
                  type="submit"
                  disabled={!hasChanges() || isSubmitting || loading}
                  loading={isSubmitting}
                  className="!bg-primary !text-white hover:!bg-primary-dark min-w-[140px]"
                >
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
                </CustomButton>
              </div>
            </form>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-2xl">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">Password Requirements</h3>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• At least 10 characters long</li>
                    <li>• Contains uppercase and lowercase letters</li>
                    <li>• Contains at least one number</li>
                    <li>• Contains at least one special character</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                {/* Current Password */}
                <CustomInput
                  label="Current Password"
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.current_password}
                  errorMsg={passwordErrors.current_password}
                  required
                  disabled={isChangingPassword || updatePasswordLoading}
                  placeholder="Enter your current password"
                  icon={<Lock className="w-4 h-4" />}
                />

                {/* New Password */}
                <CustomInput
                  label="New Password"
                  name="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.new_password}
                  errorMsg={passwordErrors.new_password}
                  required
                  disabled={isChangingPassword || updatePasswordLoading}
                  placeholder="Enter your new password"
                  icon={<Lock className="w-4 h-4" />}
                />

                {/* Confirm Password */}
                <CustomInput
                  label="Confirm New Password"
                  name="confirm_password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.confirm_password}
                  errorMsg={passwordErrors.confirm_password}
                  required
                  disabled={isChangingPassword || updatePasswordLoading}
                  placeholder="Confirm your new password"
                  icon={<Lock className="w-4 h-4" />}
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                <CustomButton
                  type="button"
                  onClick={() => {
                    setPasswordData({
                      current_password: '',
                      new_password: '',
                      confirm_password: '',
                    });
                    setPasswordErrors({});
                  }}
                  disabled={
                    !passwordData.current_password && !passwordData.new_password && !passwordData.confirm_password ||
                    isChangingPassword ||
                    updatePasswordLoading
                  }
                  variant="outlined"
                  className="!border-gray-300 !text-gray-700 hover:!bg-gray-50"
                >
                  Clear
                </CustomButton>
                
                <CustomButton
                  type="submit"
                  disabled={
                    !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password ||
                    isChangingPassword ||
                    updatePasswordLoading
                  }
                  loading={isChangingPassword || updatePasswordLoading}
                  className="!bg-primary !text-white hover:!bg-primary-dark min-w-[160px]"
                >
                  {isChangingPassword || updatePasswordLoading ? 'Changing...' : 'Change Password'}
                </CustomButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
