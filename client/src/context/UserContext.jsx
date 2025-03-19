import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services';
import api from '../services/api';

// Create context
const UserContext = createContext();

// Function to check if token is valid (can be shared with api.js)
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Get the payload part of the JWT
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    
    // Check if token is NOT expired (exp is in seconds, Date.now() is in milliseconds)
    return exp > Date.now() / 1000;
  } catch (e) {
    console.error('Error parsing JWT token:', e);
    return false;
  }
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on initial load
  useEffect(() => {
    const validateAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const storedUser = userService.getCurrentUser();
      
      // Check if token exists and is valid
      if (token && storedUser && isTokenValid(token)) {
        try {
          // Try to validate token with a backend request
          try {
            await api.get('/users/validate-token');
          } catch (endpointErr) {
            // If endpoint doesn't exist, use profile fetch as validation
            console.log('Token validation endpoint not found, using profile endpoint instead');
            if (storedUser && storedUser.id) {
              await api.get(`/users/${storedUser.id}`);
            }
          }
          
          // If we get here, token is valid (no 401 error)
          setCurrentUser(storedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token validation error:', error);
          // Token is invalid or expired, clear user data
          userService.logout();
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } else if (token && !isTokenValid(token)) {
        console.log('Token expired, logging out');
        userService.logout();
        setCurrentUser(null);
        setIsAuthenticated(false);
      } else if (!token && storedUser) {
        // User data exists but no token, clear user data
        userService.logout();
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };
    
    validateAuth();
    
    // Set up an interval to validate token periodically (every 5 minutes)
    const intervalId = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token && !isTokenValid(token)) {
        console.log('Token expired during session, logging out');
        userService.logout();
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
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