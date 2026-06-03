import { loadStripe } from '@stripe/stripe-js';

// Provided Stripe test publishable key
const STRIPE_PUB_KEY = 'pk_test_51TdbRvBtJZIzTj9gI3dGOokRkyKCUTXl2bnpEGkSnbR7Ku91vGxJXG9vzz26JYW8M2D0eoopkdKxcWO15yZ3hcS1000nNG3XjB';

// Stripe Payment Link URLs (to be created in Stripe Dashboard)
// For now these are placeholders — replace with actual Payment Link URLs once created
export const PAYMENT_LINKS = {
  fullReport: 'https://buy.stripe.com/test_placeholder_full',
  subscription: 'https://buy.stripe.com/test_placeholder_sub',
};

let stripePromise = null;

/**
 * Get or initialize Stripe instance.
 * Uses singleton pattern to avoid re-loading.
 */
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUB_KEY);
  }
  return stripePromise;
};

/**
 * Redirect to Stripe Checkout for a one-time report payment.
 * Falls back to Payment Link URL if redirectToCheckout fails.
 */
export const purchaseFullReport = async () => {
  try {
    const stripe = await getStripe();
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        // Replace with actual Checkout Session when server-side is ready
        lineItems: [{ price: 'price_placeholder_full_report', quantity: 1 }],
        mode: 'payment',
        successUrl: `${window.location.origin}/?success=true&report_id=full`,
        cancelUrl: `${window.location.origin}/?canceled=true`,
      });
      if (error) {
        console.warn('Stripe redirectToCheckout failed, falling back to payment link:', error);
        window.open(PAYMENT_LINKS.fullReport, '_blank', 'noopener,noreferrer');
      }
    }
  } catch (err) {
    console.warn('Stripe not available, opening payment link:', err);
    window.open(PAYMENT_LINKS.fullReport, '_blank', 'noopener,noreferrer');
  }
};

/**
 * Redirect to Stripe Checkout for subscription payment.
 */
export const purchaseSubscription = async () => {
  try {
    const stripe = await getStripe();
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: 'price_placeholder_subscription', quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/?success=true&plan=subscription`,
        cancelUrl: `${window.location.origin}/?canceled=true`,
      });
      if (error) {
        console.warn('Stripe redirectToCheckout failed, falling back to payment link:', error);
        window.open(PAYMENT_LINKS.subscription, '_blank', 'noopener,noreferrer');
      }
    }
  } catch (err) {
    console.warn('Stripe not available, opening payment link:', err);
    window.open(PAYMENT_LINKS.subscription, '_blank', 'noopener,noreferrer');
  }
};