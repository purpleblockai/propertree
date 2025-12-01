/**
 * ServiceCatalog component - Display all available services
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { getServiceCatalog, getServiceCategories } from '../../services/serviceService';
import ServiceCard from './ServiceCard';

const ServiceCatalog = ({ onBookService }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch service catalog
  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
    refetch: refetchServices
  } = useQuery({
    queryKey: ['service-catalog', selectedCategory],
    queryFn: () => getServiceCatalog(selectedCategory === 'all' ? null : selectedCategory),
    retry: 2,
    staleTime: 30000, // 30 seconds
  });

  // Fetch categories
  const { data: categories = [], error: categoriesError } = useQuery({
    queryKey: ['service-categories'],
    queryFn: getServiceCategories,
    retry: 2,
  });

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-propertree-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (servicesError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-800 font-medium">Failed to load services</p>
        <p className="text-red-600 text-sm mt-2">
          {servicesError.response?.data?.detail || servicesError.message || 'Unknown error occurred'}
        </p>
        {servicesError.response?.status === 401 && (
          <p className="text-sm text-gray-600 mt-2">
            Your session may have expired. Please try logging out and logging back in.
          </p>
        )}
        {servicesError.response?.status === 403 && (
          <p className="text-sm text-gray-600 mt-2">
            You don't have permission to view services. Make sure you're logged in as a landlord.
          </p>
        )}
        <p className="text-sm text-gray-600 mt-2">
          Make sure the backend is running and you've populated the service catalog.
        </p>
        <button
          onClick={() => refetchServices()}
          className="mt-4 px-4 py-2 bg-propertree-green text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Ensure services is an array
  const servicesList = Array.isArray(services) ? services : [];

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      {Array.isArray(categories) && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              selectedCategory === 'all'
                ? 'bg-propertree-green text-white shadow-card'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Services
          </button>
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                selectedCategory === category.value
                  ? 'bg-propertree-green text-white shadow-card'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      {/* Services Grid */}
      {servicesList.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-600 text-lg mb-2">No services available</p>
          <p className="text-gray-500 text-sm">
            Please run the populate script to add sample services:
            <code className="block mt-2 bg-gray-800 text-white p-2 rounded">
              cd backend && python populate_service_catalog.py
            </code>
          </p>
          <button
            onClick={() => refetchServices()}
            className="mt-4 px-4 py-2 bg-propertree-green text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Refresh Services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service) => (
            <ServiceCard key={service.id} service={service} onBook={onBookService} />
          ))}
        </div>
      )}
    </div>
  );
};

ServiceCatalog.propTypes = {
  onBookService: PropTypes.func.isRequired,
};

export default ServiceCatalog;
