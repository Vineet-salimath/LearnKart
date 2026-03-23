import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      discount: 0,

      addToCart: (course) => {
        const { items } = get();
        // Check if already in cart
        if (items.some(item => item.id === course.id)) {
          return;
        }
        set({ items: [...items, course] });
      },

      removeFromCart: (courseId) => {
        set({ items: get().items.filter(item => item.id !== courseId) });
      },

      clearCart: () => {
        set({ items: [], coupon: null, discount: 0 });
      },

      applyCoupon: (couponCode, discountAmount) => {
        set({ coupon: couponCode, discount: discountAmount });
      },

      removeCoupon: () => {
        set({ coupon: null, discount: 0 });
      },

      // Computed values
      get subtotal() {
        const { items } = get();
        return items.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);
      },

      get total() {
        const { subtotal, discount } = get();
        return Math.max(0, subtotal - discount);
      },

      get couponCode() {
        const { coupon } = get();
        return coupon;
      },

      getTotal: () => {
        const { items, discount } = get();
        const total = items.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);
        return Math.max(0, total - discount);
      },

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);
      },
    }),
    {
      name: 'cart-store',
    }
  )
);
