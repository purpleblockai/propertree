/**
 * EmptyState component - Display when no data
 */
import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const EmptyState = ({ 
  icon, 
  title, 
  message, 
  action, 
  actionLabel,
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      {message && (
        <p className="text-sm text-gray-500 max-w-md mb-6">
          {message}
        </p>
      )}
      
      {action && actionLabel && (
        <Button onClick={action} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  action: PropTypes.func,
  actionLabel: PropTypes.string,
  className: PropTypes.string,
};

export default EmptyState;

