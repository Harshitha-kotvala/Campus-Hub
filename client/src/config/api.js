const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
