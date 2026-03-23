// AI Service for Hugging Face API Integration
const HF_API_TOKEN = import.meta.env.VITE_HF_API_TOKEN || '';
const HF_API_URL = 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf';

// LMS Knowledge Base Context
const LMS_SYSTEM_PROMPT = `You are KAI (Knowledge Assistant Intelligence), an AI assistant for the LearnKart Learning Management System.

Your role is to help students with:
- Course navigation and enrollment
- Understanding course content and structure
- Answering questions about assignments and progress
- Providing learning tips and study strategies
- Explaining technical concepts covered in courses
- Troubleshooting platform issues

Available Courses:
1. Full Stack Web Development (JavaScript, React, Node.js)
2. Python Programming (Beginner to Advanced)
3. Data Structures & Algorithms
4. Machine Learning & AI
5. Docker & DevOps
6. Cloud Computing (AWS, Azure)
7. Mobile App Development
8. Cybersecurity Fundamentals

Platform Features:
- Video-based learning with interactive curriculum
- Progress tracking and XP rewards (+5 XP per lesson, +10 XP enrollment)
- Course completion certificates
- 30-day money-back guarantee
- Lifetime access to enrolled courses
- Mobile and desktop access
- Payment methods: Card, UPI, Net Banking

Be helpful, encouraging, and provide accurate information about LearnKart.

Response style rules:
- Prefer 4-8 concise lines, not a single sentence.
- Use clear next steps when user asks "how".
- If user asks a follow-up ("what about price", "and certificate?"), infer context from previous messages.
- If the user intent is unclear, ask one targeted clarification question.
- Never invent unsupported platform features.
- Keep tone professional and friendly.`;

const KNOWN_TOPICS = {
  enrollment: {
    keywords: [
      'enroll', 'enrollment', 'join', 'register', 'admission', 'subscribe', 'buy', 'purchase', 'checkout',
    ],
  },
  courses: {
    keywords: [
      'course', 'courses', 'available', 'catalog', 'category', 'topics', 'what can i learn', 'skills',
    ],
  },
  progress: {
    keywords: [
      'progress', 'xp', 'points', 'reward', 'track', 'dashboard', 'streak', 'complete', 'completion',
    ],
  },
  certificate: {
    keywords: [
      'certificate', 'certification', 'credential', 'verify', 'completion certificate',
    ],
  },
  payment: {
    keywords: [
      'price', 'pricing', 'payment', 'cost', 'upi', 'refund', 'money back', 'discount', 'offer',
    ],
  },
  technical_support: {
    keywords: [
      'problem', 'issue', 'error', 'bug', 'not working', 'help', 'trouble', 'broken', 'failed',
    ],
  },
  greeting: {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
  },
};

const normalizeText = (text = '') => text.toLowerCase().trim();

const getRecentUserMessages = (conversationHistory = [], limit = 3) =>
  conversationHistory
    .filter((msg) => msg.role === 'user' && msg.content)
    .slice(-limit)
    .map((msg) => normalizeText(msg.content));

const detectIntent = (message, conversationHistory = []) => {
  const input = normalizeText(message);
  const recentUserMessages = getRecentUserMessages(conversationHistory);
  const expandedInput = [input, ...recentUserMessages].join(' ');

  const scores = Object.entries(KNOWN_TOPICS).map(([intent, config]) => {
    const score = config.keywords.reduce((acc, keyword) => {
      return acc + (expandedInput.includes(keyword) ? 1 : 0);
    }, 0);
    return { intent, score };
  });

  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];
  if (!top || top.score === 0) {
    return 'unknown';
  }

  return top.intent;
};

const isShortFollowUp = (message) => {
  const shortText = normalizeText(message);
  if (shortText.split(/\s+/).length > 5) return false;

  return /^(what about|and|also|how about|price\?|certificate\?|payment\?|then\?|next\?|more\?)/.test(shortText);
};

const formatResponse = (text) =>
  text
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const getLocalProgressSummary = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { completedLessons: 0, trackedLessons: 0, progressPercent: 0 };
  }

  let completedLessons = 0;
  let trackedLessons = 0;

  const keys = Object.keys(window.localStorage).filter((key) =>
    key.startsWith('course_progress_') || /^course_\d+_progress$/.test(key)
  );

  keys.forEach((key) => {
    const value = safeJsonParse(window.localStorage.getItem(key) || '{}', {});
    Object.values(value).forEach((entry) => {
      trackedLessons += 1;
      if (entry === true || entry?.completed === true) {
        completedLessons += 1;
      }
    });
  });

  const progressPercent = trackedLessons > 0
    ? Math.round((completedLessons / trackedLessons) * 100)
    : 0;

  return { completedLessons, trackedLessons, progressPercent };
};

const getLastViewedCourseId = () => {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  const keys = Object.keys(window.localStorage).filter((key) =>
    key.startsWith('course_last_lesson_')
  );

  if (!keys.length) return null;

  // Key format: course_last_lesson_<courseId>_<userId>
  const firstKey = keys[keys.length - 1];
  const parts = firstKey.split('_');
  return parts.length >= 4 ? parts[3] : null;
};

const buildUserMemoryContext = (userContext = {}) => {
  const hasWindow = typeof window !== 'undefined';
  const inferredAuth = hasWindow && window.localStorage
    ? Boolean(window.localStorage.getItem('accessToken'))
    : false;
  const enrolledCourseIds = userContext.enrolledCourseIds || (
    hasWindow && window.localStorage
      ? safeJsonParse(window.localStorage.getItem('enrolledCourses') || '[]', [])
      : []
  );

  const progressSummary = userContext.progressSummary || getLocalProgressSummary();
  const lastViewedCourseId = userContext.lastViewedCourseId || getLastViewedCourseId();
  const currentPath = userContext.currentPath || (hasWindow ? window.location.pathname : 'unknown');

  return {
    isAuthenticated: userContext.isAuthenticated ?? inferredAuth,
    userName: userContext.userName || 'Learner',
    enrolledCourseIds,
    enrolledCourseCount: enrolledCourseIds.length,
    lastViewedCourseId,
    completedLessons: progressSummary.completedLessons,
    trackedLessons: progressSummary.trackedLessons,
    progressPercent: progressSummary.progressPercent,
    currentPath,
  };
};

const buildUserContextPrompt = (memory) => {
  return `Current user context:\n- Authenticated: ${memory.isAuthenticated ? 'Yes' : 'No'}\n- User name: ${memory.userName}\n- Enrolled courses count: ${memory.enrolledCourseCount}\n- Enrolled course IDs: ${memory.enrolledCourseIds.join(', ') || 'None'}\n- Last viewed course ID: ${memory.lastViewedCourseId || 'Unknown'}\n- Completed lessons tracked: ${memory.completedLessons}/${memory.trackedLessons}\n- Estimated overall progress: ${memory.progressPercent}%\n- Current page path: ${memory.currentPath}`;
};

/**
 * Send message to Hugging Face AI model
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Array of previous messages
 * @returns {Promise<string>} AI response
 */
export async function sendMessageToAI(message, conversationHistory = [], userContext = {}) {
  try {
    if (!HF_API_TOKEN) {
      return getFallbackResponse(message, conversationHistory, userContext);
    }

    const memoryContext = buildUserMemoryContext(userContext);

    // Build conversation context
    let prompt = `${LMS_SYSTEM_PROMPT}\n\n${buildUserContextPrompt(memoryContext)}\n\n`;

    // Add conversation history
    conversationHistory.forEach(msg => {
      if (msg.role === 'user') {
        prompt += `User: ${msg.content}\n`;
      } else {
        prompt += `Assistant: ${msg.content}\n`;
      }
    });

    // Add current message
    prompt += `User: ${message}\nAssistant:`;

    // Call Hugging Face API
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      // If model is loading, provide fallback response
      if (response.status === 503) {
        const data = await response.json();
        if (data.error?.includes('loading')) {
          return getFallbackResponse(message);
        }
      }
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Extract generated text
    let generatedText = '';
    if (Array.isArray(data) && data[0]?.generated_text) {
      generatedText = data[0].generated_text;
    } else if (data.generated_text) {
      generatedText = data.generated_text;
    } else {
      generatedText = getFallbackResponse(message, conversationHistory, userContext);
    }

    // Clean up the response while preserving useful structure.
    generatedText = formatResponse(
      generatedText
        .replace(/^Assistant:\s*/i, '')
        .replace(/^(User:|Human:)\s.*$/gim, '')
    );

    return generatedText || getFallbackResponse(message, conversationHistory, userContext);

  } catch (error) {
    console.error('AI Service Error:', error);
    return getFallbackResponse(message, conversationHistory, userContext);
  }
}

/**
 * Fallback responses when AI is unavailable
 * @param {string} message - User's message
 * @returns {string} Fallback response
 */
function getFallbackResponse(message, conversationHistory = [], userContext = {}) {
  const messageLower = normalizeText(message);
  const detectedIntent = detectIntent(message, conversationHistory);
  const recentUserMessages = getRecentUserMessages(conversationHistory);
  const memoryContext = buildUserMemoryContext(userContext);

  if (isShortFollowUp(message) && recentUserMessages.length > 0 && detectedIntent === 'unknown') {
    const inferred = detectIntent(recentUserMessages[recentUserMessages.length - 1], conversationHistory.slice(0, -1));
    if (inferred !== 'unknown') {
      return getFallbackResponse(inferred, []);
    }
  }

  // Enrollment questions
  if (detectedIntent === 'enrollment' || messageLower === 'enrollment') {
    if (!memoryContext.isAuthenticated) {
      return `To enroll in a course, first sign in, then:\n1. Open Browse\n2. Select your course\n3. Click Enroll Now\n4. Complete payment (free courses enroll instantly)\n\nAfter enrollment, your course appears in My Courses.`;
    }

    return `To enroll in a course:\n1. Go to the Browse page\n2. Click on your desired course\n3. Click 'Enroll Now'\n4. Choose payment method (free courses enroll instantly)\n5. Access from 'My Courses' after enrollment`;
  }

  // Course questions
  if (detectedIntent === 'courses' || messageLower === 'courses') {
    return `We offer 30+ courses in:\n🌐 Web Development\n🐍 Python Programming\n📊 Data Science & ML\n🔧 DevOps & Docker\n☁️ Cloud Computing\n📱 Mobile Development\n🔒 Cybersecurity\n\nVisit the Browse page to explore all courses!`;
  }

  // Progress/XP questions
  if (detectedIntent === 'progress' || messageLower === 'progress') {
    const personalLine = memoryContext.trackedLessons > 0
      ? `\n\nYour current tracked progress is ${memoryContext.progressPercent}% (${memoryContext.completedLessons}/${memoryContext.trackedLessons} lessons).`
      : '';

    return `📈 Progress & Rewards:\n✅ Complete a lesson: +5 XP\n🎓 Enroll in course: +10 XP\n📜 Complete course: +50 XP\n🔥 Daily streaks: Bonus XP\n\nTrack your progress from the Dashboard!${personalLine}`;
  }

  // Certificate questions
  if (detectedIntent === 'certificate' || messageLower === 'certificate') {
    return `🎓 Certificates:\nComplete all lessons in a course to earn a Certificate of Completion. Features:\n✅ Downloadable PDF\n✅ LinkedIn shareable\n✅ Unique verification ID\n✅ Lifetime validity`;
  }

  // Payment questions
  if (detectedIntent === 'payment' || messageLower === 'payment') {
    const enrolledHint = memoryContext.enrolledCourseCount > 0
      ? `\n\nYou already have ${memoryContext.enrolledCourseCount} enrolled course${memoryContext.enrolledCourseCount > 1 ? 's' : ''}.`
      : '';

    return `💳 Pricing:\n- Many FREE courses available\n- Premium courses: ₹499-₹2,999\n- Payment: Card, UPI, Net Banking\n- 30-day money-back guarantee\n- Lifetime access included${enrolledHint}`;
  }

  // Technical support questions
  if (detectedIntent === 'technical_support' || messageLower === 'technical_support') {
    return `🔧 Quick troubleshooting:\n1. Video issue: refresh page and check internet\n2. Enrolled courses missing: ensure you're signed in\n3. Payment failure: retry with UPI/Card and check bank status\n4. Progress not saving: enable cookies and avoid private mode\n\nIf the issue continues, share the exact error text and page name so I can guide you faster.`;
  }

  // Greeting
  if (detectedIntent === 'greeting' || messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
    const profileSummary = memoryContext.isAuthenticated
      ? `You're currently enrolled in ${memoryContext.enrolledCourseCount} course${memoryContext.enrolledCourseCount !== 1 ? 's' : ''}.`
      : `You're browsing as guest right now.`;

    return `👋 Hello! I'm your LearnKart AI assistant! ${profileSummary}\n\nI can help with:\n📚 Course enrollment\n📈 Progress tracking\n🎓 Certificates\n💳 Payments\n🔧 Technical support\n\nWhat would you like to do next?`;
  }

  // Default response
  return `I can help with LearnKart courses, enrollment, payments, progress, and certificates.\n\nTell me one of these so I can give a precise answer:\n1. Course enrollment\n2. Pricing/payment\n3. Progress/XP\n4. Certificate\n5. Technical issue (include page + error)`;
}

/**
 * Example questions for quick start
 */
export const EXAMPLE_QUESTIONS = [
  "How do I enroll in a course?",
  "What courses are available?",
  "How does the XP system work?",
  "How do I get a certificate?",
  "What payment methods do you accept?",
  "How can I track my progress?",
  "Is there a mobile app?",
  "What happens after I complete a course?",
];
