// API Configuration
// Use explicit backend URL in production and localhost in development by default
const getApiBaseUrl = () => {
  const isProd = import.meta.env.PROD;

  if (isProd) {
    // In production, prefer an explicit backend URL
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
    // Fallback to same-origin API if no env is provided
    return typeof window !== 'undefined' ? window.location.origin : '';
  }

  // Development: default to local backend, but allow override via env
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  BASE: API_BASE_URL,
  ORDERS: `${API_BASE_URL}/api/orders`,
  WHATSAPP: `${API_BASE_URL}/api/whatsapp`,
  HEALTH: `${API_BASE_URL}/api`,
  PAYMENTS_CREATE_ORDER: `${API_BASE_URL}/api/payments/create-order`,
  PAYMENTS_VERIFY: `${API_BASE_URL}/api/payments/verify`,
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
