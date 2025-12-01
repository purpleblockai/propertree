/**
 * ServiceBookings page - Admin interface for managing service bookings
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Calendar, Clock, MapPin, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  getPendingServiceBookings,
  confirmServiceBooking,
  rejectServiceBooking,
} from '../../services/serviceService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

const STATUS_CONFIG = {
  open: { variant: 'warning', label: 'Pending Confirmation' },
  assigned: { variant: 'info', label: 'Confirmed' },
  in_progress: { variant: 'primary', label: 'In Progress' },
  resolved: { variant: 'success', label: 'Completed' },
  cancelled: { variant: 'error', label: 'Cancelled' },
};

const PRIORITY_COLORS = {
  low: 'text-gray-600',
  medium: 'text-blue-600',
  high: 'text-orange-600',
  urgent: 'text-red-600 font-bold',
};

const ServiceBookings = () => {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-pending-service-bookings'],
    queryFn: getPendingServiceBookings,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const confirmMutation = useMutation({
    mutationFn: ({ bookingId }) => confirmServiceBooking(bookingId),
    onMutate: ({ bookingId }) => setProcessingId(bookingId),
    onSuccess: () => {
      toast.success('Service booking confirmed successfully!');
      queryClient.invalidateQueries(['admin-pending-service-bookings']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to confirm booking');
    },
    onSettled: () => setProcessingId(null),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ bookingId, reason }) => rejectServiceBooking(bookingId, reason),
    onMutate: ({ bookingId }) => setProcessingId(bookingId),
    onSuccess: () => {
      toast.success('Service booking rejected');
      queryClient.invalidateQueries(['admin-pending-service-bookings']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to reject booking');
    },
    onSettled: () => setProcessingId(null),
  });

  const handleConfirm = (bookingId) => {
    confirmMutation.mutate({ bookingId });
  };

  const handleReject = (bookingId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason && reason.trim()) {
      rejectMutation.mutate({ bookingId, reason: reason.trim() });
    } else if (reason !== null) {
      toast.error('Rejection reason is required');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return <Loading message="Loading service booking requests..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-propertree-dark">Service Booking Requests</h1>
        <p className="text-gray-600 mt-2">
          Review and manage landlord service booking requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pending Requests</p>
          <p className="text-2xl font-bold text-propertree-dark mt-1">{bookings.length}</p>
        </Card>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <EmptyState
          message="No pending service bookings"
          description="All service booking requests have been processed"
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG.open;
            const priorityColor = PRIORITY_COLORS[booking.priority] || PRIORITY_COLORS.medium;
            const isProcessing = processingId === booking.id;

            return (
              <Card key={booking.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                      <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                      <span className={`text-sm ${priorityColor}`}>
                        {booking.priority.toUpperCase()} Priority
                      </span>
                    </div>

                    {/* Property and Landlord Info */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="font-medium">Property:</span>
                        </div>
                        <p className="text-sm text-gray-900 ml-5">
                          {booking.rental_property?.title}
                        </p>
                        <p className="text-xs text-gray-500 ml-5">
                          {booking.rental_property?.address}, {booking.rental_property?.city}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <User className="w-4 h-4 mr-1" />
                          <span className="font-medium">Landlord:</span>
                        </div>
                        <p className="text-sm text-gray-900 ml-5">
                          {booking.reported_by?.email}
                        </p>
                      </div>
                    </div>

                    {/* Service Details */}
                    {booking.service_catalog && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <p className="text-sm font-medium text-blue-900">
                          Service: {booking.service_catalog.name}
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Category: {booking.service_catalog.category}
                        </p>
                      </div>
                    )}

                    {/* Schedule */}
                    <div className="flex gap-4 text-sm text-gray-600 mb-3">
                      {booking.requested_date && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(booking.requested_date)}</span>
                        </div>
                      )}
                      {booking.requested_time && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{booking.requested_time}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                      <p className="text-sm text-gray-600">{booking.description}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === 'open' && !booking.admin_confirmed_at && (
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleConfirm(booking.id)}
                        disabled={isProcessing}
                        leftIcon={<CheckCircle className="w-4 h-4" />}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(booking.id)}
                        disabled={isProcessing}
                        leftIcon={<XCircle className="w-4 h-4" />}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServiceBookings;
