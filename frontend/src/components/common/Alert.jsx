/**
 * Alert component - Notification messages
 */
import React from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  className = '' 
}) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      titleColor: 'text-green-800',
      messageColor: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="w-5 h-5 text-blue-600" />,
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
    },
  };
  
  const style = types[type];
  
  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-4 shadow-subtle ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">{style.icon}</div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-semibold ${style.titleColor}`}>{title}</h3>
          )}
          {message && (
            <p className={`${title ? 'mt-1' : ''} text-sm ${style.messageColor} leading-relaxed`}>
              {message}
            </p>
          )}
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 inline-flex text-propertree-dark/40 hover:text-propertree-dark focus:outline-none transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default Alert;

