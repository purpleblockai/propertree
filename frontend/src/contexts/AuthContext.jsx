/**
 * Auth Context - Global authentication state management
 */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../services';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = authService.getCurrentUser();
        const isAuth = authService.isAuthenticated();
        
        if (storedUser && isAuth) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (email, password) => {
    try {
      const { user: userData } = await authService.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (userData) => {
    try {
      await authService.register(userData);
      toast.success('Registration successful! Please log in.');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logout successful!');
  }, []);

  /**
   * Update user data in context
   */
  const updateUser = useCallback((updatedUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUserData }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUserData }));
  }, [user]);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  /**
   * Check if user is landlord
   */
  const isLandlord = useCallback(() => {
    return hasRole('landlord');
  }, [hasRole]);

  /**
   * Check if user is tenant
   */
  const isTenant = useCallback(() => {
    return hasRole('tenant');
  }, [hasRole]);

  /**
   * Check if user is admin
   */
  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  /**
   * Become a host
   */
  const becomeHost = useCallback(async () => {
    try {
      const updatedUser = await authService.updateProfile({ role: 'landlord' });
      setUser(updatedUser);
      toast.success('Welcome as a host!');
      return updatedUser;
    } catch (error) {
      toast.error('Error becoming a host.');
      throw error;
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isLandlord,
    isTenant,
    isAdmin,
    becomeHost,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

