// Centralized API configuration using environment variable VITE_API_URL
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Remove trailing slash if present to avoid double slashes when constructing endpoints
export const API_BASE_URL = rawApiUrl.endsWith('/')
  ? rawApiUrl.slice(0, -1)
  : rawApiUrl;
