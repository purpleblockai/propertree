/**
 * Button component - Reusable button with variants
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-subtle hover:shadow-card';
  
  const variants = {
    primary: 'bg-propertree-green text-white hover:bg-propertree-green-600 focus:ring-propertree-green-500',
    secondary: 'bg-propertree-blue text-white hover:bg-propertree-blue-600 focus:ring-propertree-blue-500',
    outline: 'border-2 border-propertree-green text-propertree-green hover:bg-propertree-green-50 focus:ring-propertree-green-500',
    ghost: 'text-propertree-dark hover:bg-propertree-cream-200 focus:ring-propertree-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-propertree-green text-white hover:bg-propertree-green-700 focus:ring-propertree-green-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm',
    md: 'px-3.5 py-2 text-sm sm:px-4 sm:py-2 sm:text-base',
    lg: 'px-4 py-2.5 text-base sm:px-6 sm:py-3 sm:text-lg',
    xl: 'px-5 py-3 text-lg sm:px-8 sm:py-4 sm:text-xl',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
};

export default Button;
