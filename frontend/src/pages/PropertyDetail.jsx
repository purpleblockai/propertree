/**
 * Property Detail Page - Shows detailed property information
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../components/layout';
import { Card, Button, Badge, Loading, EmptyState } from '../components/common';
import { MapPin, Users, Bed, Bath, Home, ChevronLeft, ChevronRight, Check, X, Wifi, Car, Utensils, Tv, Wind, Waves, Dumbbell, Coffee } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [bookingData, setBookingData] = useState({
    check_in: '',
    check_out: '',
    guests_count: 1
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/properties/${id}/`);
      
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        toast.error('Failed to load property');
        navigate('/search');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Error loading property');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (!bookingData.check_in || !bookingData.check_out) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    const checkIn = new Date(bookingData.check_in);
    const checkOut = new Date(bookingData.check_out);
    
    if (checkIn >= checkOut) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    if (checkIn < new Date()) {
      toast.error('Check-in date cannot be in the past');
      return;
    }

    setBookingLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Please login to make a booking');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/bookings/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          property: property.id,
          check_in: bookingData.check_in,
          check_out: bookingData.check_out,
          guests_count: bookingData.guests_count
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Booking request submitted successfully!');
        setShowBookingModal(false);
        setBookingData({ check_in: '', check_out: '', guests_count: 1 });
        navigate('/tenant/bookings');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Error submitting booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  if (!property) {
    return (
      <Container className="py-8">
        <EmptyState
          icon={<Home className="w-16 h-16" />}
          title="Property not found"
          message="The property you're looking for doesn't exist or has been removed."
          action={() => navigate('/search')}
          actionLabel="Back to Search"
        />
      </Container>
    );
  }

  // Extract photo previews from the photos array
  const photos = property.photos || [];
  const selectedPhoto = photos[selectedImageIndex];

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // Common amenity icons and names mapping
  const amenityConfig = {
    'wifi': { name: 'WiFi', icon: Wifi },
    'parking': { name: 'Parking', icon: Car },
    'kitchen': { name: 'Kitchen', icon: Utensils },
    'gym': { name: 'Gym', icon: Dumbbell },
    'pool': { name: 'Pool', icon: Waves },
    'ac': { name: 'Air Conditioning', icon: Wind },
    'air_conditioning': { name: 'Air Conditioning', icon: Wind },
    'tv': { name: 'TV', icon: Tv },
    'breakfast': { name: 'Breakfast', icon: Coffee },
  };

  const getAmenityConfig = (amenity) => {
    const key = amenity.toLowerCase();
    return amenityConfig[key] || { name: amenity, icon: Check };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Close Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 right-4 z-40 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Property Content */}
      <Container className="py-8">
        <div className="max-w-6xl mx-auto">
          {/* Image Gallery */}
          <div className="mb-8">
            {/* Main Image */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gray-200 mb-4">
              {selectedPhoto ? (
                <img
                  src={selectedPhoto.preview || selectedPhoto.url}
                  alt={property.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setShowLightbox(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-24 h-24 text-gray-400" />
                </div>
              )}

              {/* Navigation Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {photos.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {photos.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {photos.slice(0, 5).map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex
                        ? 'border-propertree-green shadow-md'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {photo.preview || photo.url ? (
                      <img
                        src={photo.preview || photo.url}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Home className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    {index === 4 && photos.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                        +{photos.length - 5}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Title and Price */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600 text-lg mb-4">
                {property.city}, {property.country}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900">
                €{property.price_per_night}
              </div>
              <div className="text-gray-600">per night</div>
            </div>
          </div>

          {/* Property Stats */}
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b">
            <div className="flex items-center gap-2 text-gray-700">
              <Bed className="w-5 h-5 text-gray-600" />
              <span><span className="font-semibold">{property.bedrooms}</span> bedroom{property.bedrooms > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Bath className="w-5 h-5 text-gray-600" />
              <span><span className="font-semibold">{Math.round(property.bathrooms)}</span> bathroom{Math.round(property.bathrooms) > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-5 h-5 text-gray-600" />
              <span>Up to <span className="font-semibold">{property.max_guests}</span> guest{property.max_guests > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this place</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-8 pb-8 border-b">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => {
                  const config = getAmenityConfig(amenity);
                  const IconComponent = config.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <span className="text-gray-700">{config.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ready to Book Section */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to book?</h3>
                <p className="text-gray-600">Experience professional property management</p>
              </div>
              <Button
                onClick={() => setShowBookingModal(true)}
                variant="primary"
                size="lg"
                className="md:w-auto whitespace-nowrap px-8"
              >
                Book Now
              </Button>
            </div>
          </div>

          {/* Host Information */}
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">Hosted by</h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-propertree-green text-white flex items-center justify-center text-xl font-bold">
                {property.landlord_name?.charAt(0) || property.landlord_email?.charAt(0) || 'H'}
              </div>
              <div>
                <div className="font-semibold text-lg">{property.landlord_name || 'Property Host'}</div>
                <div className="text-gray-600">{property.landlord_email}</div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Booking Modal - Will show when Book Now is clicked */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Book This Property</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-propertree-green"
                  value={bookingData.check_in}
                  onChange={(e) => setBookingData({ ...bookingData, check_in: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-propertree-green"
                  value={bookingData.check_out}
                  onChange={(e) => setBookingData({ ...bookingData, check_out: e.target.value })}
                  required
                  min={bookingData.check_in || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-propertree-green"
                  value={bookingData.guests_count}
                  onChange={(e) => setBookingData({ ...bookingData, guests_count: parseInt(e.target.value) })}
                  required
                  min="1"
                  max={property.max_guests}
                />
                <p className="text-xs text-gray-500 mt-1">Max: {property.max_guests} guests</p>
              </div>

              {/* Price Calculation */}
              {bookingData.check_in && bookingData.check_out && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      €{property.price_per_night} x {Math.ceil((new Date(bookingData.check_out) - new Date(bookingData.check_in)) / (1000 * 60 * 60 * 24))} nights
                    </span>
                    <span className="font-semibold">
                      €{(property.price_per_night * Math.ceil((new Date(bookingData.check_out) - new Date(bookingData.check_in)) / (1000 * 60 * 60 * 24))).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-propertree-green">
                      €{(property.price_per_night * Math.ceil((new Date(bookingData.check_out) - new Date(bookingData.check_in)) / (1000 * 60 * 60 * 24))).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePreviousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div className="relative max-w-7xl max-h-[80vh] w-full flex items-center justify-center">
            {selectedPhoto ? (
              <img
                src={selectedPhoto.preview || selectedPhoto.url}
                alt={property.title}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home className="w-24 h-24 text-white/50" />
              </div>
            )}
          </div>

          {/* Image Counter */}
          {photos.length > 1 && (
            <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {selectedImageIndex + 1} / {photos.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
