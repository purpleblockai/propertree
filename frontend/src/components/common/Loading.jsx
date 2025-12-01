/**
 * Loading component - Spinner and skeleton loaders
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  return (
    <Loader2 className={`${sizes[size]} animate-spin text-propertree-blue ${className}`} />
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

export const LoadingOverlay = ({ message = 'Carregando...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90">
      <Spinner size="xl" />
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  );
};

LoadingOverlay.propTypes = {
  message: PropTypes.string,
};

export const SkeletonLine = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
};

SkeletonLine.propTypes = {
  className: PropTypes.string,
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <SkeletonLine className="h-48 w-full mb-4" />
      <SkeletonLine className="h-6 w-3/4 mb-2" />
      <SkeletonLine className="h-4 w-1/2 mb-4" />
      <SkeletonLine className="h-4 w-full mb-2" />
      <SkeletonLine className="h-4 w-5/6" />
    </div>
  );
};

const Loading = ({ fullScreen = false, message }) => {
  if (fullScreen) {
    return <LoadingOverlay message={message} />;
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner size="lg" />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
};

Loading.propTypes = {
  fullScreen: PropTypes.bool,
  message: PropTypes.string,
};

export default Loading;

