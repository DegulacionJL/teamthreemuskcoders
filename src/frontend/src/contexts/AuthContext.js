import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

// Create the context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Try to get the current user profile
        const response = await api.get('/profile');
        if (response.data && response.data.data) {
          setUser(response.data.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // If the token refresh in api.js fails, it will redirect to login
        // so we don't need to handle that here
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await api.post('/oauth/token', {
        ...credentials,
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        grant_type: 'password',
        scope: '',
      });

      const { access_token, refresh_token, expires_in } = response.data;

      // Store tokens in localStorage (your api.js will use these)
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_in', expires_in);

      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Get user profile
      const userResponse = await api.get('/profile');
      setUser(userResponse.data.data);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint if available
      if (isAuthenticated) {
        await api.delete('/oauth/token');
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear localStorage
      localStorage.clear();

      // Remove auth header
      delete api.defaults.headers.common['Authorization'];

      // Update state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      await api.post('/register', userData);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
