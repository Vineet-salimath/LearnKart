import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Button } from '../common/Button';
import { cn } from '../../utils/helpers';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1A1D2E',
      fontFamily: '"DM Sans", sans-serif',
      '::placeholder': {
        color: '#6B7280',
      },
      iconColor: '#5B4EE8',
    },
    invalid: {
      color: '#FF6B6B',
      iconColor: '#FF6B6B',
    },
  },
};

export function PaymentForm({
  amount,
  onSuccess,
  onError,
  loading = false,
  className
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [billingName, setBillingName] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!billingName.trim()) {
      setError('Please enter your name');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: billingName,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Call parent success handler with payment method
      if (onSuccess) {
        await onSuccess(paymentMethod);
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      if (onError) {
        onError(err);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Billing Name */}
          <div className="space-y-2">
            <label htmlFor="billing-name" className="text-sm font-medium text-text">
              Cardholder Name
            </label>
            <input
              id="billing-name"
              type="text"
              value={billingName}
              onChange={(e) => setBillingName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={processing || loading}
              required
            />
          </div>

          {/* Card Element */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">
              Card Details
            </label>
            <div className="rounded-lg border border-gray-300 p-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Security Badge */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-muted">
            <Lock className="h-4 w-4 text-green-600" />
            <span>Your payment information is encrypted and secure</span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!stripe || processing || loading}
            className="w-full"
            size="lg"
          >
            {processing ? (
              'Processing...'
            ) : (
              `Pay ${formatPrice(amount)}`
            )}
          </Button>

          {/* Stripe Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted">
            <span>Powered by</span>
            <svg className="h-5 w-auto" viewBox="0 0 60 25" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M59.5 13.5c0-5.2-2.6-9.3-7-9.3s-7 4.1-7 9.2c0 6.1 3.4 9.2 8.3 9.2 2.4 0 4.2-.5 5.6-1.3v-3.7c-1.4.7-3 1.1-5 1.1-2 0-3.8-.8-4-3.5h9c0-.3.1-1.1.1-1.7zm-9.2-1.9c0-2.6 1.6-3.7 2.2-3.7.6 0 2.1 1.1 2.1 3.7h-4.3zm-15 8.7c-1.7 0-2.5-1-2.5-2.6v-8.8h-4.4v9.2c0 3.9 2.2 6 5.7 6 1.5 0 2.9-.4 4.1-1v-3.9c-1 .6-2.1 1.1-2.9 1.1zm-12-2.8v-9.6h-4.4v9.2c0 3.9 2.2 6 5.7 6 1.5 0 2.9-.4 4.1-1v-3.9c-1 .6-2.1 1.1-2.9 1.1-1.7 0-2.5-1-2.5-2.8zm-10.3 2.8c-1.7 0-2.5-1-2.5-2.6v-8.8H6.1v9.2c0 3.9 2.2 6 5.7 6 1.5 0 2.9-.4 4.1-1v-3.9c-1 .6-2.1 1.1-2.9 1.1zm-11.8 0c-1.4 0-2.1-.6-2.1-.6v8.6H4.6V7.5h4.4v.8s1.7-1.1 3.4-1.1c3.4 0 5.7 2.9 5.7 7 0 4.2-2.2 7-5.7 7zm-1.8-3.7c1 0 2.1-.9 2.1-3.2s-1.1-3.2-2.1-3.2c-1 0-2.1.9-2.1 3.2s1.1 3.2 2.1 3.2z"
                fill="#635BFF"
              />
            </svg>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
