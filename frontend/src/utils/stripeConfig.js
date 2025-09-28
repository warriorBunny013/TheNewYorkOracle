import { loadStripe } from '@stripe/stripe-js';
import { IS_TEST_MODE } from './apiConfig';

// Get the appropriate Stripe key based on environment
const getStripeKey = () => {
  if (IS_TEST_MODE) {
    return process.env.REACT_APP_API_PUBLIC_KEY_TEST || process.env.REACT_APP_API_PUBLIC_KEY;
  }
  return process.env.REACT_APP_API_PUBLIC_KEY;
};

// Initialize Stripe with the correct key
const stripeKey = getStripeKey();
const stripePromise = loadStripe(stripeKey);

console.log('Stripe Configuration:', {
  isTestMode: IS_TEST_MODE,
  stripeKey: stripeKey?.substring(0, 12) + '...',
  fullKey: stripeKey
});

export { stripePromise, IS_TEST_MODE };
