/**
 * User service - Handle user operations
 */
import api from './api';

const userService = {
  /**
   * Get current user profile
   */
  async getProfile() {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    const response = await api.patch('/auth/profile/', profileData);
    return response.data;
  },

  /**
   * Upload profile photo
   */
  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('profile_photo', file);

    const response = await api.patch('/auth/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get user's properties (landlord)
   */
  async getMyProperties() {
    const response = await api.get('/users/my-properties/');
    return response.data;
  },

  /**
   * Get user's bookings (tenant)
   */
  async getMyBookings(status) {
    const params = status ? { status } : {};
    const response = await api.get('/users/my-bookings/', { params });
    return response.data;
  },

  /**
   * Get dashboard stats
   */
  async getDashboardStats() {
    const response = await api.get('/users/dashboard/');
    return response.data;
  },

  /**
   * Become a host (change role to landlord)
   */
  async becomeHost() {
    const response = await api.post('/users/become-host/');
    return response.data;
  },
};

export default userService;

