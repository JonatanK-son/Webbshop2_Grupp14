import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem('token');
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
        // Handle unauthorized access
        console.log('Unauthorized access');
        // You might want to redirect to login page
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