import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { Loader, PageLoader } from '../components/common/Loader';
import { BookOpen, Award, Clock, Users, Lock } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT'
  });
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();
  const { getError } = useUIStore();
  const error = getError?.();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      useUIStore.getState().setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      useUIStore.getState().setError('Password must be at least 6 characters');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      useUIStore.getState().setSuccess('Registration successful!');
      
      // Get post-login redirect destination
      const redirectTo = useAuthStore.getState().getPostLoginRedirect();
      navigate(redirectTo);
    } catch (err) {
      useUIStore.getState().setError(err.message);
    }
  };

  const benefits = [
    {
      icon: BookOpen,
      title: '30+ Expert Courses',
      description: 'Expert-curated curriculum from industry leaders'
    },
    {
      icon: Award,
      title: 'Industry Certificates',
      description: 'Get recognized certificates on completion'
    },
    {
      icon: Clock,
      title: 'Learn at Your Pace',
      description: 'Access anytime, lifetime course access'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with peers and get mentorship'
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: '30-day money-back guarantee'
    }
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-0" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Left Panel - Benefits (Hidden on Mobile) */}
      <div
        className="hidden lg:flex flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(135deg, #6c4ef2 0%, #7c3aed 100%)'
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
              LK
            </div>
          </div>
          <span className="text-2xl font-bold text-white">LearnKart</span>
        </Link>

        {/* Benefits */}
        <div className="space-y-8 flex-1">
          <div>
            <h2 className="text-4xl font-bold text-white mb-3">Unlock Your Potential</h2>
            <p className="text-purple-100 text-lg">Join thousands of learners mastering new skills with LearnKart.</p>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Icon className="w-6 h-6 text-purple-200" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-purple-100 text-sm">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-purple-100 text-sm">
          Join our community of {new Intl.NumberFormat('en-IN').format(50000)}+ learners worldwide
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-col justify-center px-6 sm:px-12 py-12 lg:py-0" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Create Account
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Join thousands of learners today
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="p-4 rounded-lg mb-6 text-sm font-medium"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderLeft: '4px solid #ef4444',
                color: '#dc2626'
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg2)',
                  border: `1px solid var(--border)`,
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                }}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg2)',
                  border: `1px solid var(--border)`,
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                }}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg2)',
                  border: `1px solid var(--border)`,
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                }}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg2)',
                  border: `1px solid var(--border)`,
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                }}
                required
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                defaultChecked
                className="mt-1"
              />
              <label htmlFor="terms" className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                I agree to the{' '}
                <Link to="#" className="font-semibold transition-opacity hover:opacity-70" style={{ color: 'var(--accent-primary)' }}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="#" className="font-semibold transition-opacity hover:opacity-70" style={{ color: 'var(--accent-primary)' }}>
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-6"
              style={{
                backgroundColor: 'var(--accent-primary)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? (
                <>
                  <Loader size="sm" />
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold transition-colors hover:opacity-70"
                style={{ color: 'var(--accent-primary)' }}
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-center gap-6 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <span>🔒 Secure Signup</span>
              <span>•</span>
              <span>✓ No CC Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
