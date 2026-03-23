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

Be helpful, encouraging, and provide accurate information about LearnKart. Keep responses concise and actionable.`;

/**
 * Send message to Hugging Face AI model
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Array of previous messages
 * @returns {Promise<string>} AI response
 */
export async function sendMessageToAI(message, conversationHistory = []) {
  try {
    // Build conversation context
    let prompt = `${LMS_SYSTEM_PROMPT}\n\n`;

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
      generatedText = getFallbackResponse(message);
    }

    // Clean up the response
    generatedText = generatedText
      .split('\n')[0] // Take first line for cleaner responses
      .trim()
      .replace(/^Assistant:\s*/i, '');

    return generatedText || getFallbackResponse(message);

  } catch (error) {
    console.error('AI Service Error:', error);
    return getFallbackResponse(message);
  }
}

/**
 * Fallback responses when AI is unavailable
 * @param {string} message - User's message
 * @returns {string} Fallback response
 */
function getFallbackResponse(message) {
  const messageLower = message.toLowerCase();

  // Enrollment questions
  if (messageLower.includes('enroll') || messageLower.includes('join') || messageLower.includes('register')) {
    return `To enroll in a course:\n1. Go to the Browse page\n2. Click on your desired course\n3. Click 'Enroll Now'\n4. Choose payment method (free courses enroll instantly)\n5. Access from 'My Courses' after enrollment`;
  }

  // Course questions
  if (messageLower.includes('course') || messageLower.includes('available')) {
    return `We offer 30+ courses in:\n🌐 Web Development\n🐍 Python Programming\n📊 Data Science & ML\n🔧 DevOps & Docker\n☁️ Cloud Computing\n📱 Mobile Development\n🔒 Cybersecurity\n\nVisit the Browse page to explore all courses!`;
  }

  // Progress/XP questions
  if (messageLower.includes('progress') || messageLower.includes('xp') || messageLower.includes('points')) {
    return `📈 Progress & Rewards:\n✅ Complete a lesson: +5 XP\n🎓 Enroll in course: +10 XP\n📜 Complete course: +50 XP\n🔥 Daily streaks: Bonus XP\n\nTrack your progress from the Dashboard!`;
  }

  // Certificate questions
  if (messageLower.includes('certificate') || messageLower.includes('certification')) {
    return `🎓 Certificates:\nComplete all lessons in a course to earn a Certificate of Completion. Features:\n✅ Downloadable PDF\n✅ LinkedIn shareable\n✅ Unique verification ID\n✅ Lifetime validity`;
  }

  // Payment questions
  if (messageLower.includes('price') || messageLower.includes('payment') || messageLower.includes('cost')) {
    return `💳 Pricing:\n- Many FREE courses available\n- Premium courses: ₹499-₹2,999\n- Payment: Card, UPI, Net Banking\n- 30-day money-back guarantee\n- Lifetime access included`;
  }

  // Greeting
  if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
    return `👋 Hello! I'm your LearnKart AI assistant! I can help with:\n📚 Course enrollment\n📈 Progress tracking\n🎓 Certificates\n💳 Payments\n🔧 Technical support\n\nWhat would you like to know?`;
  }

  // Default response
  return `I'm here to help with LearnKart! I can assist with:\n- 📚 Course enrollment and navigation\n- 📈 Progress tracking and XP system\n- 🎓 Certificates and achievements\n- 💳 Payment and pricing\n- 🔧 Technical support\n\nCould you clarify what you need help with?`;
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
