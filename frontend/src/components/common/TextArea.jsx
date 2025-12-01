/**
 * TextArea component - Multi-line text input
 */
import React from 'react';
import PropTypes from 'prop-types';

const TextArea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
  className = '',
  ...props
}) => {
  const hasError = touched && error;
  const charCount = value?.length || 0;
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-propertree-dark mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          block w-full rounded-xl border ${hasError ? 'border-red-500' : 'border-propertree-cream-300'}
          px-4 py-2.5 text-propertree-dark placeholder-propertree-dark/40 shadow-subtle
          focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-propertree-green-500'} focus:border-transparent
          disabled:bg-propertree-cream-200 disabled:cursor-not-allowed
          resize-vertical transition-all duration-200
        `}
        {...props}
      />
      
      <div className="flex justify-between mt-1.5">
        {hasError ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <span />
        )}
        
        {maxLength && (
          <p className="text-sm text-propertree-dark/60">
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

TextArea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  className: PropTypes.string,
};

export default TextArea;

