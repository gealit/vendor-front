export const API_CONFIG = {
  BASE_URL: 'https://gealit.ru/api',
  // BASE_URL: 'http://localhost:8080/api',
  ENDPOINTS: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    LOGOUT: '/logout',
    REFRESH: '/refresh',
    MAIN: '/main',

  },
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  CREDENTIALS: 'include' as const,
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};