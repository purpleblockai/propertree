/**
 * Booking service - Handle booking operations
 */
import api from './api';

const bookingService = {
  /**
   * Get all bookings
   */
  async getBookings(params = {}) {
    const response = await api.get('/bookings/', { params });
    return response.data;
  },

  /**
   * Get booking by ID
   */
  async getBooking(id) {
    const response = await api.get(`/bookings/${id}/`);
    return response.data;
  },

  /**
   * Create new booking
   */
  async createBooking(bookingData) {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  },

  /**
   * Cancel booking
   */
  async cancelBooking(id, reason) {
    const response = await api.post(`/bookings/${id}/cancel/`, { reason });
    return response.data;
  },

  /**
   * Confirm booking (landlord)
   */
  async confirmBooking(id) {
    const response = await api.post(`/bookings/${id}/confirm/`);
    return response.data;
  },

  /**
   * Reject booking (landlord)
   */
  async rejectBooking(id, reason) {
    const response = await api.post(`/bookings/${id}/reject/`, { reason });
    return response.data;
  },

  /**
   * Get booking reviews
   */
  async getReviews(bookingId) {
    const response = await api.get(`/bookings/${bookingId}/reviews/`);
    return response.data;
  },

  /**
   * Create review for booking
   */
  async createReview(bookingId, reviewData) {
    const response = await api.post(`/bookings/${bookingId}/reviews/`, reviewData);
    return response.data;
  },

  /**
   * Get payments for booking
   */
  async getPayments(bookingId) {
    const response = await api.get(`/bookings/${bookingId}/payments/`);
    return response.data;
  },

  /**
   * Create payment for booking
   */
  async createPayment(bookingId, paymentData) {
    const response = await api.post(`/bookings/${bookingId}/payments/`, paymentData);
    return response.data;
  },
};

export default bookingService;

