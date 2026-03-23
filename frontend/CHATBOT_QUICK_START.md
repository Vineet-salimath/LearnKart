
# 🚀 LearnKart Chatbot Quick Start Guide

Get the chatbot running in your LMS in 5 minutes.

---

## ⚡ Step 1: Import Component (30 seconds)

**In your page file** (e.g., `Home.jsx`, `Dashboard.jsx`):

```jsx
import FloatingChatWidget from '@/components/FloatingChatWidget';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Your page content */}
      <h1>Welcome to LearnKart</h1>
      
      {/* Add chatbot at the end */}
      <FloatingChatWidget />
    </div>
  );
}
```

✅ **That's it!** The chatbot is now live.

---

## 🎨 Step 2: Customize Appearance (2 minutes)

### Change Colors
Open `frontend/src/theme/designSystem.js`:

```javascript
const COLORS = {
  primary: '#3b82f6',      // Blue
  secondary: '#06b6d4',    // Cyan (change these values)
  // ...
};
```

Then update in `FloatingChatWidget.jsx`:

```jsx
// Find these and update:
className="bg-gradient-to-r from-blue-500 to-cyan-500"  // Change color names

style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}  // Change hex codes
```

### Change Logo
Replace `ChatbotLogo.jsx` with your own SVG:

```jsx
export default function ChatbotLogo({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      {/* Your SVG path here */}
    </svg>
  );
}
```

### Change Size
In `FloatingChatWidget.jsx`, find the widget container:

```jsx
// Change width and height
style={{
  width: window.innerWidth < 640 ? 'calc(100vw - 40px)' : '420px',  // Adjust width
  height: '680px',  // Adjust height
}}
```

### Change Position
```jsx
// Find this style object:
bottom: '2rem',  // Distance from bottom (32px)
right: '2rem',   // Distance from right (32px)

// Change to:
bottom: '4rem',  // 64px from bottom
right: '4rem',   // 64px from right
```

---

## 🔧 Step 3: Connect to Backend (3 minutes)

### Setup API Call
In `frontend/src/services/aiService.js`:

```javascript
export async function sendMessageToAI(message, conversationHistory) {
  try {
    const response = await fetch('/api/chat', {  // Your endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: conversationHistory
      })
    });

    const data = await response.json();
    return data.response;  // Return AI response
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}
```

### Update Component
In `FloatingChatWidget.jsx`, update the send handler:

```jsx
const handleSend = async () => {
  if (!input.trim()) return;

  // Add user message
  const userMessage = {
    role: 'user',
    content: input,
    id: Date.now()
  };

  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);

  try {
    // Call your API
    const response = await sendMessageToAI(input, messages);
    
    // Add AI response
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response,
      id: Date.now() + 1
    }]);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📱 Step 4: Test Responsiveness (1 minute)

### Mobile (375px - 640px)
```bash
# In browser dev tools:
1. Press F12 (or Cmd+Opt+I)
2. Click device toolbar icon
3. Select "iPhone 12"
4. Verify chatbot fits screen
5. Type in input - verify no iOS zoom
```

### Tablet (640px - 1024px)
```bash
1. Select "iPad" in dev tools
2. Verify positioning and sizing
3. Check button accessibility (touch targets 48px+)
```

### Desktop (1024px+)
```bash
1. Maximize browser window
2. Verify widget stays bottom-right
3. Check no overflow or layout shift
```

---

## ✅ Step 5: Verify All Features (1 minute)

- [ ] Chatbot appears on page
- [ ] Can type messages
- [ ] Floating button shows/hides
- [ ] Can minimize/expand
- [ ] Messages align correctly (left = AI, right = User)
- [ ] Typing indicator shows during loading
- [ ] Copy button works
- [ ] Enters work on suggestion buttons
- [ ] Responsive on mobile

---

## 🐛 Troubleshooting

### Chatbot Not Appearing
```bash
# Check 1: Is component imported?
// ❌ Wrong
import { FloatingChatWidget } from '@/components';

// ✅ Correct
import FloatingChatWidget from '@/components/FloatingChatWidget';

# Check 2: Is it in the JSX?
<FloatingChatWidget />  // ✅ Must be in render

# Check 3: Check console for errors
// Open browser dev tools → Console tab → Look for red errors
```

### Messages Not Sending
```javascript
// Check 1: Input field has text
if (!input.trim()) return;  // Won't send empty messages

// Check 2: API endpoint exists
try {
  const response = await fetch('/api/chat');
  console.log('API Response:', response);  // Debug output
} catch (error) {
  console.error('API Error:', error);  // Error message
}

// Check 3: Check network tab
// Dev Tools → Network → Refresh → Look for /api/chat request
```

### Styling Issues
```jsx
// Check 1: Is Tailwind CSS loaded?
// Look at page → right-click → Inspect → Check classes

// Check 2: Does file have Tailwind classes?
// E.g., className="bg-white text-gray-900"

// Check 3: Inline styles overriding?
// Inline styles have higher specificity than Tailwind
```

### Mobile Keyboard Issues
```jsx
// iPhone zooming on input?
// Solution: Add font-size: 16px to input
<input style={{ fontSize: '16px' }} />  // Prevents zoom

// Check FloatingChatWidget.jsx has:
style={{ fontSize: '16px' }}  // ✅ Must be present
```

---

## 📚 File Reference

| File | Purpose | Path |
|------|---------|------|
| `FloatingChatWidget.jsx` | Main component | `frontend/src/components/` |
| `FloatingChatWidget.css` | Styling & animations | `frontend/src/components/` |
| `ChatbotLogo.jsx` | Bot avatar icon | `frontend/src/components/` |
| `Icons.jsx` | Icon system | `frontend/src/components/common/` |
| `aiService.js` | API calls | `frontend/src/services/` |
| `designSystem.js` | Design tokens | `frontend/src/theme/` |
| `DESIGN_SYSTEM.md` | Design documentation | `frontend/` |

---

## 🎯 Common Customizations

### Change Greeting Message
```jsx
// In FloatingChatWidget.jsx, find initialMessages:
const initialMessages = [
  {
    role: 'assistant',
    content: 'Hi! 👋 How can I help with your learning today?',  // Change this
    id: 1
  }
];
```

### Add Suggested Questions
```jsx
const suggestedQuestions = [
  "How do I enroll in a course?",
  "What certificates will I get?",  // Change these
  "How do I access course materials?",
  "How do I reset my password?"
];
```

### Change Animation Speed
```jsx
// In CSS, find animation timing:
@keyframes message-slide-up {
  from: { opacity: 0; transform: translateY(10px); }
  to: { opacity: 1; transform: translateY(0); }
}

// Change 0.2s to 0.3s or 0.1s:
animation: message-slide-up 0.2s ease-out;  // ← Change this value
```

### Change Bubble Colors
```jsx
// AI message (white):
className="bg-white text-gray-900"  // Change bg-white or text-gray-900

// User message (blue gradient):
className="bg-gradient-to-r from-blue-500 to-cyan-500"  // Change gradient colors
```

---

## 🚀 Production Deployment

### Before Going Live
- [ ] Test on real iPhone & Android phones
- [ ] Test all browsers (Chrome, Safari, Firefox, Edge)
- [ ] Verify API endpoint is working
- [ ] Test with actual AI responses
- [ ] Check accessibility (keyboard nav, colors)
- [ ] Verify mobile responsiveness
- [ ] Test error scenarios (network down, API error)
- [ ] Check console for warnings

### Build Commands
```bash
# Development
npm run dev      # Hot reload, debugging

# Production
npm run build    # Optimized bundle
npm run preview  # Test production build locally
```

### Environment Variables
```env
# .env.production
VITE_API_URL=https://your-api.com/api/chat
VITE_AI_MODEL=gpt-4  # Or your model

# In code:
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 📊 Performance Tips

### Optimize Bundle Size
```javascript
// ✅ Good - lazy load the widget
const FloatingChatWidget = lazy(() => import('@/components/FloatingChatWidget'));

// In page:
<Suspense fallback={<div />}>
  <FloatingChatWidget />
</Suspense>
```

### Optimize Animations
```css
/* Reduce motion for slower devices */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Limit Message History
```javascript
// Keep only last 20 messages in memory
const maxMessages = 20;
if (messages.length > maxMessages) {
  setMessages(prev => prev.slice(-maxMessages));
}
```

---

## 🆘 Quick Help

### Get Latest Version
```bash
# Make sure you have latest files
cd frontend
git pull origin main
npm install
```

### Reset to Default
```bash
# Restore original component
git checkout frontend/src/components/FloatingChatWidget.jsx
```

### View Console Errors
```javascript
// Add this to debug
console.log('Messages:', messages);
console.log('Input value:', input);
console.log('Is loading:', isLoading);
```

---

## 📖 Full Documentation

For comprehensive details:
- Read `DESIGN_SYSTEM.md` for design specs
- Read `CHATBOT_IMPLEMENTATION.md` for architecture
- Read component comments in `FloatingChatWidget.jsx`
- Check browser console for error messages

---

## 🎉 You're Done!

Your LearnKart Chatbot is now:
- ✅ Live on your pages
- ✅ Fully styled and branded
- ✅ Mobile responsive
- ✅ Ready for production
- ✅ Easy to customize

**Next steps**:
1. Connect to your AI backend
2. Test with real users
3. Gather feedback
4. Iterate and improve

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Support**: Check documentation files or browser console errors
