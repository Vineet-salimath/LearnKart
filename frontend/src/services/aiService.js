// AI Service for Hugging Face API Integration
const HF_API_TOKEN = import.meta.env.VITE_HF_API_TOKEN || '';
const HF_API_URL = 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf';

// Simplified system prompt focused on LearnKart information
const LMS_SYSTEM_PROMPT = `You are a helpful AI assistant for the LearnKart Learning Management System. 
You help students with:
- Course information and navigation
- Enrollment questions
- Progress and certificate information
- Technical support

Available courses: Full Stack Web Development, Python Programming, Data Science & ML, DevOps, Cloud Computing, Mobile Development, Cybersecurity.

Keep responses concise (3-5 sentences), helpful, and professional.`;

const normalizeText = (text = '') => text.toLowerCase().trim();

const formatResponse = (text) => text.replace(/\n{3,}/g, '\n\n').trim();

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

/**
 * Send message to Hugging Face AI model
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Array of previous messages
 * @returns {Promise<string>} AI response
 */
export async function sendMessageToAI(message, conversationHistory = []) {
  try {
    if (!HF_API_TOKEN) {
      return `I need an API token to provide AI responses. Please contact support.`;
    }

    // Build simple conversation prompt
    let prompt = `${LMS_SYSTEM_PROMPT}\n\n`;

    // Add recent conversation history (last 5 messages to keep it concise)
    const recentHistory = conversationHistory.slice(-5);
    recentHistory.forEach((msg) => {
      if (msg.role === 'user') {
        prompt += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
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
          max_new_tokens: 300,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, errorData);
      
      // If API is overloaded or model is loading, provide simple fallback
      if (response.status === 503 || response.status === 429) {
        return `I'm currently busy. Please try again in a moment.`;
      }
      
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Extract generated text from response
    let generatedText = '';
    if (Array.isArray(data) && data[0]?.generated_text) {
      generatedText = data[0].generated_text;
    } else if (data.generated_text) {
      generatedText = data.generated_text;
    }

    if (!generatedText) {
      return `I couldn't generate a response. Please try rephrasing your question.`;
    }

    // Clean up response
    generatedText = formatResponse(
      generatedText
        .replace(/^Assistant:\s*/i, '')
        .replace(/^(User:|Human:)\s.*$/gim, '')
        .trim()
    );

    return generatedText || `I'm not sure how to answer that. Can you provide more details?`;
  } catch (error) {
    console.error('AI Service Error:', error);
    // Provide fallback response based on message keywords
    return getSmartFallback(message);
  }
}

/**
 * Smart fallback responses when API fails
 */
function getSmartFallback(message) {
  const lower = normalizeText(message);

  if (/enroll|enrollment|join|register|subscribe|buy|purchase/.test(lower)) {
    return "To enroll in a course:\n1. Go to the Browse page\n2. Select your desired course\n3. Click 'Enroll Now'\n4. Complete payment (or enroll for free)\n5. Start learning immediately!\n\nYou'll find the course in 'My Courses' after enrollment.";
  }

  if (/course|available|catalog|what.*offer|what.*teach/.test(lower)) {
    return "LearnKart offers courses in:\n\n• Web Development (JavaScript, React, Node.js)\n• Python Programming\n• Data Science & Machine Learning\n• DevOps & Docker\n• Cloud Computing (AWS, Azure)\n• Mobile App Development\n• Cybersecurity\n\nVisit the Browse page to explore all courses!";
  }

  if (/progress|xp|points|reward|track/.test(lower)) {
    return "📈 Progress & Rewards:\n\n✅ Complete a lesson: +5 XP\n🎓 Enroll in a course: +10 XP\n📜 Complete a course: +50 XP\n🔥 Daily streaks: Bonus XP\n\nCheck your Dashboard to track progress and view achievements!";
  }

  if (/certificate|certification|credential/.test(lower)) {
    return "🎓 Certificates:\n\nEarn a Certificate of Completion when you finish 100% of a course.\n\nFeatures:\n✅ Downloadable PDF\n✅ LinkedIn shareable\n✅ Unique verification ID\n✅ Lifetime validity";
  }

  if (/price|cost|payment|paid|free|refund/.test(lower)) {
    return "💳 Pricing & Payment:\n\n• Many FREE courses available\n• Premium courses: ₹499-₹2,999\n• Payment methods: Card, UPI, Net Banking\n• 30-day money-back guarantee\n• Lifetime access to enrolled courses";
  }

  if (/problem|issue|error|bug|not working|help|trouble|support/.test(lower)) {
    return "🔧 Troubleshooting:\n\n1. Video not playing? → Refresh and check internet\n2. Missing courses? → Ensure you're logged in\n3. Payment failed? → Try different payment method\n4. Progress not saving? → Enable cookies\n\nContact support if the issue persists!";
  }

  if (/hello|hi|hey|greet|good morning|good evening/.test(lower)) {
    return "👋 Hello! I'm your LearnKart AI assistant.\n\nI can help with:\n📚 Course enrollment and navigation\n📈 Progress tracking\n🎓 Certificates\n💳 Payments\n🔧 Technical support\n\nWhat would you like to know?";
  }

  // Default helpful response
  return "I can help with:\n• 📚 Course enrollment\n• 🎯 Course selection\n• 📈 Progress tracking\n• 🎓 Certificates\n• 💳 Pricing & payments\n• 🔧 Technical support\n\nWhat would you like to know about LearnKart?";
}

/**
 * Example questions for quick start
 */
export const EXAMPLE_QUESTIONS = [
  "How do I enroll in a course?",
  "What courses are available?",
  "How do I get a certificate?",
  "What payment methods do you accept?",
  "How do I track my progress?",
];
