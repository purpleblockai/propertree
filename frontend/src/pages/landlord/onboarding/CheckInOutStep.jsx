/**
 * Step 7: Check-in/Check-out Times
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '../../../components/common';
import { Clock } from 'lucide-react';

const CheckInOutStep = ({ formData, updateFormData }) => {
  return (
    <div>
      <p className="text-gray-600 mb-6">Set check-in and check-out times</p>
      <div className="space-y-4">
        <Input
          label="Check-in Time"
          type="time"
          name="check_in_time"
          value={formData.check_in_time}
          onChange={(e) => updateFormData({ check_in_time: e.target.value })}
          leftIcon={<Clock className="w-5 h-5 text-gray-400" />}
          required
        />
        <Input
          label="Check-out Time"
          type="time"
          name="check_out_time"
          value={formData.check_out_time}
          onChange={(e) => updateFormData({ check_out_time: e.target.value })}
          leftIcon={<Clock className="w-5 h-5 text-gray-400" />}
          required
        />
      </div>
    </div>
  );
};

CheckInOutStep.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

export default CheckInOutStep;

