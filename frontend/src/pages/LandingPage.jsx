/**
 * Landing Page - Home page with integrated property search
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../components/layout';
import { Button, Input, Select, Card, Loading, Badge } from '../components/common';
import { Home as HomeIcon, MapPin, Users, Bed, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks';
import { useFavorite, useFavorites } from '../hooks/useProperties';

const LandingPage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const resultsRef = useRef(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [shouldScrollToResults, setShouldScrollToResults] = useState(false);
  const [cities, setCities] = useState([]);
  const { addFavorite, removeFavorite } = useFavorite();
  const { data: favoritesData } = useFavorites({ 
    enabled: isAuthenticated 
  });
  
  // Create a map of favorite property IDs for quick lookup
  const favoriteMap = React.useMemo(() => {
    if (!favoritesData) return new Map();
    const map = new Map();
    (favoritesData.results || favoritesData || []).forEach(fav => {
      if (fav.property) {
        map.set(fav.property.id || fav.property, fav.id);
      }
    });
    return map;
  }, [favoritesData]);
  
  const [filters, setFilters] = useState({
    city: '',
    property_type: '',
    guests: '',
    sort_by: 'price_low_high',
    check_in: '',
    check_out: '',
    min_price: '',
    max_price: ''
  });

  const propertyTypes = [
    { value: '', label: t('landing.allTypes') },
    { value: 'apartment', label: t('propertyTypes.apartment') },
    { value: 'house', label: t('propertyTypes.house') },
    { value: 'condo', label: t('propertyTypes.condo') },
    { value: 'villa', label: t('propertyTypes.villa') },
    { value: 'studio', label: t('propertyTypes.studio') },
    { value: 'townhouse', label: t('propertyTypes.townhouse') },
  ];

  const guestOptions = [
    { value: '', label: `1 ${t('landing.guest')}` },
    { value: '1', label: `1 ${t('landing.guest')}` },
    { value: '2', label: `2 ${t('landing.guests')}` },
    { value: '3', label: `3 ${t('landing.guests')}` },
    { value: '4', label: `4 ${t('landing.guests')}` },
    { value: '5', label: `5 ${t('landing.guests')}` },
    { value: '6', label: `6+ ${t('landing.guests')}` },
  ];

  const sortOptions = [
    { value: 'price_low_high', label: t('sortOptions.priceLowHigh') },
    { value: 'price_high_low', label: t('sortOptions.priceHighLow') },
    { value: 'newest', label: t('sortOptions.newest') },
    { value: 'bedrooms', label: t('sortOptions.bedrooms') },
  ];

  useEffect(() => {
    fetchProperties();
    fetchCities();
  }, []);

  // Auto-scroll to results after search completes
  useEffect(() => {
    if (shouldScrollToResults && !searchLoading && resultsRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        const element = resultsRef.current;
        const headerOffset = 96; // adjust if your navbar height changes
        const elementTop = element.getBoundingClientRect().top + window.scrollY;
        const targetPosition = Math.max(elementTop - headerOffset, 0);

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
        setShouldScrollToResults(false);
      }, 100);
    }
  }, [shouldScrollToResults, searchLoading, properties]);

  const fetchCities = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/properties/`);
      if (response.ok) {
        const data = await response.json();
        const allProperties = data.results || data;
        const uniqueCities = [...new Set(allProperties.map(p => p.city))].sort();
        setCities([
          { value: '', label: t('landing.allCities') },
          ...uniqueCities.map(city => ({ value: city, label: city }))
        ]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchProperties = async (searchFilters = {}) => {
    const isSearching = Object.keys(searchFilters).length > 0;
    if (isSearching) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }
    
    try {
      const params = new URLSearchParams();
      
      const activeFilters = { ...filters, ...searchFilters };
      
      if (activeFilters.min_price) params.append('min_price', activeFilters.min_price);
      if (activeFilters.max_price) params.append('max_price', activeFilters.max_price);
      if (activeFilters.guests) params.append('guests', activeFilters.guests);
      if (activeFilters.city) params.append('city', activeFilters.city);
      if (activeFilters.property_type) params.append('property_type', activeFilters.property_type);

      // Apply date range filters so backend can exclude already-booked properties
      if (activeFilters.check_in) params.append('check_in', activeFilters.check_in);
      if (activeFilters.check_out) params.append('check_out', activeFilters.check_out);
      
      // Handle sorting
      if (activeFilters.sort_by) {
        if (activeFilters.sort_by === 'price_low_high') {
          params.append('ordering', 'price_per_night');
        } else if (activeFilters.sort_by === 'price_high_low') {
          params.append('ordering', '-price_per_night');
        } else if (activeFilters.sort_by === 'newest') {
          params.append('ordering', '-created_at');
        } else if (activeFilters.sort_by === 'bedrooms') {
          params.append('ordering', '-bedrooms');
        }
      }

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const url = `${API_BASE_URL}/properties/?${params.toString()}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setProperties(data.results || data);
      } else {
        toast.error(t('errors.failedToLoadProperties'));
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error(t('errors.errorLoadingProperties'));
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShouldScrollToResults(true);
    fetchProperties(filters);
  };

  const handleFilterChange = (name, value) => {
    // Prevent selecting past dates in the search filters
    if (name === 'check_in' || name === 'check_out') {
      if (value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(value);
        selected.setHours(0, 0, 0, 0);

        if (selected < today) {
          toast.error(t('errors.cannotSearchWithPastDates'));
          return;
        }
      }

      // Ensure check-out is always after check-in
      if (name === 'check_in' && filters.check_out && value && value >= filters.check_out) {
        toast.error(t('errors.checkoutMustBeAfterCheckin'));
        return;
      }

      if (name === 'check_out' && filters.check_in && value && value <= filters.check_in) {
        toast.error(t('errors.checkoutMustBeAfterCheckin'));
        return;
      }
    }

    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const todayString = new Date().toISOString().split('T')[0];

  const handleFavoriteClick = async (e, property) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error(t('landing.pleaseLoginToAddFavorites'));
      navigate('/login');
      return;
    }

    const favoriteId = favoriteMap.get(property.id);
    
    if (favoriteId) {
      // Remove from favorites
      removeFavorite.mutate(favoriteId);
    } else {
      // Add to favorites
      addFavorite.mutate(property.id);
    }
  };

  const isPropertyFavorited = (propertyId) => {
    return favoriteMap.has(propertyId);
  };

  if (loading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section 
        className="relative bg-gradient-to-br from-propertree-green via-propertree-blue to-propertree-green-700 py-14 md:py-16 lg:py-20 text-white"
      >
        <Container>
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              {t('landing.title')}
            </h1>
            <p className="text-xl mb-12 text-white/90 max-w-3xl mx-auto">
              {t('landing.subtitle')}
            </p>

            {/* Search Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-6xl mx-auto">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                      {t('landing.city')}
                    </label>
                    <Select
                      name="city"
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      options={cities}
                      placeholder={t('landing.allCities')}
                      className="w-full"
                    />
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                      {t('landing.propertyType')}
                    </label>
                    <Select
                      name="property_type"
                      value={filters.property_type}
                      onChange={(e) => handleFilterChange('property_type', e.target.value)}
                      options={propertyTypes}
                      placeholder={t('landing.allTypes')}
                      className="w-full"
                    />
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                      {t('landing.guests')}
                    </label>
                    <Select
                      name="guests"
                      value={filters.guests}
                      onChange={(e) => handleFilterChange('guests', e.target.value)}
                      options={guestOptions}
                      placeholder={`1 ${t('landing.guest')}`}
                      className="w-full"
                    />
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                      {t('landing.sortBy')}
                    </label>
                    <Select
                      name="sort_by"
                      value={filters.sort_by}
                      onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                      options={sortOptions}
                      placeholder={t('landing.sortBy')}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Check-in */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                      {t('landing.checkIn')}
                    </label>
                    <Input
                      name="check_in"
                      type="date"
                      value={filters.check_in}
                      onChange={(e) => handleFilterChange('check_in', e.target.value)}
                      className="w-full"
                      min={todayString}
                    />
                  </div>

                  {/* Check-out */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                      {t('landing.checkOut')}
                    </label>
                    <Input
                      name="check_out"
                      type="date"
                      value={filters.check_out}
                      onChange={(e) => handleFilterChange('check_out', e.target.value)}
                      className="w-full"
                      min={filters.check_in || todayString}
                    />
                  </div>

                  {/* Min Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                      {t('landing.minPrice')}
                    </label>
                    <Input
                      name="min_price"
                      type="number"
                      placeholder="0"
                      value={filters.min_price}
                      onChange={(e) => handleFilterChange('min_price', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                      {t('landing.maxPrice')}
                    </label>
                    <Input
                      name="max_price"
                      type="number"
                      placeholder="500"
                      value={filters.max_price}
                      onChange={(e) => handleFilterChange('max_price', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    className="w-full md:w-auto px-16"
                    disabled={searchLoading}
                  >
                    {searchLoading ? t('landing.searching') : t('landing.searchProperties')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </section>

      {/* Properties Grid */}
      <section
        ref={resultsRef}
        id="properties-section"
        className="py-12 md:py-16 bg-gray-50"
      >
        <Container>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {filters.city || filters.property_type || filters.guests ? t('landing.searchResults') : t('landing.featuredProperties')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('landing.propertiesAvailable', { count: properties.length })}
            </p>
          </div>

          {searchLoading ? (
            <div className="text-center py-12">
              <Loading />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <HomeIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('landing.noPropertiesFound')}</h3>
              <p className="text-gray-600">{t('landing.tryAdjustingFilters')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link key={property.id} to={`/properties/${property.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden relative">
                    {/* Property Image */}
                    <div className="h-56 bg-gray-200 overflow-hidden rounded-t-2xl relative">
                      {property.primary_photo ? (
                        <img 
                          src={property.primary_photo} 
                          alt={property.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HomeIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => handleFavoriteClick(e, property)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
                        aria-label={isPropertyFavorited(property.id) ? t('landing.removeFromFavorites') : t('landing.addToFavorites')}
                      >
                        <Heart 
                          className={`w-5 h-5 transition-colors ${
                            isPropertyFavorited(property.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-600 hover:text-red-500'
                          }`}
                        />
                      </button>
                    </div>

                    <Card.Body className="p-5">
                      {/* Location */}
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        {property.city}, {property.state}, {property.country}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-1">
                        {property.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                        {property.description}
                      </p>

                      {/* Property Details */}
                      <div className="flex items-center gap-5 text-sm text-gray-600 mb-5">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1.5" />
                          {property.bedrooms} {property.bedrooms > 1 ? t('landing.beds') : t('landing.bed')}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1.5" />
                          {property.max_guests} {property.max_guests > 1 ? t('landing.guests') : t('landing.guest')}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-propertree-green">
                            ${property.price_per_night}
                          </span>
                          <span className="text-gray-600 text-sm ml-1">{t('landing.night')}</span>
                        </div>
                        <Badge variant="success">{propertyTypes.find(pt => pt.value === property.property_type)?.label || property.property_type}</Badge>
                      </div>

                      {/* Landlord */}
                      <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
                        {t('landing.hostedBy')} {property.landlord_name}
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;

