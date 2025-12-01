/**
 * Navbar component - Main navigation bar
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Avatar, Button } from '../common';
import { Menu, X, Home, Heart, Calendar, LayoutDashboard, LogOut, User, Wrench, TrendingUp, Activity } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isLandlord, isTenant, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (isLandlord()) return '/landlord/dashboard';
    if (isTenant()) return '/tenant/bookings';
    return '/admin/dashboard';
  };

  return (
    <nav className="bg-white shadow-subtle sticky top-0 z-40 border-b border-propertree-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo.jpg" alt="Propertree" className="h-10 w-auto object-contain" />
              <span className="text-2xl font-bold text-propertree-dark">Propertree</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isTenant() && (
                  <>
                    <Link
                      to="/tenant/bookings"
                      className="text-propertree-dark hover:text-propertree-green px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Calendar className="w-4 h-4" />
                      My Bookings
                    </Link>
                    <Link
                      to="/tenant/favorites"
                      className="text-propertree-dark hover:text-propertree-green px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Heart className="w-4 h-4" />
                      Favorites
                    </Link>
                  </>
                )}

                {isLandlord() && (
                  <>
                    <Link
                      to="/landlord/dashboard"
                      className="text-propertree-dark hover:text-propertree-green px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/landlord/properties"
                      className="text-propertree-dark hover:text-propertree-green px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      My Properties
                    </Link>
                    <Link
                      to="/landlord/bookings"
                      className="text-propertree-dark hover:text-propertree-green px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Calendar className="w-4 h-4" />
                      Bookings
                    </Link>
                    <Link
                      to="/landlord/services"
                      className="text-propertree-dark hover:text-propertree-green px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Wrench className="w-4 h-4" />
                      Services
                    </Link>
                  </>
                )}

                {isAdmin() && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="text-propertree-dark hover:text-propertree-green px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/properties"
                      className="text-propertree-dark hover:text-propertree-green px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Properties
                    </Link>
                    <Link
                      to="/admin/bookings"
                      className="text-propertree-dark hover:text-propertree-green px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Calendar className="w-4 h-4" />
                      Bookings
                    </Link>
                    <Link
                      to="/admin/service-bookings"
                      className="text-propertree-dark hover:text-propertree-green px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Wrench className="w-4 h-4" />
                      Service Requests
                    </Link>
                    <Link
                      to="/admin/users"
                      className="text-propertree-dark hover:text-propertree-green px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <User className="w-4 h-4" />
                      Users
                    </Link>
                    <Link
                      to="/admin/analytics"
                      className="text-propertree-dark hover:text-propertree-green px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Analytics
                    </Link>
                    <Link
                      to="/admin/performance"
                      className="text-propertree-dark hover:text-propertree-green px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Activity className="w-4 h-4" />
                      Performance
                    </Link>
                  </>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <Avatar 
                      src={user?.profile_photo} 
                      name={user?.first_name} 
                      size="sm" 
                    />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card py-1 border border-propertree-cream-300">
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-propertree-dark hover:text-propertree-green hover:bg-propertree-cream-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {isLandlord() && (
                  <>
                    <Link
                      to="/landlord/properties"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Properties
                    </Link>
                    <Link
                      to="/landlord/bookings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Bookings
                    </Link>
                    <Link
                      to="/landlord/services"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Services
                    </Link>
                  </>
                )}
                {isTenant() && (
                  <>
                    <Link
                      to="/tenant/bookings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/tenant/favorites"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Favorites
                    </Link>
                  </>
                )}
                {isAdmin() && (
                  <>
                    <Link
                      to="/admin/properties"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Properties
                    </Link>
                    <Link
                      to="/admin/bookings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Bookings
                    </Link>
                    <Link
                      to="/admin/service-bookings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Service Requests
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/analytics"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Analytics
                    </Link>
                    <Link
                      to="/admin/performance"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Performance
                    </Link>
                  </>
                )}
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-propertree-blue hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

