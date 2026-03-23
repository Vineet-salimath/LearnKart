import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useCheckoutStore } from './store/checkoutStore';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { PageLoader } from './components/common/Loader';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import FloatingChatWidget from './components/FloatingChatWidget';
import { ProtectedRoute, PublicRoute } from './router/ProtectedRoute';

import HomeNew from './pages/HomeNew';
import CourseListingNew from './pages/CourseListingNew';
import Browse from './pages/Browse';
import CourseView from './pages/CourseView';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import CoursePlayer from './pages/CoursePlayer';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import InstructorCourseBuilder from './pages/InstructorCourseBuilder';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  const { isAuthenticated, loading, initAuth } = useAuthStore();
  const {
    isModalOpen,
    selectedCourse,
    loading: checkoutLoading,
    error: checkoutError,
    closeCheckout,
    processPurchase
  } = useCheckoutStore();

  useEffect(() => {
    initAuth();

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('lk-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, [initAuth]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomeNew />} />
            <Route path="/courses" element={<CourseListingNew />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/course/:courseId" element={<CourseView />} />
            <Route path="/learn/:courseId" element={<CoursePlayer />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Instructor Routes */}
            <Route
              path="/instructor"
              element={
                <ProtectedRoute requiredRole="INSTRUCTOR">
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/new"
              element={
                <ProtectedRoute requiredRole="INSTRUCTOR">
                  <InstructorCourseBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:id/edit"
              element={
                <ProtectedRoute requiredRole="INSTRUCTOR">
                  <InstructorCourseBuilder />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />

        {/* Floating AI Chat Assistant */}
        <FloatingChatWidget />

        {/* Global Checkout Modal */}
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={closeCheckout}
          course={selectedCourse}
          onPurchase={processPurchase}
          loading={checkoutLoading}
          error={checkoutError}
        />
      </div>
    </Router>
  );
}

export default App;
