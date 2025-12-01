/**
 * useBookings hook - Booking management with TanStack Query
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services';
import toast from 'react-hot-toast';

/**
 * Fetch bookings with filters
 */
export const useBookings = (filters = {}) => {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => bookingService.getBookings(filters),
  });
};

/**
 * Fetch single booking by ID
 */
export const useBooking = (id) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getBooking(id),
    enabled: !!id,
  });
};

/**
 * Create new booking
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingData) => bookingService.createBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      toast.success('Booking created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error creating booking.');
    },
  });
};

/**
 * Cancel booking
 */
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }) => bookingService.cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      toast.success('Booking cancelled.');
    },
    onError: () => {
      toast.error('Error cancelling booking.');
    },
  });
};

/**
 * Confirm booking (landlord)
 */
export const useConfirmBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => bookingService.confirmBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      toast.success('Booking confirmed!');
    },
    onError: () => {
      toast.error('Error confirming booking.');
    },
  });
};

/**
 * Reject booking (landlord)
 */
export const useRejectBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }) => bookingService.rejectBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      toast.success('Booking rejected.');
    },
    onError: () => {
      toast.error('Error rejecting booking.');
    },
  });
};

/**
 * Create review for booking
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, reviewData }) => 
      bookingService.createReview(bookingId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      toast.success('Review submitted!');
    },
    onError: () => {
      toast.error('Error submitting review.');
    },
  });
};

