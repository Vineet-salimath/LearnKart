import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, X, Minimize2, Loader, Copy, Check } from 'lucide-react';
import { sendMessageToAI, EXAMPLE_QUESTIONS } from '../services/aiService';
import ChatbotLogo from './ChatbotLogo';
import './FloatingChatWidget.css';

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your LearnKart AI assistant. I can help you with courses, enrollment, progress tracking, and more. How can I assist you today?",
      timestamp: new Date(),
      id: 1
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Local fallback responses
  const getResponse = (userMessage) => {
    const messageLower = userMessage.toLowerCase();

    if (/enroll|enrollment|join|register/.test(messageLower)) {
      return "To enroll in a course:\n1. Browse our course catalog\n2. Click on your desired course\n3. Click 'Enroll Now'\n4. Complete payment (or enroll free)\n5. Start learning immediately!";
    }

    if (/course|courses|available/.test(messageLower)) {
      return "LearnKart offers courses in:\n🌐 Web Development\n🐍 Python Programming\n📊 Data Science & ML\n🔧 DevOps & Cloud\n📱 Mobile Development\n🔒 Cybersecurity\n\nBrowse our catalog to explore all courses!";
    }

    if (/progress|xp|points|reward/.test(messageLower)) {
      return "📈 Track your learning progress:\n✅ Complete lessons: +5 XP\n🎓 Enroll in courses: +10 XP\n📜 Complete courses: +50 XP\n🔥 Daily streaks earn bonus XP!\n\nCheck your Dashboard for detailed stats.";
    }

    if (/certificate|certification/.test(messageLower)) {
      return "🎓 Earn certificates by completing 100% of course content.\n\nBenefits:\n✅ Downloadable PDF\n✅ LinkedIn shareable\n✅ Unique verification ID\n✅ Lifetime validity";
    }

    if (/price|cost|payment|free|paid/.test(messageLower)) {
      return "💳 Flexible pricing:\n• Many FREE courses\n• Premium courses: ₹499-₹2,999\n• Payment options: Card, UPI, Net Banking\n• 30-day money-back guarantee\n• Lifetime access included";
    }

    if (/hello|hi|hey|greetings/.test(messageLower)) {
      return "👋 Hello! I'm your LearnKart AI assistant. I can help with courses, enrollment, certificates, payments, and platform support. What would you like to know?";
    }

    return "I'm here to help with LearnKart! Ask me about:\n• 📚 Course enrollment\n• 📈 Progress tracking\n• 🎓 Certificates\n• 💳 Payments\n• 🔧 Technical support\n\nWhat do you need help with?";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

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

    try {
      const aiResponse = await sendMessageToAI(currentInput, messages);

      const botResponse = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        id: Date.now() + 1
      };

      setMessages(prev => [...prev, botResponse]);

      // Increment unread if chat is minimized
      if (isMinimized) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);

      const botResponse = {
        role: 'assistant',
        content: getResponse(currentInput),
        timestamp: new Date(),
        id: Date.now() + 1
      };

      setMessages(prev => [...prev, botResponse]);

      if (isMinimized) {
        setUnreadCount(prev => prev + 1);
      }
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

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExampleClick = (question) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setUnreadCount(0);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="floating-chat-button group"
            aria-label="Open chat assistant"
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #111827 0%, #000000 100%)',
              border: '2px solid white',
              boxShadow: '0 12px 48px rgba(17, 24, 39, 0.35), 0 0 1px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
            }}
          >
            <ChatbotLogo size={32} className="text-white" />
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 px-2 py-1 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border border-white min-w-fit"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.div>
            )}
            
            {/* Pulse ring animation */}
            <motion.div
              animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: 'rgba(17, 24, 39, 0.45)' }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Widget Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? '64px' : '680px'
            }}
            exit={{ opacity: 0, y: 40, scale: 0.8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="floating-chat-widget"
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              width: '420px',
              maxWidth: 'calc(100vw - 64px)',
              height: isMinimized ? '64px' : '680px',
              maxHeight: 'calc(100vh - 100px)',
              backgroundColor: '#fff',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 10001,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                background: 'linear-gradient(135deg, #111827 0%, #1f2937 60%, #000000 100%)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                cursor: isMinimized ? 'pointer' : 'default',
                backdropFilter: 'blur(10px)',
              }}
              onClick={isMinimized ? toggleMinimize : undefined}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
                    <ChatbotLogo size={24} className="text-white" />
                  </div>
                  {/* Online Status Indicator */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-white rounded-full border-2 border-slate-800 shadow-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm leading-tight">LearnKart AI</h3>
                  <p className="text-white/75 text-xs font-medium">Online • Typically responds instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleMinimize}
                  className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 duration-200"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  <Minimize2 size={16} />
                </button>
                <button
                  onClick={toggleChat}
                  className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 duration-200"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Content (hidden when minimized) */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ backgroundColor: '#f9fafb' }}>
                  <AnimatePresence mode="popLayout">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10, x: message.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse justify-start' : 'justify-start'}`}
                      >
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm font-bold text-xs ${
                          message.role === 'assistant'
                            ? 'bg-gradient-to-br from-slate-800 to-black'
                            : 'bg-gradient-to-br from-slate-600 to-slate-800'
                        }`}>
                          {message.role === 'assistant' ? (
                            <ChatbotLogo size={14} className="text-white" />
                          ) : (
                            <User size={14} className="text-white" />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div className={`max-w-xs flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className="relative group">
                            <div
                              className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-all duration-200 ${
                                message.role === 'assistant'
                                  ? 'rounded-tl-none bg-white text-slate-900 border border-slate-200 group-hover:shadow-md'
                                    : 'rounded-tr-none bg-gradient-to-r from-slate-700 to-black text-white group-hover:shadow-lg'
                              }`}
                              style={{
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                              }}
                            >
                              <div className="whitespace-pre-wrap">
                                {message.content}
                              </div>
                            </div>
                            {message.role === 'assistant' && (
                              <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ opacity: 1, scale: 1 }}
                                onClick={() => handleCopy(message.content, message.id)}
                                className="absolute -top-2 -right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white border border-gray-200 shadow-sm hover:shadow-md"
                                title="Copy message"
                              >
                                {copiedId === message.id ? (
                                  <Check size={12} style={{ color: '#10b981' }} strokeWidth={3} />
                                ) : (
                                  <Copy size={12} style={{ color: '#6b7280' }} />
                                )}
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Loading - Typing Indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2.5 items-end"
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-black shadow-sm flex-shrink-0">
                        <ChatbotLogo size={14} className="text-white" />
                      </div>
                      <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-white border border-gray-200 shadow-sm flex items-center gap-1.5">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#111827' }}
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#374151' }}
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#000000' }}
                        />
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions (show only at start) */}
                {messages.length === 1 && (
                  <div className="px-4 py-3 border-t bg-gradient-to-br from-slate-100 to-white" style={{ borderColor: '#e5e7eb' }}>
                    <p className="text-xs font-bold mb-3 text-gray-700 uppercase tracking-wide">Suggested Topics:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {EXAMPLE_QUESTIONS.slice(0, 4).map((question, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleExampleClick(question)}
                          className="text-xs px-3 py-2.5 rounded-lg border bg-white hover:bg-slate-100 transition-all duration-200 text-gray-700 font-medium cursor-pointer"
                          style={{
                            borderColor: '#d1d5db',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}
                        >
                          {question.length > 20 ? question.slice(0, 17) + '...' : question}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="border-t p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e5e7eb' }}>
                  <div className="flex gap-2.5 items-end">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your question..."
                      className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        color: '#1f2937',
                        backgroundColor: '#f3f4f6',
                        border: '1.5px solid #e5e7eb',
                      }}
                      onFocus={(e) => {
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.borderColor = '#111827';
                        e.target.style.boxShadow = '0 0 0 3px rgba(17, 24, 39, 0.12)';
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6';
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="p-3 rounded-xl transition-all duration-200 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md active:scale-95"
                      style={{
                        background: input.trim() && !isLoading
                          ? 'linear-gradient(135deg, #111827, #000000)'
                          : '#e5e7eb',
                        color: input.trim() && !isLoading ? 'white' : '#9ca3af'
                      }}
                      title="Send message (Enter)"
                    >
                      <Send size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2.5 text-center">Press Enter to send</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatWidget;
