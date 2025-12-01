/**
 * Step 4: Address Information
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '../../../components/common';
import { MapPin } from 'lucide-react';

const AddressStep = ({ formData, updateFormData }) => {
  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <p className="text-gray-600 mb-6">
        Where is your property located?
      </p>

      <div className="space-y-4">
        <Input
          label="Address"
          name="address"
          placeholder="Street, Number, Details"
          value={formData.address}
          onChange={handleChange}
          leftIcon={<MapPin className="w-5 h-5 text-gray-400" />}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            name="city"
            placeholder="New York"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <Input
            label="State"
            name="state"
            placeholder="NY"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Country"
            name="country"
            placeholder="United States"
            value={formData.country}
            onChange={handleChange}
            required
          />

          <Input
            label="Postal Code"
            name="postal_code"
            placeholder="10001"
            value={formData.postal_code}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          📍 Your full address will only be shared after booking confirmation
        </p>
      </div>
    </div>
  );
};

AddressStep.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

export default AddressStep;

