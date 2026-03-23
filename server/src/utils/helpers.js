// Async handler wrapper to catch errors in async route handlers
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// API Response wrapper
export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res, message = 'Error', statusCode = 400, errors = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors: errors || []
  });
};

// Generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
};

// Extract YouTube video ID from URL
export const extractYouTubeId = (url) => {
  if (!url) return null;
  
  // If it's already just an ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  // Extract from full URL
  const regexPatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of regexPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// Validate YouTube URL
export const isValidYoutubeUrl = (url) => {
  const id = extractYouTubeId(url);
  return id !== null;
};

// Format seconds to HH:MM:SS
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
};

// Hash password (it's handled by bcrypt in auth service, but kept for util reference)
export const calculateCourseDuration = (lessons) => {
  return lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
};
