import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, ShoppingCart, ChevronDown, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { ThemeToggleIcon } from '../ui/ThemeToggle';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItems = useCartStore(state => state.items);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 transition-colors"
      style={{
        height: '68px',
        backgroundColor: 'var(--bg)',
        borderBottom: `1px solid var(--border)`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link
            to="/"
            className="group inline-flex items-center gap-3 rounded-2xl px-4 py-2 transition-all hover:scale-105 hover:shadow-lg"
            aria-label="LearnKart home"
          >
            <svg width="56" height="56" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#06b6d4', stopOpacity:1}} />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="14" fill="url(#navGradient)" />
              <path
                d="M10 13L16 19L22 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <g transform="translate(20, 9)">
                <path
                  d="M0 0L0.8 1.5L2.5 2L1 2.5L0.5 4L-0.5 2.5L-2 2L-0.8 1.5Z"
                  fill="white"
                  opacity="0.9"
                />
              </g>
              <path
                d="M12 23L20 23"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
            <div className="flex flex-col gap-0.5">
              <span 
                className="font-black text-xl md:text-2xl leading-tight tracking-tight" 
                style={{ 
                  background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block'
                }}
              >
                LearnKart
              </span>
              <span 
                className="text-xs font-semibold tracking-normal hidden sm:block" 
                style={{ color: 'var(--accent-primary)' }}
              >
                Learn Without Limits
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/courses"
              className={`font-body font-medium transition-colors pb-1 ${
                isActive('/courses')
                  ? 'font-semibold border-b-2'
                  : 'hover:opacity-80'
              }`}
              style={{
                color: isActive('/courses') ? 'var(--accent-primary)' : 'var(--text-primary)',
                borderBottomColor: isActive('/courses') ? 'var(--accent-primary)' : 'transparent'
              }}
            >
              Courses
            </Link>
            <Link
              to="/browse"
              className={`font-body font-medium transition-colors pb-1 ${
                isActive('/browse')
                  ? 'font-semibold border-b-2'
                  : 'hover:opacity-80'
              }`}
              style={{
                color: isActive('/browse') ? 'var(--accent-primary)' : 'var(--text-primary)',
                borderBottomColor: isActive('/browse') ? 'var(--accent-primary)' : 'transparent'
              }}
            >
              Browse All
            </Link>
          </div>

          {/* Right side - Auth & Shopping */}
          <div className="hidden md:flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <div className="relative group">
              <ThemeToggleIcon />
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap text-xs font-medium"
                style={{
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--bg)',
                }}
              >
                Toggle Dark Mode
              </div>
            </div>

            {isAuthenticated && user?.role === 'STUDENT' && (
              <Link
                to="/cart"
                className="relative transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-primary)' }}
              >
                <ShoppingCart size={24} />
                {cartItems.length > 0 && (
                  <span
                    className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button
                  className="relative transition-opacity hover:opacity-70"
                  style={{ color: 'var(--text-primary)' }}
                  aria-label="Notifications"
                >
                  <Bell size={22} />
                  {/* Notification badge - hidden for now */}
                  {false && (
                    <span
                      className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold"
                      style={{ backgroundColor: 'var(--error)' }}
                    >
                      3
                    </span>
                  )}
                </button>

                {/* Avatar Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown size={18} />
                  </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-50"
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: `1px solid var(--border)`,
                    }}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {user?.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      📊 Dashboard
                    </Link>
                    <Link
                      to="/courses"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      📚 My Courses
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // Will scroll to certificates section when implemented
                      }}
                      className="block px-4 py-2 text-sm hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      🎓 Certificates
                    </Link>

                    <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--error)' }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2 font-body font-semibold rounded-lg transition-all duration-200 hover:opacity-80"
                  style={{
                    color: 'var(--text-primary)',
                    border: `1px solid var(--border)`,
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-white font-body font-semibold rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggleIcon />
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{ color: 'var(--text-primary)' }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            className="md:hidden pb-4 space-y-2 border-t mt-2 pt-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <Link
              to="/courses"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded transition-colors"
              style={{
                color: 'var(--text-primary)',
                backgroundColor: isActive('/courses') ? 'var(--bg2)' : 'transparent'
              }}
            >
              Courses
            </Link>
            <Link
              to="/browse"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded transition-colors hover:opacity-80"
              style={{
                color: 'var(--text-primary)',
                backgroundColor: isActive('/browse') ? 'var(--bg2)' : 'transparent'
              }}
            >
              Browse All
            </Link>

            {isAuthenticated && user?.role === 'STUDENT' && (
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 rounded transition-colors hover:opacity-80"
                style={{ color: 'var(--text-primary)' }}
              >
                Cart ({cartItems.length})
              </Link>
            )}

            {isAuthenticated ? (
              <>
                {user?.role === 'STUDENT' && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 rounded transition-colors hover:opacity-80"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Dashboard
                  </Link>
                )}
                {user?.role === 'INSTRUCTOR' && (
                  <Link
                    to="/instructor"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 rounded transition-colors hover:opacity-80"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    My Courses
                  </Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 rounded transition-colors hover:opacity-80"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded flex items-center space-x-2 transition-colors hover:opacity-80"
                  style={{
                    color: 'var(--error)',
                    backgroundColor: 'transparent'
                  }}
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 px-4 mt-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-4 py-2 rounded transition-all"
                  style={{
                    color: 'var(--text-primary)',
                    border: `1px solid var(--border)`,
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-4 py-2 text-white rounded transition-all"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
