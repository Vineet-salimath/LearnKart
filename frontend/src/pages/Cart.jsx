import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { Trash2, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const { items, removeFromCart, discount, coupon, getCartTotal, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center max-w-md">
          <div
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg2)' }}
          >
            <ShoppingCart size={48} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Your cart is empty
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Start learning by adding a course to your cart
          </p>
          <Link
            to="/browse"
            className="inline-block px-8 py-3.5 rounded-xl font-semibold text-white transition-all"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 110, 245, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((course) => (
              <div
                key={course.id}
                className="p-6 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                      {course.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                      By {course.instructor.name}
                    </p>
                    <p className="font-bold text-xl" style={{ color: 'var(--accent-primary)' }}>
                      ₹{course.discountPrice || course.price}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(course.id);
                      useUIStore.getState().success('Course removed from cart');
                    }}
                    className="p-2 rounded-lg transition-all"
                    style={{
                      color: '#ef4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="h-fit">
            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2 className="font-bold text-xl mb-6" style={{ color: 'var(--text-primary)' }}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                    ₹{getCartTotal()}
                  </span>
                </div>

                {coupon && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="text-sm">
                      {coupon.code} ({coupon.discountPercent}% off)
                    </span>
                    <span className="font-semibold">-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                    Total
                  </span>
                  <span className="font-bold text-2xl" style={{ color: 'var(--accent-primary)' }}>
                    ₹{getTotal()}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full text-center px-6 py-3.5 rounded-xl font-semibold text-white mb-3 transition-all"
                style={{ backgroundColor: 'var(--accent-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 110, 245, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/browse"
                className="block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all"
                style={{
                  backgroundColor: 'var(--bg2)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg3)';
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg2)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                Continue Shopping
              </Link>

              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    30-day money-back guarantee. No questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
