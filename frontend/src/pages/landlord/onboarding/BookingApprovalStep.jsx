/**
 * Step 8.5: Booking Approval Settings
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Shield, User } from 'lucide-react';

const BookingApprovalStep = ({ formData, updateFormData }) => {
  const approvalOptions = [
    {
      value: 'landlord',
      title: 'Landlord Approval',
      description: 'You will review and approve all booking requests for this property',
      icon: User,
      color: 'blue'
    },
    {
      value: 'admin',
      title: 'Admin Approval',
      description: 'Platform administrators will review and approve booking requests',
      icon: Shield,
      color: 'purple'
    }
  ];

  return (
    <div>
      <p className="text-gray-600 mb-6">
        Choose who should approve booking requests for this property
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {approvalOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = formData.approval_type === option.value;

          return (
            <button
              key={option.value}
              onClick={() => updateFormData({ approval_type: option.value })}
              className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-lg ${
                isSelected
                  ? `border-${option.color}-600 bg-${option.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full ${
                    isSelected
                      ? `bg-${option.color}-100`
                      : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isSelected
                        ? `text-${option.color}-600`
                        : 'text-gray-600'
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-2 ${
                      isSelected
                        ? `text-${option.color}-900`
                        : 'text-gray-900'
                    }`}
                  >
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {option.description}
                  </p>

                  {isSelected && (
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${option.color}-100 text-${option.color}-800`}>
                        Selected
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> You can change this setting later from your property settings.
        </p>
      </div>
    </div>
  );
};

BookingApprovalStep.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

export default BookingApprovalStep;
