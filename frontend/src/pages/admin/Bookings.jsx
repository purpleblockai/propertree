/**
 * Admin Bookings Management - View and manage bookings requiring admin approval
 */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Container } from '../../components/layout';
import { Card, Button, Loading, Alert, Badge, Select, Input } from '../../components/common';
import { Calendar, User, Home, CheckCircle, XCircle, Search, Filter, X } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [filterOptions, setFilterOptions] = useState({ countries: [], cities: [] });
  const [loadingFilters, setLoadingFilters] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [countryFilter, cityFilter]);

  useEffect(() => {
    fetchFilterOptions();
  }, [countryFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (countryFilter) params.country = countryFilter;
      if (cityFilter) params.city = cityFilter;
      
      const response = await api.get('/bookings/admin/', { params });
      // Handle paginated response - data is in response.data.results
      const bookingsData = response.data.results || response.data;
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error loading bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    setLoadingFilters(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const params = new URLSearchParams();
      if (countryFilter) {
        params.append('country', countryFilter);
      }
      const queryString = params.toString();
      const url = `${API_BASE_URL}/admin/properties/filter-options${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (countryFilter && data.cities) {
          setFilterOptions({
            countries: data.countries || filterOptions.countries,
            cities: data.cities || []
          });
        } else if (data.cities_by_country) {
          const allCities = Object.values(data.cities_by_country).flat();
          setFilterOptions({
            countries: data.countries || [],
            cities: allCities
          });
        } else {
          setFilterOptions({
            countries: data.countries || [],
            cities: []
          });
        }
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    } finally {
      setLoadingFilters(false);
    }
  };

  const clearFilters = () => {
    setCountryFilter('');
    setCityFilter('');
    setSearchTerm('');
    setFilter('all');
  };

  const hasActiveFilters = countryFilter || cityFilter || searchTerm || filter !== 'all';

  const handleConfirm = async (bookingId) => {
    try {
      await api.post(`/bookings/admin/${bookingId}/confirm/`);
      toast.success('Booking confirmed successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error(error.response?.data?.error || 'Failed to confirm booking');
    }
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) {
      return;
    }

    try {
      await api.post(`/bookings/admin/${bookingId}/reject/`);
      toast.success('Booking rejected');
      fetchBookings();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error(error.response?.data?.error || 'Failed to reject booking');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredBookings = bookings
    .filter(booking => {
      if (filter === 'all') return true;
      return booking.status === filter;
    })
    .filter(booking => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        booking.property_title?.toLowerCase().includes(search) ||
        booking.tenant_name?.toLowerCase().includes(search) ||
        booking.tenant_email?.toLowerCase().includes(search) ||
        booking.property_city?.toLowerCase().includes(search)
      );
    })
    .filter(booking => {
      if (!countryFilter) return true;
      return booking.property_country === countryFilter;
    })
    .filter(booking => {
      if (!cityFilter) return true;
      return booking.property_city === cityFilter;
    });

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
          <p className="text-gray-600">
            Manage bookings for properties requiring admin approval
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <Card.Body className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-600" />
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Filter className="w-10 h-10 text-yellow-600" />
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {bookings.filter(b => b.status === 'cancelled').length}
                </p>
              </div>
              <XCircle className="w-10 h-10 text-red-600" />
            </Card.Body>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <Card.Body>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <Input
                    leftIcon={<Search className="w-5 h-5" />}
                    placeholder="Search by property, tenant, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Country Filter */}
                <div className="w-full md:w-48">
                  <Select
                    name="country"
                    value={countryFilter}
                    onChange={(e) => {
                      setCountryFilter(e.target.value);
                      setCityFilter(''); // Reset city when country changes
                    }}
                    options={[
                      { value: '', label: 'All Countries' },
                      ...filterOptions.countries.map(country => ({ value: country, label: country }))
                    ]}
                    placeholder="All Countries"
                    disabled={loadingFilters}
                  />
                </div>

                {/* City Filter */}
                <div className="w-full md:w-48">
                  <Select
                    name="city"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    options={[
                      { value: '', label: 'All Cities' },
                      ...filterOptions.cities.map(city => ({ value: city, label: city }))
                    ]}
                    placeholder={countryFilter ? 'All Cities' : 'Select Country First'}
                    disabled={loadingFilters || !countryFilter}
                  />
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<X className="w-4 h-4" />}
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'outline'}
                  onClick={() => setFilter('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filter === 'pending' ? 'warning' : 'outline'}
                  onClick={() => setFilter('pending')}
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  variant={filter === 'confirmed' ? 'success' : 'outline'}
                  onClick={() => setFilter('confirmed')}
                  size="sm"
                >
                  Confirmed
                </Button>
                <Button
                  variant={filter === 'cancelled' ? 'danger' : 'outline'}
                  onClick={() => setFilter('cancelled')}
                  size="sm"
                >
                  Cancelled
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Alert
            type="info"
            title="No Bookings Found"
            message={
              searchTerm
                ? 'No bookings match your search criteria.'
                : filter !== 'all'
                ? `No ${filter} bookings found.`
                : 'No bookings requiring admin approval yet.'
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <Card key={booking.id}>
                <Card.Body>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                            <Home className="w-5 h-5 text-gray-600" />
                            {booking.property_title}
                          </h3>
                          <p className="text-sm text-gray-600">{booking.property_city}</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Tenant:</span>
                          <span>{booking.tenant_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Dates:</span>
                          <span>
                            {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-gray-700">
                          <span className="font-medium">Guests:</span> {booking.guests_count}
                        </div>
                        <div className="text-gray-700">
                          <span className="font-medium">Duration:</span> {booking.duration_nights} night{booking.duration_nights !== 1 ? 's' : ''}
                        </div>
                        <div className="text-gray-700">
                          <span className="font-medium">Total Price:</span> {formatCurrency(parseFloat(booking.total_price) || 0)}
                        </div>
                        <div className="text-gray-700">
                          <span className="font-medium">Created:</span> {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {booking.cancellation_reason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                          <strong>Cancellation Reason:</strong> {booking.cancellation_reason}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {booking.status === 'pending' && (
                      <div className="flex md:flex-col gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          leftIcon={<CheckCircle />}
                          onClick={() => handleConfirm(booking.id)}
                          className="flex-1 md:flex-none"
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<XCircle />}
                          onClick={() => handleReject(booking.id)}
                          className="flex-1 md:flex-none"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default AdminBookings;
