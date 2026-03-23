import { useState } from 'react';
import { Tag, Shield, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Button } from '../common/Button';
import { cn } from '../../utils/helpers';

export function OrderSummary({
  subtotal,
  discount = 0,
  total,
  couponCode = '',
  onApplyCoupon,
  onCheckout,
  loading = false,
  className
}) {
  const [coupon, setCoupon] = useState(couponCode);
  const [applying, setApplying] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;

    setApplying(true);
    try {
      if (onApplyCoupon) {
        await onApplyCoupon(coupon.trim());
      }
    } finally {
      setApplying(false);
    }
  };

  return (
    <Card className={cn('sticky top-6', className)}>
      <CardHeader>
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-muted">
            <span>Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Discount
              </span>
              <span className="font-medium">-{formatPrice(discount)}</span>
            </div>
          )}

          <div className="border-t pt-3">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary font-heading">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Coupon Input */}
        <div className="space-y-2">
          <label htmlFor="coupon" className="text-sm font-medium text-text">
            Have a coupon code?
          </label>
          <div className="flex gap-2">
            <input
              id="coupon"
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              placeholder="SAVE10"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={applying || loading}
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={!coupon.trim() || applying || loading}
              variant="outline"
              size="sm"
            >
              {applying ? 'Applying...' : 'Apply'}
            </Button>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={onCheckout}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Processing...' : `Proceed to Checkout`}
        </Button>

        {/* Trust Badges */}
        <div className="space-y-2 border-t pt-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Secure SSL encrypted payment</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-blue-600" />
            <span>30-day money-back guarantee</span>
          </div>
        </div>

        {/* What's Included */}
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="mb-2 text-sm font-semibold text-text">This order includes:</p>
          <ul className="space-y-1 text-sm text-muted">
            <li>✓ Lifetime access to course</li>
            <li>✓ Certificate of completion</li>
            <li>✓ Access on mobile and desktop</li>
            <li>✓ 24/7 student support</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
