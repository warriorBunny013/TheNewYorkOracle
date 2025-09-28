// Environment detection for API URL
const isTestMode = process.env.NODE_ENV === 'development' || 
                   process.env.REACT_APP_TEST_MODE === 'true' ||
                   window.location.hostname.includes('test');

export const API_URL = isTestMode 
  ? process.env.REACT_APP_API_URL_TEST || "http://localhost:8080"
  : process.env.NODE_ENV === "production"
    ? "https://api.soulsticetarot.com"
    : "http://localhost:8080";

// Export test mode flag for use in components
export const IS_TEST_MODE = isTestMode;

console.log('Frontend Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  isTestMode: isTestMode,
  API_URL: API_URL
});
