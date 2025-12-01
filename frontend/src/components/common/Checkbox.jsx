/**
 * Checkbox component - Styled checkbox input
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';

const Checkbox = ({
  name,
  label,
  checked,
  onChange,
  disabled = false,
  error,
  touched,
  className = '',
}) => {
  const hasError = touched && error;
  
  return (
    <div className={className}>
      <label className="flex items-start cursor-pointer group">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`
              w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
              ${checked ? 'bg-propertree-green border-propertree-green' : 'bg-white border-propertree-cream-300'}
              ${!disabled && 'group-hover:border-propertree-green-400'}
              ${disabled && 'opacity-50 cursor-not-allowed'}
              ${hasError && 'border-red-500'}
            `}
          >
            {checked && <Check className="w-4 h-4 text-white" />}
          </div>
        </div>
        {label && (
          <span className={`ml-3 text-sm ${disabled ? 'text-propertree-dark/40' : 'text-propertree-dark/80'}`}>
            {label}
          </span>
        )}
      </label>
      
      {hasError && (
        <p className="mt-1 ml-8 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  touched: PropTypes.bool,
  className: PropTypes.string,
};

export default Checkbox;

