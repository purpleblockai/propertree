/**
 * Card component - Container with shadow and border
 */
import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className = '', hover = false, padding = true }) => {
  const hoverClass = hover ? 'hover:shadow-card-hover transition-all duration-300 cursor-pointer hover:-translate-y-1' : '';
  const paddingClass = padding ? 'p-4 sm:p-6' : '';
  
  return (
    <div className={`bg-white rounded-2xl shadow-card border border-propertree-cream-300 ${paddingClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  padding: PropTypes.bool,
};

const CardHeader = ({ children, className = '' }) => {
  return <div className={`mb-3 sm:mb-4 ${className}`}>{children}</div>;
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const CardTitle = ({ children, className = '' }) => {
  return <h3 className={`text-lg sm:text-xl font-semibold text-gray-900 ${className}`}>{children}</h3>;
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const CardBody = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const CardFooter = ({ children, className = '' }) => {
  return <div className={`mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-gray-200 ${className}`}>{children}</div>;
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
