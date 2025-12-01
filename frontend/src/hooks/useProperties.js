/**
 * useProperties hook - Property management with TanStack Query
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../services';
import toast from 'react-hot-toast';

/**
 * Fetch properties with filters
 */
export const useProperties = (filters = {}) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch single property by ID
 */
export const useProperty = (id) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getProperty(id),
    enabled: !!id,
  });
};

/**
 * Create new property
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (propertyData) => propertyService.createProperty(propertyData),
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      toast.success('Property created successfully!');
    },
    onError: () => {
      toast.error('Error creating property.');
    },
  });
};

/**
 * Update property
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => propertyService.updateProperty(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['property', variables.id]);
      queryClient.invalidateQueries(['properties']);
      toast.success('Property updated successfully!');
    },
    onError: () => {
      toast.error('Error updating property.');
    },
  });
};

/**
 * Delete property
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => propertyService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      toast.success('Property removed successfully!');
    },
    onError: () => {
      toast.error('Error removing property.');
    },
  });
};

/**
 * Submit property for approval
 */
export const useSubmitProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => propertyService.submitForApproval(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      toast.success('Property submitted for approval!');
    },
    onError: () => {
      toast.error('Error submitting property.');
    },
  });
};

/**
 * Approve property (admin)
 */
export const useApproveProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => propertyService.approveProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      toast.success('Property approved!');
    },
    onError: () => {
      toast.error('Error approving property.');
    },
  });
};

/**
 * Reject property (admin)
 */
export const useRejectProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }) => propertyService.rejectProperty(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      toast.success('Property rejected.');
    },
    onError: () => {
      toast.error('Error rejecting property.');
    },
  });
};

/**
 * Upload property image
 */
export const useUploadPropertyImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ propertyId, imageData }) => 
      propertyService.uploadImage(propertyId, imageData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['property', variables.propertyId]);
      toast.success('Image added!');
    },
    onError: () => {
      toast.error('Error adding image.');
    },
  });
};

/**
 * Add/remove favorite
 */
export const useFavorite = () => {
  const queryClient = useQueryClient();
  
  const addFavorite = useMutation({
    mutationFn: (propertyId) => propertyService.addToFavorites(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
      queryClient.invalidateQueries(['properties']); // Invalidate properties to update favorite status
      toast.success('Added to favorites!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.response?.data?.error || 'Error adding to favorites';
      toast.error(message);
    },
  });

  const removeFavorite = useMutation({
    mutationFn: (favoriteId) => propertyService.removeFromFavorites(favoriteId),
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
      queryClient.invalidateQueries(['properties']); // Invalidate properties to update favorite status
      toast.success('Removed from favorites.');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.response?.data?.error || 'Error removing from favorites';
      toast.error(message);
    },
  });

  return { addFavorite, removeFavorite };
};

/**
 * Get user favorites
 */
export const useFavorites = (options = {}) => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => propertyService.getFavorites(),
    enabled: options.enabled !== false, // Default to true, but can be disabled
    ...options,
  });
};

/**
 * Get amenities
 */
export const useAmenities = () => {
  return useQuery({
    queryKey: ['amenities'],
    queryFn: () => propertyService.getAmenities(),
    staleTime: Infinity, // Amenities rarely change
  });
};

