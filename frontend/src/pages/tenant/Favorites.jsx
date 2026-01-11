/**
 * Tenant Favorites Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/layout';
import { Card, Loading, Badge } from '../../components/common';
import { Home as HomeIcon, MapPin, Users, Bed, Heart } from 'lucide-react';
import { useFavorites, useFavorite } from '../../hooks/useProperties';
import { formatCurrency } from '../../utils/formatters';

const Favorites = () => {
  const { data: favoritesData, isLoading, error } = useFavorites();
  const { removeFavorite } = useFavorite();

  const handleRemoveFavorite = (e, favoriteId) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite.mutate(favoriteId);
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="text-center py-12">
          <p className="text-red-600">Error loading favorites. Please try again.</p>
        </div>
      </Container>
    );
  }

  const favorites = favoritesData?.results || favoritesData || [];
  const properties = favorites
    .map(fav => fav.property)
    .filter(property => property !== null && property !== undefined);

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
        <p className="text-gray-600">
          {properties.length} {properties.length === 1 ? 'favorite property' : 'favorite properties'}
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600 mb-6">
            Explore properties and add them to your favorites by clicking the heart icon
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-propertree-green text-white rounded-lg hover:bg-propertree-green-700 transition-colors"
          >
            Explore Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const favorite = favorites.find(fav => 
              (fav.property?.id || fav.property) === (property.id || property)
            );
            
            return (
              <Link key={property.id} to={`/properties/${property.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden relative">
                  {/* Property Image */}
                  <div className="card-media bg-gray-200 overflow-hidden rounded-t-2xl relative">
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
                      onClick={(e) => handleRemoveFavorite(e, favorite.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
                      aria-label="Remove from favorites"
                    >
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    </button>
                  </div>

                  <Card.Body className="p-4 sm:p-5">
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
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 mb-5">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1.5" />
                        {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1.5" />
                        {property.max_guests} {property.max_guests === 1 ? 'guest' : 'guests'}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-propertree-green">
                          {formatCurrency(property.price_per_night)}
                        </span>
                        <span className="text-gray-600 text-sm ml-1"> / night</span>
                      </div>
                      <Badge variant="success">{property.property_type}</Badge>
                    </div>

                    {/* Landlord */}
                    <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
                      Hosted by {property.landlord_name}
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default Favorites;

