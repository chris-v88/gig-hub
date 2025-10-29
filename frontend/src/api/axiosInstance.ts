import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

if (!apiUrl) {
  throw new Error(
    'REACT_APP_API_URL environment variable is not set. Please configure it in your .env file.'
  );
}

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Include cookies in requests for secure authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - could trigger logout
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
