/**
 * Avatar component - User profile image
 */
import React from 'react';
import PropTypes from 'prop-types';
import { User } from 'lucide-react';
import { getInitials } from '../../utils/formatters';

const Avatar = ({ src, alt, name, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl',
  };
  
  const [imageError, setImageError] = React.useState(false);
  
  const handleError = () => {
    setImageError(true);
  };
  
  // Show image if available and no error
  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        onError={handleError}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }
  
  // Show initials if name is provided
  if (name) {
    return (
      <div
        className={`${sizes[size]} rounded-full bg-gradient-to-br from-propertree-green to-propertree-blue flex items-center justify-center font-semibold text-white shadow-subtle ${className}`}
      >
        {getInitials(name)}
      </div>
    );
  }
  
  // Show default user icon
  return (
    <div
      className={`${sizes[size]} rounded-full bg-propertree-cream-300 flex items-center justify-center shadow-subtle ${className}`}
    >
      <User className="text-propertree-dark/40" />
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string,
};

export default Avatar;

