/**
 * ServiceBookings page - Admin interface for managing service bookings
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Calendar, Clock, MapPin, User, Wrench } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  getPendingServiceBookings,
  confirmServiceBooking,
  rejectServiceBooking,
} from '../../services/serviceService';
import { Container } from '../../components/layout';
import { Card, Button, Badge, Loading, EmptyState } from '../../components/common';

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

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Handle both "HH:MM:SS" and "HH:MM" formats
    const time = timeString.split(':');
    if (time.length >= 2) {
      const hours = parseInt(time[0], 10);
      const minutes = time[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes} ${ampm}`;
    }
    return timeString;
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <Loading message="Loading service booking requests..." />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Service Booking Requests</h1>
        <p className="text-gray-600 mt-2">
          Review and manage landlord service booking requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <EmptyState
          message="No pending service bookings"
          description="All service booking requests have been processed"
        />
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG.open;
            const priorityColor = PRIORITY_COLORS[booking.priority] || PRIORITY_COLORS.medium;
            const isProcessing = processingId === booking.id;

            return (
              <Card key={booking.id}>
                <Card.Body>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Main Content */}
                    <div className="flex-1 space-y-4">
                      {/* Header with Title and Badges */}
                      <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900">{booking.title}</h3>
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                        <span className={`text-sm font-medium ${priorityColor}`}>
                          {booking.priority.toUpperCase()} Priority
                        </span>
                      </div>

                      {/* Service Details */}
                      {booking.service_catalog && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Wrench className="w-5 h-5 text-blue-600" />
                            <p className="text-sm font-semibold text-blue-900">
                              {booking.service_catalog.name}
                            </p>
                          </div>
                          <p className="text-xs text-blue-700 ml-7">
                            Category: {booking.service_catalog.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                        </div>
                      )}

                      {/* Property and Landlord Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">Property</span>
                          </div>
                          <div className="ml-6">
                            <p className="text-sm font-medium text-gray-900">
                              {booking.rental_property?.title || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {booking.rental_property?.address && `${booking.rental_property.address}, `}
                              {booking.rental_property?.city || ''}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">Landlord</span>
                          </div>
                          <div className="ml-6">
                            <p className="text-sm font-medium text-gray-900">
                              {booking.reported_by?.email || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Information */}
                      {(booking.requested_date || booking.requested_time) && (
                        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100">
                          {booking.requested_date && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">Date:</span>
                              <span>{formatDate(booking.requested_date)}</span>
                            </div>
                          )}
                          {booking.requested_time && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">Time:</span>
                              <span>{formatTime(booking.requested_time)}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Description */}
                      {booking.description && (
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3">
                            {booking.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {booking.status === 'open' && !booking.admin_confirmed_at && (
                      <div className="lg:flex-shrink-0">
                        <div className="flex flex-col gap-3 lg:min-w-[140px]">
                          <Button
                            size="md"
                            variant="success"
                            onClick={() => handleConfirm(booking.id)}
                            disabled={isProcessing}
                            leftIcon={<CheckCircle className="w-4 h-4" />}
                            className="w-full lg:w-auto"
                          >
                            Confirm
                          </Button>
                          <Button
                            size="md"
                            variant="danger"
                            onClick={() => handleReject(booking.id)}
                            disabled={isProcessing}
                            leftIcon={<XCircle className="w-4 h-4" />}
                            className="w-full lg:w-auto"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default ServiceBookings;
