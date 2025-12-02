/**
 * My Bookings Page - Tenant view of their bookings
 */
import React, { useState, useEffect } from 'react';
import { Container } from '../../components/layout';
import { Card, Badge, Loading, EmptyState, Button } from '../../components/common';
import { Calendar, MapPin, Home, DollarSign, User, Clock, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/bookings/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data.results || data);
      } else {
        toast.error('Failed to load bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { variant: 'warning', label: 'Pending' },
      confirmed: { variant: 'success', label: 'Confirmed' },
      cancelled: { variant: 'danger', label: 'Cancelled' },
      completed: { variant: 'info', label: 'Completed' },
    };
    
    const config = statusMap[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancellationReason('');
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setCancelling(true);
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/bookings/${selectedBooking.id}/cancel/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cancellation_reason: cancellationReason.trim()
        })
      });

      if (response.ok) {
        toast.success('Booking cancelled successfully');
        setShowCancelModal(false);
        setSelectedBooking(null);
        setCancellationReason('');
        fetchBookings(); // Refresh bookings
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Error cancelling booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-propertree-dark">My Bookings</h1>
        <p className="text-gray-600 mt-2">View and manage your property bookings</p>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-16 h-16" />}
          title="No bookings yet"
          message="You haven't made any bookings. Start exploring properties!"
          action={() => window.location.href = '/search'}
          actionLabel="Browse Properties"
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <Card.Body>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {booking.property_title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {calculateNights(booking.check_in, booking.check_out)} nights
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <div className="text-sm text-gray-600">Guests</div>
                        <div className="font-semibold flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {booking.guests_count}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Total Price</div>
                        <div className="font-semibold flex items-center gap-1 text-propertree-green">
                          <DollarSign className="w-4 h-4" />
                          {parseFloat(booking.total_price).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {booking.status === 'pending' && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          Your booking is pending confirmation from the property owner.
                        </p>
                      </div>
                    )}

                    {booking.status === 'confirmed' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          Your booking is confirmed! You'll receive check-in details closer to your arrival date.
                        </p>
                      </div>
                    )}

                    {booking.status === 'cancelled' && booking.cancellation_reason && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-semibold text-red-800 mb-1">Cancellation Reason:</p>
                        <p className="text-sm text-red-700">{booking.cancellation_reason}</p>
                      </div>
                    )}

                    {/* Cancel Button */}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <div className="mt-4">
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<X className="w-4 h-4" />}
                          onClick={() => handleCancelClick(booking)}
                        >
                          Cancel Booking
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Cancel Booking</h2>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                  setCancellationReason('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Please provide a reason for cancelling this booking. This information will be shared with the property owner.
              </p>
              {selectedBooking && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700">{selectedBooking.property_title}</p>
                  <p className="text-xs text-gray-600">
                    {formatDate(selectedBooking.check_in)} - {formatDate(selectedBooking.check_out)}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="cancellation-reason" className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="cancellation-reason"
                rows={4}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Please explain why you are cancelling this booking..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-propertree-green focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                  setCancellationReason('');
                }}
                disabled={cancelling}
              >
                Keep Booking
              </Button>
              <Button
                variant="danger"
                onClick={handleCancelBooking}
                disabled={cancelling || !cancellationReason.trim()}
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default MyBookings;


