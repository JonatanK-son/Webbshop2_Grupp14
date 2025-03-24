import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services';
import api from '../services/api';

// Create context
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const storedUser = userService.getCurrentUser();
      
      if (token && storedUser) {
        // If token exists, consider user authenticated
        setCurrentUser(storedUser);
        setIsAuthenticated(true);
      } else {
        // User data doesn't exist, make sure we're logged out
        userService.logout();
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await userService.login(credentials);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const newUser = await userService.register(userData);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    userService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (userId, userData) => {
    try {
      const updatedUser = await userService.updateUserProfile(userId, userData);
      setCurrentUser(updatedUser);
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  // Check if the current user is an admin
  const isAdmin = () => {
    return currentUser && currentUser.role === 'admin';
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the auth context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 