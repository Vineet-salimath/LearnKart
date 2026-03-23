import { create } from 'zustand';
import { enrollmentsAPI, paymentsAPI } from '../api/index.js';

export const useCheckoutStore = create((set, get) => ({
  // Modal state
  isModalOpen: false,
  selectedCourse: null,

  // Processing state
  loading: false,
  error: null,
  success: false,

  // Actions
  openCheckout: (course) => {
    set({
      isModalOpen: true,
      selectedCourse: course,
      error: null,
      success: false,
    });
  },

  closeCheckout: () => {
    set({
      isModalOpen: false,
      selectedCourse: null,
      error: null,
      success: false,
      loading: false,
    });
  },

  processPurchase: async (course) => {
    const { loading } = get();
    if (loading) return; // Prevent duplicate processing

    set({ loading: true, error: null });

    try {
      // Mock payment processing (2 second delay for UX)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create enrollment directly (bypassing payment gateway for now)
      // In production, this would integrate with Stripe/PayPal
      await enrollmentsAPI.enroll(course.id);

      set({
        loading: false,
        success: true,
        error: null,
      });

      // Return success for the component to handle
      return { success: true };

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Purchase failed. Please try again.';
      set({
        loading: false,
        error: errorMessage,
      });

      throw new Error(errorMessage);
    }
  },

  // Check enrollment status
  checkEnrollment: async (courseId) => {
    try {
      const response = await enrollmentsAPI.check(courseId);
      return response.data.enrolled;
    } catch (err) {
      console.error('Failed to check enrollment:', err);
      return false;
    }
  },

  // Clear error state
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    isModalOpen: false,
    selectedCourse: null,
    loading: false,
    error: null,
    success: false,
  }),
}));