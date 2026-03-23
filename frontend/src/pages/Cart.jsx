import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { Trash2, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

const Cart = () => {
  const { items, removeFromCart, discount, coupon, getCartTotal, getTotal } = useCartStore();
  const { error } = useUIStore.getState();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingCart size={64} className="mx-auto text-muted mb-4" />
          <h1 className="font-heading text-3xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted mb-8">Start learning by adding a course to your cart</p>
          <Link to="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((course) => (
              <div key={course.id} className="card p-4 flex items-center space-x-4 hover:shadow-lg transition">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-heading font-bold mb-1">{course.title}</h3>
                  <p className="text-sm text-muted mb-2">{course.instructor.name}</p>
                  <p className="font-semibold text-primary">
                    {formatPrice(course.discountPrice || course.price)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    removeFromCart(course.id);
                    useUIStore.getState().success('Course removed from cart');
                  }}
                  className="p-2 text-accent hover:bg-red-50 rounded transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="card p-6 h-fit">
            <h2 className="font-heading font-bold text-xl mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">{formatPrice(getCartTotal())}</span>
              </div>

              {coupon && (
                <div className="flex justify-between text-green-600">
                  <span>{coupon.code} ({coupon.discountPercent}%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-heading font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(getTotal())}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full text-center mb-4">
              Proceed to Checkout
            </Link>

            <Link to="/courses" className="btn-secondary w-full text-center">
              Continue Shopping
            </Link>

            <p className="text-xs text-muted text-center mt-4">
              30-day money-back guarantee. No questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
