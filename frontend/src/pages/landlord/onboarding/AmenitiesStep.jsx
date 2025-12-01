/**
 * Step 6: Amenities Selection
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Wifi, Car, Utensils, Tv, Wind, Waves, Dumbbell, Coffee } from 'lucide-react';
import { Checkbox } from '../../../components/common';

const AMENITIES = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'kitchen', label: 'Kitchen', icon: Utensils },
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'ac', label: 'Air Conditioning', icon: Wind },
  { id: 'pool', label: 'Pool', icon: Waves },
  { id: 'gym', label: 'Gym', icon: Dumbbell },
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
];

const AmenitiesStep = ({ formData, updateFormData }) => {
  const handleToggle = (amenityId) => {
    const current = formData.amenities || [];
    const updated = current.includes(amenityId)
      ? current.filter(id => id !== amenityId)
      : [...current, amenityId];
    updateFormData({ amenities: updated });
  };

  return (
    <div>
      <p className="text-gray-600 mb-6">What amenities do you offer?</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {AMENITIES.map(amenity => {
          const Icon = amenity.icon;
          const isSelected = (formData.amenities || []).includes(amenity.id);
          
          return (
            <button
              key={amenity.id}
              type="button"
              onClick={() => handleToggle(amenity.id)}
              className={`p-4 border-2 rounded-lg transition-all ${
                isSelected ? 'border-propertree-green bg-green-50' : 'border-gray-300'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? 'text-propertree-green' : 'text-gray-600'}`} />
              <p className={`font-medium text-sm ${isSelected ? 'text-propertree-green' : 'text-gray-900'}`}>
                {amenity.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

AmenitiesStep.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

export default AmenitiesStep;

