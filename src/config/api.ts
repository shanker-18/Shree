// API Configuration
// Always use relative paths for API calls to avoid CORS issues and hardcoded URLs
const getApiBaseUrl = () => {
  // Check if we have an explicit environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In production or when deployed, use relative paths
  if (import.meta.env.PROD || typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Use current origin for deployed versions
    return typeof window !== 'undefined' ? window.location.origin : '';
  }
  
  // Development fallback
  return 'http://localhost:5001';
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  BASE: API_BASE_URL,
  ORDERS: `${API_BASE_URL}/api/orders`,
  WHATSAPP: `${API_BASE_URL}/api/whatsapp`,
  HEALTH: `${API_BASE_URL}/api`
};

// API utility functions with better error handling
export const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - API is taking too long to respond');
    }
    
    throw error;
  }
};

// For development and debugging
console.log('API Configuration:', {
  mode: import.meta.env.MODE,
  prod: import.meta.env.PROD,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  baseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS
});
