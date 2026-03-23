import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combine and merge Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format price in INR
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

// Truncate text
export const truncate = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Format duration in seconds to h:mm:ss
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
};

// Generate slug
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Extract YouTube ID from URL
export const extractYoutubeId = (url) => {
  if (!url) return null;

  // If it's already just an ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  // Extract from full URL
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// Create YouTube embed URL
export const getYoutubeEmbedUrl = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
};

// Local storage helpers
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Failed to set ${key}:`, err);
    }
  },
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.error(`Failed to get ${key}:`, err);
      return null;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Failed to remove ${key}:`, err);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('Failed to clear storage:', err);
    }
  },
};

// Check if user can access content
export const canAccessLesson = (lesson, isEnrolled, isInstructor) => {
  return lesson.isFree || isEnrolled || isInstructor;
};
