// ========================================
// MOCK API WITH YOUTUBE VIDEO INTEGRATION
// ========================================
// Using mock APIs for demo with real YouTube videos
export {
  coursesAPI,
  lessonsAPI,
  enrollmentsAPI,
  authAPI
} from './mockAPI.js';

// ========================================
// ORIGINAL API SETUP (KEPT FOR REFERENCE)
// ========================================
import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true,
        });

        const { data } = response;
        localStorage.setItem('accessToken', data.data.accessToken);
        api.defaults.headers.Authorization = `Bearer ${data.data.accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Original Auth endpoints (disabled - using mock API above)
export const authAPI_ORIGINAL = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
};

// Original Courses endpoints (disabled - using mock API above)
export const coursesAPI_ORIGINAL = {
  getAll: (params) => api.get('/courses', { params }),
  getBySlug: (slug) => api.get(`/courses/slug/${slug}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  togglePublish: (id) => api.patch(`/courses/${id}/publish`),
  getMyCourses: () => api.get('/courses/instructor/my-courses'),
  getStats: (id) => api.get(`/courses/${id}/stats`),
};

// Sections endpoints
export const sectionsAPI = {
  getAll: (courseId) => api.get(`/courses/${courseId}/sections`),
  create: (courseId, data) => api.post(`/courses/${courseId}/sections`, data),
  update: (courseId, sectionId, data) => api.put(`/courses/${courseId}/sections/${sectionId}`, data),
  delete: (courseId, sectionId) => api.delete(`/courses/${courseId}/sections/${sectionId}`),
  reorder: (courseId, data) => api.patch(`/courses/${courseId}/sections/reorder`, data),
};

// Original Lessons endpoints (disabled - using mock API above)
export const lessonsAPI_ORIGINAL = {
  create: (sectionId, data) => api.post(`/sections/${sectionId}/lessons`, data),
  update: (sectionId, lessonId, data) => api.put(`/sections/${sectionId}/lessons/${lessonId}`, data),
  delete: (sectionId, lessonId) => api.delete(`/sections/${sectionId}/lessons/${lessonId}`),
  reorder: (sectionId, data) => api.patch(`/sections/${sectionId}/lessons/reorder`, data),
};

// Original Enrollments endpoints (disabled - using mock API above)
export const enrollmentsAPI_ORIGINAL = {
  enroll: (courseId) => api.post('/enrollments', { courseId }),
  getMy: () => api.get('/enrollments/my'),
  check: (courseId) => api.get(`/enrollments/check/${courseId}`),
  unenroll: (courseId, studentId) => api.delete(`/enrollments/${courseId}`, { data: { studentId } }),
};

// Progress endpoints
export const progressAPI = {
  markComplete: (lessonId) => api.post(`/progress/lesson/${lessonId}/complete`),
  getCourseProgress: (courseId) => api.get(`/progress/course/${courseId}`),
  getLastWatched: (courseId) => api.get(`/progress/course/${courseId}/last-watched`),
  getLessonProgress: (lessonId) => api.get(`/progress/lesson/${lessonId}`),
};

// Payments endpoints
export const paymentsAPI = {
  createPaymentIntent: (data) => api.post('/payments/create-payment-intent', data),
  confirmPayment: (data) => api.post('/payments/confirm', data),
  applyCoupon: (data) => api.post('/payments/apply-coupon', data),
  getOrders: () => api.get('/payments/orders'),
  getOrder: (orderId) => api.get(`/payments/orders/${orderId}`),
};

// Admin endpoints
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
  getCourses: (params) => api.get('/admin/courses', { params }),
  getOrders: (params) => api.get('/admin/orders', { params }),
  createCoupon: (data) => api.post('/admin/coupons', data),
  getCoupons: () => api.get('/admin/coupons'),
  updateCoupon: (id, data) => api.patch(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
};

export default api;
