import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, BookOpen, Award, CreditCard, HelpCircle, Loader, Copy, Check, RotateCcw } from 'lucide-react';
import { sendMessageToAI, EXAMPLE_QUESTIONS } from '../services/aiService';
import { useAuthStore } from '../store/authStore';
import COURSES_WITH_CONTENT from '../data/coursesData';

const AIAssistant = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hello! I'm KAI, your AI learning assistant. I'm here to help you navigate the KodNest LMS, answer questions about courses, and support your learning journey. How can I assist you today?",
      timestamp: new Date(),
      id: 1
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // LMS Knowledge Base - same as backend
  const getResponse = (userMessage) => {
    const messageLower = userMessage.toLowerCase();

    // Enrollment questions
    if (/enroll|enrollment|join|register/.test(messageLower)) {
      return "To enroll in a course:\n1. Go to the Browse page to see all available courses\n2. Click on the course you're interested in\n3. Click 'Enroll Now' in the modal that appears\n4. Choose your payment method (Card, UPI, or Net Banking) for paid courses\n5. Complete the enrollment process\n\nFree courses can be enrolled instantly! After enrollment, you can access the course from 'My Courses' page.";
    }

    // Course questions
    if (/course|courses|available/.test(messageLower)) {
      return "We offer courses in these main areas:\n\n🌐 **Web Development**: Full Stack, React, Node.js\n🐍 **Python**: Programming fundamentals to advanced topics\n📊 **Data Science**: ML, AI, Data Analytics\n🔧 **DevOps**: Docker, Kubernetes, CI/CD\n☁️ **Cloud**: AWS, Azure, GCP\n📱 **Mobile**: iOS, Android development\n🔒 **Security**: Cybersecurity basics to advanced\n\nVisit the Browse page to see all 30+ courses with detailed descriptions!";
    }

    // Progress/XP questions
    if (/progress|xp|points|reward/.test(messageLower)) {
      return "📈 **Progress & Rewards System**:\n\n- ✅ Complete a lesson: +5 XP\n- 🎓 Enroll in a course: +10 XP\n- 📜 Complete a course: +50 XP\n- 🔥 Daily login streak: Bonus XP\n\nTrack your progress from the Dashboard page. Your XP level unlocks special badges and achievements!";
    }

    // Certificate questions
    if (/certificate|certification/.test(messageLower)) {
      return "🎓 **Certificates**:\n\nAll courses provide a Certificate of Completion once you finish 100% of the course content.\n\nFeatures:\n- Downloadable PDF certificate\n- Shareable on LinkedIn\n- Includes course name, completion date, and unique ID\n- Lifetime validity\n\nComplete all lessons in a course to receive your certificate!";
    }

    // Payment/pricing questions
    if (/price|cost|payment|free|paid/.test(messageLower)) {
      return "💳 **Pricing & Payment**:\n\n- Many courses are **FREE** to enroll\n- Premium courses range from ₹499 to ₹2,999\n- Payment methods: Card, UPI, Net Banking\n- 🔒 Secure SSL encrypted transactions\n- 💯 30-day money-back guarantee\n\n**What's Included:**\n✅ Lifetime access\n✅ Mobile & desktop streaming\n✅ Certificate of completion\n✅ Downloadable resources\n✅ Full refund within 30 days";
    }

    // Technical issues
    if (/problem|issue|error|not working|help/.test(messageLower)) {
      return "🔧 **Need Help?**\n\nCommon solutions:\n1. **Video not playing**: Refresh the page or check your internet connection\n2. **Can't see enrolled courses**: Make sure you're logged in\n3. **Payment failed**: Try a different payment method or contact support\n4. **Progress not saving**: Enable cookies in your browser\n\nStill having issues? Contact support at support@kodnest.com";
    }

    // Greeting
    if (/hello|hi|hey|greetings/.test(messageLower)) {
      return "👋 Hello! I'm KAI, your LMS assistant!\n\nI can help you with:\n- 📚 Finding and enrolling in courses\n- 🎯 Tracking your progress\n- 🎓 Certificate information\n- 💳 Payment and pricing questions\n- 🔧 Platform troubleshooting\n\nWhat would you like to know?";
    }

    // Default response
    return "I'm here to help with the KodNest LMS! I can assist you with:\n\n- 📚 Course enrollment and navigation\n- 📈 Progress tracking and XP system\n- 🎓 Certificates and achievements\n- 💳 Payment and pricing\n- 🔧 Technical support\n\nCould you please clarify what you'd like help with?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
      id: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const pathname = window.location.pathname;
    const enrolledCourseIds = isAuthenticated
      ? JSON.parse(localStorage.getItem('enrolledCourses') || '[]')
      : [];

    const learningPathMatch = pathname.match(/^\/learn\/(\d+)/);
    const activeCourseId = learningPathMatch?.[1] || null;
    const activeCourse = COURSES_WITH_CONTENT.find(
      (course) => String(course.id) === String(activeCourseId)
    );

    try {
      // Use AI service to get response from Hugging Face
      const aiResponse = await sendMessageToAI(currentInput, messages, {
        isAuthenticated,
        userName: user?.name || 'Learner',
        enrolledCourseIds,
        currentPath: pathname,
        lastViewedCourseId: activeCourseId,
        activeCourseTitle: activeCourse?.title || null,
      });

      const botResponse = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        id: Date.now() + 1
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);

      // Fallback to local response if AI service fails
      const botResponse = {
        role: 'assistant',
        content: getResponse(currentInput),
        timestamp: new Date(),
        id: Date.now() + 1
      };

      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestionButtons = [
    { icon: BookOpen, text: "How do I enroll?", question: "How do I enroll in a course?" },
    { icon: Award, text: "Get certificate", question: "How do I get a certificate?" },
    { icon: CreditCard, text: "Pricing info", question: "What are the course prices?" },
    { icon: HelpCircle, text: "Technical help", question: "I need technical support" },
  ];

  const handleSuggestionClick = (question) => {
    setInput(question);
  };

  // Copy message to clipboard
  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Reset conversation
  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content: "👋 Hello! I'm KAI, your AI learning assistant. How can I help you today?",
        timestamp: new Date(),
        id: 1
      }
    ]);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="border-b" style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)'
      }}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                  <Bot className="text-white" size={24} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2"
                     style={{ borderColor: 'var(--bg-secondary)' }}/>
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  KAI Assistant
                  <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Your AI-powered LMS companion
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg border transition-all hover:scale-105 flex items-center gap-2"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-secondary)'
              }}
              title="Start new conversation"
            >
              <RotateCcw size={16} />
              <span className="text-sm hidden md:inline">New Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col h-[calc(100vh-140px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.role === 'assistant'
                    ? 'bg-gradient-to-br from-slate-900 to-black'
                    : 'bg-gradient-to-br from-gray-600 to-gray-800'
                }`}>
                  {message.role === 'assistant' ? (
                    <Bot size={20} className="text-white" />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex-1 max-w-3xl ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                  <div className="relative group">
                    <div
                      className={`rounded-2xl px-5 py-3 ${
                        message.role === 'assistant'
                          ? 'rounded-tl-none'
                          : 'rounded-tr-none'
                      }`}
                      style={{
                        backgroundColor: message.role === 'assistant'
                          ? 'var(--bg-secondary)'
                          : '#111827',
                        color: message.role === 'assistant' ? 'var(--text-primary)' : 'white',
                        border: message.role === 'assistant' ? '1px solid var(--border-primary)' : 'none'
                      }}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div className="text-xs mt-2 opacity-50">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {/* Copy Button for Assistant Messages */}
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-secondary)'
                        }}
                        title="Copy response"
                      >
                        {copiedId === message.id ? (
                          <Check size={14} style={{ color: 'var(--accent-primary)' }} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
                <Bot size={20} className="text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-none px-5 py-3"
                   style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                <div className="flex gap-2">
                  <Loader className="animate-spin" size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>KAI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Quick actions:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {suggestionButtons.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.question)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <suggestion.icon size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span className="text-sm">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input Area */}
        <div className="border rounded-2xl p-2" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}>
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about courses, enrollment, or the platform..."
              rows={1}
              className="flex-1 bg-transparent border-0 outline-none resize-none px-4 py-3"
              style={{ color: 'var(--text-primary)' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              style={{
                background: input.trim() && !isLoading
                  ? 'linear-gradient(135deg, #111827, #000000)'
                  : 'var(--bg-tertiary)',
                color: 'white'
              }}
            >
              <Send size={20} />
            </button>
          </div>
          <div className="px-2 py-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Press Enter to send, Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
