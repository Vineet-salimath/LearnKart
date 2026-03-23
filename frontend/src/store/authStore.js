import { create } from 'zustand';
import { authAPI } from '../api/index.js';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Initialize auth state from localStorage
  initAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        set({ loading: true });
        const { data } = await authAPI.me();
        set({ user: data.data, isAuthenticated: true, error: null });
      } catch (err) {
        localStorage.removeItem('accessToken');
        set({ user: null, isAuthenticated: false });
      } finally {
        set({ loading: false });
      }
    }
  },

  register: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.register(formData);
      localStorage.setItem('accessToken', data.data.accessToken);
      set({ user: data.data.user, isAuthenticated: true });
      return data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('accessToken', data.data.accessToken);
      set({ user: data.data.user, isAuthenticated: true });
      return data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.log('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false });
    }
  },

  // Get post-login redirect destination
  getPostLoginRedirect: () => {
    const pendingCourseId = sessionStorage.getItem('pendingCourseId');
    let redirectTo = '/courses';

    if (pendingCourseId) {
      redirectTo = `/payment?courseId=${pendingCourseId}`;
      sessionStorage.removeItem('pendingCourseId');
    }

    return redirectTo;
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
