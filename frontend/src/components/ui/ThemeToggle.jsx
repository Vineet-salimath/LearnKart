import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const ThemeToggle = ({ size = 'md', className }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Read theme from localStorage and apply to <html>
  useEffect(() => {
    const savedTheme = localStorage.getItem('lk-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('lk-theme', newTheme);
    setIsDarkMode(newTheme === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center h-8 w-14 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2',
        'border',
        className
      )}
      style={{
        backgroundColor: 'var(--bg3)',
        borderColor: 'var(--border)',
      }}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {/* Sliding Icon Container */}
      <motion.div
        className="absolute inset-0 flex items-center"
        animate={{
          x: isDarkMode ? 24 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center" 
             style={{ backgroundColor: 'var(--accent-primary)' }}>
          {isDarkMode ? (
            <Moon className="h-4 w-4 text-white" />
          ) : (
            <Sun className="h-4 w-4 text-white" />
          )}
        </div>
      </motion.div>
    </button>
  );
};

// Simple icon-only toggle for compact spaces
export const ThemeToggleIcon = ({ className }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('lk-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('lk-theme', newTheme);
    setIsDarkMode(newTheme === 'dark');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        className
      )}
      style={{
        backgroundColor: 'var(--bg2)',
        color: 'var(--text-primary)',
      }}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={isDarkMode ? 'moon' : 'sun'}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDarkMode ? (
          <Moon className="h-5 w-5" style={{ color: 'var(--accent-primary)' }} />
        ) : (
          <Sun className="h-5 w-5" style={{ color: 'var(--accent-primary)' }} />
        )}
      </motion.div>
    </motion.button>
  );
};