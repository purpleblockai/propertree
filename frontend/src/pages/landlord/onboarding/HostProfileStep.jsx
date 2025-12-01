/**
 * Step 10: Host Profile
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TextArea } from '../../../components/common';
import { User } from 'lucide-react';

const HostProfileStep = ({ formData, updateFormData }) => {
  return (
    <div>
      <p className="text-gray-600 mb-6">Tell guests about yourself</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => updateFormData({ host_profile_photo: e.target.files[0] })}
              className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-propertree-green hover:file:bg-green-100"
            />
          </div>
        </div>
        <TextArea
          label="Bio"
          name="host_bio"
          placeholder="Tell about yourself, your hobbies, what you like to do..."
          value={formData.host_bio}
          onChange={(e) => updateFormData({ host_bio: e.target.value })}
          rows={5}
          maxLength={500}
        />
      </div>
    </div>
  );
};

HostProfileStep.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

export default HostProfileStep;

