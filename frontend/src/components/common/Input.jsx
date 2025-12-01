/**
 * Input component - Form input with label and error
 */
import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const hasError = touched && error;
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-propertree-dark mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full rounded-xl border-2 ${hasError ? 'border-red-500' : 'border-gray-200'}
            ${leftIcon ? 'pl-10' : 'pl-4'} ${rightIcon ? 'pr-10' : 'pr-4'} py-3
            text-gray-900 placeholder-gray-400 bg-white
            shadow-sm hover:shadow-md hover:border-gray-300 hover:bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-propertree-green/20 focus:border-propertree-green focus:shadow-md focus:bg-white
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 disabled:shadow-none
            transition-all duration-300 ease-in-out font-medium text-sm
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {hasError && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
};

export default Input;

