/**
 * ServiceCard component - Display a service catalog item
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Wrench,
  Zap,
  Wind,
  Paintbrush,
  Droplets,
  Lock,
  Leaf,
  Bug,
  Sparkles,
  Home,
  Settings,
} from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

// Map service categories to icons
const ICON_MAP = {
  plumbing: Droplets,
  electrical: Zap,
  hvac: Wind,
  appliance: Settings,
  cleaning: Sparkles,
  painting: Paintbrush,
  carpentry: Wrench,
  locksmith: Lock,
  gardening: Leaf,
  pest_control: Bug,
  general_maintenance: Home,
  other: Wrench,
};

// Map service categories to colors
const COLOR_MAP = {
  plumbing: 'bg-blue-100 text-blue-600',
  electrical: 'bg-yellow-100 text-yellow-600',
  hvac: 'bg-cyan-100 text-cyan-600',
  appliance: 'bg-gray-100 text-gray-600',
  cleaning: 'bg-pink-100 text-pink-600',
  painting: 'bg-purple-100 text-purple-600',
  carpentry: 'bg-orange-100 text-orange-600',
  locksmith: 'bg-gray-100 text-gray-700',
  gardening: 'bg-green-100 text-green-600',
  pest_control: 'bg-red-100 text-red-600',
  general_maintenance: 'bg-teal-100 text-teal-600',
  other: 'bg-gray-100 text-gray-600',
};

const ServiceCard = ({ service, onBook }) => {
  const Icon = ICON_MAP[service.category] || ICON_MAP.other;
  const colorClass = COLOR_MAP[service.category] || COLOR_MAP.other;

  const formatDuration = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours}h ${mins}m`;
  };

  const formatPriceRange = () => {
    if (service.estimated_price_min && service.estimated_price_max) {
      return `$${service.estimated_price_min} - $${service.estimated_price_max}`;
    }
    return 'Price on request';
  };

  return (
    <Card hover className="h-full flex flex-col">
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className={`w-14 h-14 ${colorClass} rounded-xl flex items-center justify-center`}>
            <Icon className="w-7 h-7" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {service.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {service.description}
          </p>

          {/* Price and Duration */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-900">
                {formatPriceRange()}
              </span>
              {service.estimated_duration_minutes && (
                <span className="text-xs text-gray-500">
                  ~{formatDuration(service.estimated_duration_minutes)}
                </span>
              )}
            </div>
          </div>

          {/* Book Button */}
          <Button size="sm" fullWidth onClick={() => onBook(service)}>
            Book Service
          </Button>
        </div>
      </div>
    </Card>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    estimated_price_min: PropTypes.string,
    estimated_price_max: PropTypes.string,
    estimated_duration_minutes: PropTypes.number,
    icon: PropTypes.string,
    is_active: PropTypes.bool,
  }).isRequired,
  onBook: PropTypes.func.isRequired,
};

export default ServiceCard;
