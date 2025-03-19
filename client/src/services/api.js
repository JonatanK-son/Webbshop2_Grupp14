import axios from 'axios';

// Get the base URL from environment variables or use the default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL);

// Create an Axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to check if JWT token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Get the payload part of the JWT
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    return exp < Date.now() / 1000;
  } catch (e) {
    console.error('Error parsing JWT token:', e);
    return true;
  }
};

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    
    // Check if token is expired
    if (token && isTokenExpired(token)) {
      console.log('Token expired, logging out');
      // Clear token and user data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Optional: Reload page or redirect to login
      // window.location.href = '/login';
      
      // Don't add expired token to request
      return config;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response) {
      // Server responded with an error status code
      console.error('API Error:', error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Handle unauthorized access - clear local storage
        console.log('Unauthorized access, logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Optional: Reload page to reset app state
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 