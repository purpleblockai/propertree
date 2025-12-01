/**
 * Property service - Handle property operations
 */
import api from './api';

const propertyService = {
  /**
   * Get all properties with filters
   */
  async getProperties(params = {}) {
    const response = await api.get('/properties/', { params });
    return response.data;
  },

  /**
   * Get property by ID
   */
  async getProperty(id) {
    const response = await api.get(`/properties/${id}/`);
    return response.data;
  },

  /**
   * Create new property
   */
  async createProperty(propertyData) {
    const response = await api.post('/properties/', propertyData);
    return response.data;
  },

  /**
   * Update property
   */
  async updateProperty(id, propertyData) {
    const response = await api.patch(`/properties/${id}/`, propertyData);
    return response.data;
  },

  /**
   * Delete property
   */
  async deleteProperty(id) {
    const response = await api.delete(`/properties/${id}/`);
    return response.data;
  },

  /**
   * Submit property for approval (landlord)
   */
  async submitForApproval(id) {
    const response = await api.post(`/properties/${id}/submit/`);
    return response.data;
  },

  /**
   * Approve property (admin)
   */
  async approveProperty(id) {
    const response = await api.post(`/properties/${id}/approve/`);
    return response.data;
  },

  /**
   * Reject property (admin)
   */
  async rejectProperty(id, reason) {
    const response = await api.post(`/properties/${id}/reject/`, { reason });
    return response.data;
  },

  /**
   * Upload property image
   */
  async uploadImage(propertyId, imageData) {
    const formData = new FormData();
    formData.append('image', imageData.file);
    formData.append('caption', imageData.caption || '');
    formData.append('is_primary', imageData.is_primary || false);
    formData.append('order', imageData.order || 0);

    const response = await api.post(
      `/properties/${propertyId}/images/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Delete property image
   */
  async deleteImage(propertyId, imageId) {
    const response = await api.delete(
      `/properties/${propertyId}/images/${imageId}/`
    );
    return response.data;
  },

  /**
   * Get property amenities
   */
  async getAmenities() {
    const response = await api.get('/properties/amenities/');
    return response.data;
  },

  /**
   * Get property availability
   */
  async getAvailability(propertyId, startDate, endDate) {
    const response = await api.get(`/properties/${propertyId}/availability/`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  /**
   * Add to favorites
   */
  async addToFavorites(propertyId) {
    const response = await api.post('/properties/favorites/', {
      property_id: propertyId,
    });
    return response.data;
  },

  /**
   * Remove from favorites
   */
  async removeFromFavorites(favoriteId) {
    const response = await api.delete(`/properties/favorites/${favoriteId}/`);
    return response.data;
  },

  /**
   * Get user's favorite properties
   */
  async getFavorites() {
    const response = await api.get('/properties/favorites/');
    return response.data;
  },

  /**
   * Search properties
   */
  async searchProperties(searchParams) {
    const response = await api.get('/properties/search/', {
      params: searchParams,
    });
    return response.data;
  },
};

export default propertyService;

