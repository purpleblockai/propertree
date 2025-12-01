/**
 * Sidebar component - Dashboard sidebar navigation
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ items }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white shadow-md min-h-screen">
      <nav className="p-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
              ${
                isActive(item.path)
                  ? 'bg-green-50 text-propertree-green'
                  : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-propertree-blue text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

Sidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};

export default Sidebar;

