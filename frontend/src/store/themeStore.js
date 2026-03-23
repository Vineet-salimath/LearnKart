import { create } from 'zustand';

export const useThemeStore = create((set, get) => ({
  // Theme state
  isDarkMode: false,

  // Actions
  toggleTheme: () => {
    set((state) => {
      const newIsDarkMode = !state.isDarkMode;

      // Apply theme to document
      if (newIsDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Save to localStorage
      localStorage.setItem('theme-preference', newIsDarkMode ? 'dark' : 'light');

      return { isDarkMode: newIsDarkMode };
    });
  },

  setTheme: (isDarkMode) => {
    set({ isDarkMode });

    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save to localStorage
    localStorage.setItem('theme-preference', isDarkMode ? 'dark' : 'light');
  },

  initializeTheme: () => {
    try {
      // Check localStorage first
      const savedTheme = localStorage.getItem('theme-preference');

      if (savedTheme) {
        const isDarkMode = savedTheme === 'dark';
        get().setTheme(isDarkMode);
      } else {
        // Check system preference if no saved preference
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        get().setTheme(systemDark);
      }
    } catch (error) {
      console.warn('Failed to initialize theme:', error);
      // Fallback to light theme
      get().setTheme(false);
    }
  },
}));