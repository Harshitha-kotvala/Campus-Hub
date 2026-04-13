const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://campus-hub-server-zyue.onrender.com'
  : 'http://localhost:5000';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  POSTS: `${API_BASE_URL}/api/posts`,
  AUTH: `${API_BASE_URL}/api/auth`,
  HEALTH: `${API_BASE_URL}/api/health`
};

// Helper function for API calls
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
