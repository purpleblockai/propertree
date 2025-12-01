/**
 * Profile Page - User profile management for all roles
 */
import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User, Mail, Phone, Edit2, Save, X, Camera, MapPin, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import { Alert } from '../components/common';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfileData(data);

      // Initialize form with fetched data
      if (data.role === 'admin' && data.admin_profile) {
        formik.setValues({
          first_name: data.admin_profile.first_name || '',
          last_name: data.admin_profile.last_name || '',
          phone_number: data.admin_profile.phone_number || '',
          department: data.admin_profile.department || '',
        });
      } else if (data.profile) {
        formik.setValues({
          first_name: data.profile.first_name || '',
          last_name: data.profile.last_name || '',
          phone_number: data.profile.phone_number || '',
          bio: data.profile.bio || '',
          address: data.profile.address || '',
        });
      }
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Formik setup with dynamic validation based on role
  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      bio: '',
      address: '',
      department: '',
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('First name is required'),
      last_name: Yup.string().required('Last name is required'),
      phone_number: Yup.string().required('Phone number is required'),
      bio: profileData?.role !== 'admin' ? Yup.string() : Yup.string().notRequired(),
      address: profileData?.role !== 'admin' ? Yup.string() : Yup.string().notRequired(),
      department: profileData?.role === 'admin' ? Yup.string() : Yup.string().notRequired(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError('');
        setSuccess('');

        // Format data based on role
        const updateData = {};

        if (profileData.role === 'admin') {
          updateData.admin_profile = {
            first_name: values.first_name,
            last_name: values.last_name,
            phone_number: values.phone_number,
            department: values.department,
          };
        } else {
          updateData.profile = {
            first_name: values.first_name,
            last_name: values.last_name,
            phone_number: values.phone_number,
            bio: values.bio,
            address: values.address,
          };
        }

        const updatedData = await userService.updateProfile(updateData);
        setProfileData(updatedData);
        updateUser(updatedData);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to update profile';
        setError(errorMsg);
        toast.error(errorMsg);
        console.error('Profile update error:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle profile photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);
      const updatedData = await userService.uploadPhoto(file);
      setProfileData(updatedData);
      updateUser(updatedData);
      toast.success('Profile photo updated successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to upload photo';
      toast.error(errorMsg);
      console.error('Photo upload error:', err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Reset form to original values
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert type="error" message="Failed to load profile data" />
      </div>
    );
  }

  const profile = profileData.role === 'admin' ? profileData.admin_profile : profileData.profile;
  const photoUrl = profile?.profile_photo;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} className="mb-6" />}
        {success && <Alert type="success" message={success} className="mb-6" />}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header with Photo */}
          <div className="relative bg-gradient-to-r from-primary to-primary-dark h-32"></div>

          <div className="relative px-6 pb-6">
            {/* Profile Photo */}
            <div className="absolute -top-16 left-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>

                {/* Camera Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  type="button"
                >
                  {uploadingPhoto ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  ) : (
                    <Camera className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Edit/Save Button */}
            <div className="pt-20 flex justify-end">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    type="button"
                    className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={formik.handleSubmit}
                    disabled={formik.isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Form */}
            <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="first_name"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          formik.touched.first_name && formik.errors.first_name
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                        {profile?.first_name || '-'}
                      </p>
                    )}
                    {formik.touched.first_name && formik.errors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.first_name}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="last_name"
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          formik.touched.last_name && formik.errors.last_name
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                        {profile?.last_name || '-'}
                      </p>
                    )}
                    {formik.touched.last_name && formik.errors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.last_name}</p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <p className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600">
                      {profileData.email}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone_number"
                        value={formik.values.phone_number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          formik.touched.phone_number && formik.errors.phone_number
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                        {profile?.phone_number || '-'}
                      </p>
                    )}
                    {formik.touched.phone_number && formik.errors.phone_number && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.phone_number}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Role-specific fields */}
              {profileData.role === 'admin' ? (
                // Admin-specific fields
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Admin Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="department"
                          value={formik.values.department}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                          {profile?.department || '-'}
                        </p>
                      )}
                    </div>

                    {/* Role Badge */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          Administrator
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Tenant/Landlord-specific fields
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Additional Information
                  </h3>
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4 inline mr-2" />
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formik.values.bio}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 min-h-[100px]">
                          {profile?.bio || 'No bio added yet'}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={formik.values.address}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter your address..."
                        />
                      ) : (
                        <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                          {profile?.address || 'No address added yet'}
                        </p>
                      )}
                    </div>

                    {/* Role Badge */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            profileData.role === 'landlord'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {profileData.role === 'landlord' ? 'Landlord' : 'Tenant'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Status
                    </label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          profileData.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {profileData.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Status
                    </label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          profileData.is_verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {profileData.is_verified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {new Date(profileData.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
