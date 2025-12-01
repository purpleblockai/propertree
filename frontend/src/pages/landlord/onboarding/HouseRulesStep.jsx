/**
 * Step 9: House Rules
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Input, TextArea, Checkbox } from '../../../components/common';

const HouseRulesStep = ({ formData, updateFormData }) => {
  return (
    <div>
      <p className="text-gray-600 mb-6">Add title, description and house rules</p>
      <div className="space-y-4">
        <Input
          label="Listing Title"
          name="title"
          placeholder="Cozy apartment in downtown"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          required
        />
        <TextArea
          label="Description"
          name="description"
          placeholder="Describe your property..."
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={4}
          maxLength={500}
          required
        />
        <TextArea
          label="House Rules"
          name="house_rules"
          placeholder="E.g: No smoking, Quiet hours after 10pm..."
          value={formData.house_rules}
          onChange={(e) => updateFormData({ house_rules: e.target.value })}
          rows={3}
        />
        <div className="space-y-2">
          <Checkbox
            name="allows_pets"
            label="Allows pets"
            checked={formData.allows_pets}
            onChange={(e) => updateFormData({ allows_pets: e.target.checked })}
          />
          <Checkbox
            name="allows_smoking"
            label="Allows smoking"
            checked={formData.allows_smoking}
            onChange={(e) => updateFormData({ allows_smoking: e.target.checked })}
          />
          <Checkbox
            name="allows_events"
            label="Allows events"
            checked={formData.allows_events}
            onChange={(e) => updateFormData({ allows_events: e.target.checked })}
          />
        </div>
      </div>
    </div>
  );
};

HouseRulesStep.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

export default HouseRulesStep;

