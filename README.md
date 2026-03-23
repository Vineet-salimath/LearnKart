# LearnKart - AI-Powered Learning Management Platform

A complete, modern learning management system built with Next.js 14, featuring AI-powered tutoring, personalized quizzes, and comprehensive course management.

## 🚀 Features

### Core Platform Features
- **User Authentication**: Secure JWT-based authentication with bcryptjs password hashing
- **Course Management**: Browse, search, and enroll in courses with progress tracking
- **Interactive Lessons**: Rich lesson content with navigation and completion tracking
- **Progress Analytics**: Visual progress bars and learning statistics

### AI-Powered Features
- **AI Tutor**: 24/7 intelligent tutoring with course-aware responses
- **Smart Quizzes**: AI-generated questions based on lesson content
- **Personalized Recommendations**: AI-driven course suggestions based on learning progress
- **Graceful Fallback**: Works seamlessly even without OpenAI API key (demo mode)

### User Experience
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Clean, professional interface with gradient accents
- **Real-time Interactions**: Live chat with AI tutor and interactive components
- **Accessibility**: Built with semantic HTML and keyboard navigation

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Database**: SQLite with better-sqlite3 (self-contained, no external DB needed)
- **Authentication**: JWT tokens with bcryptjs
- **AI Integration**: OpenAI API (optional - graceful fallback included)
- **Icons**: Lucide React for consistent iconography

## 📚 Course Content

The platform comes pre-loaded with 4 comprehensive courses:

1. **Introduction to Python Programming** (Beginner)
   - Variables, data types, control structures
   - Functions, modules, and file handling
   - 5 detailed lessons with practical examples

2. **Web Development with React** (Intermediate)
   - JSX, components, props, and state
   - Hooks, routing, and API integration
   - Modern React development practices

3. **Machine Learning Fundamentals** (Advanced)
   - Supervised and unsupervised learning
   - Model evaluation and validation
   - Real-world ML applications

4. **Data Science with Pandas** (Intermediate)
   - Data manipulation and analysis
   - Grouping, merging, and transformations
   - Practical data science workflows

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd LearnKart
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional):
   Create a `.env.local` file:
   ```env
   # Optional - for full AI features
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional - custom JWT secret
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## 🎯 Key Features Walkthrough

### User Registration & Authentication
- Create an account or login with existing credentials
- Secure JWT tokens stored in localStorage
- Protected routes for enrolled users

### Course Exploration
- Browse all available courses
- Filter by level (Beginner/Intermediate/Advanced)
- Search courses by title, instructor, or content
- View detailed course information and lessons

### Learning Experience
- Enroll in courses with one click
- Navigate through structured lesson content
- Track progress with visual indicators
- Mark lessons as complete

### AI-Powered Learning
- **AI Tutor**: Ask questions and get instant, contextual help
- **Smart Quizzes**: Take AI-generated quizzes to test knowledge
- **Recommendations**: Get personalized course suggestions

### Progress Tracking
- Visual progress bars for course completion
- Learning statistics and achievements
- Enrollment history and performance metrics

## 🗄 Database Schema

The SQLite database includes the following tables:

- **users**: User accounts and authentication
- **courses**: Course information and metadata
- **lessons**: Individual lesson content and structure
- **enrollments**: User course enrollments
- **progress**: Lesson completion tracking
- **quiz_results**: Quiz scores and performance data

## 🔒 Security Features

- **Password Security**: bcryptjs hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **SQL Injection Prevention**: Prepared statements throughout
- **Input Validation**: Comprehensive validation on all endpoints
- **Protected Routes**: Authentication required for sensitive operations

## 🤖 AI Integration

### With OpenAI API Key
- Full AI tutoring capabilities
- Dynamic quiz generation
- Personalized learning recommendations
- Context-aware responses

### Demo Mode (No API Key)
- Mock AI responses that demonstrate functionality
- Static quiz questions based on content analysis
- Sample recommendations for user testing
- Full UI/UX experience maintained

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Landing page
│   ├── login/             # Authentication pages
│   ├── register/
│   ├── courses/           # Course catalog and details
│   │   └── [id]/         # Individual course pages
│   │       └── lesson/   # Lesson viewer
│   ├── ai-tutor/         # AI tutor interface
│   ├── quiz/             # AI-powered quizzes
│   └── api/              # API endpoints
│       ├── auth/         # Authentication
│       ├── courses/      # Course management
│       ├── lessons/      # Lesson content
│       ├── progress/     # Learning progress
│       └── ai/           # AI-powered features
├── components/            # Reusable React components
│   ├── Navbar.tsx        # Navigation component
│   ├── CourseCard.tsx    # Course display card
│   ├── ProgressBar.tsx   # Progress visualization
│   ├── AITutor.tsx       # AI chat interface
│   └── QuizComponent.tsx # Interactive quiz
└── lib/                  # Utility libraries
    ├── db.ts             # Database setup and operations
    ├── auth.ts           # JWT authentication helpers
    └── openai.ts         # AI integration wrapper
```

## 🎨 Design System

- **Primary Color**: Blue gradient theme
- **Secondary Color**: Purple accents
- **Typography**: Inter font family
- **Components**: Consistent spacing and shadows
- **Responsive**: Mobile-first approach
- **Icons**: Lucide React icon set

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/[id]` - Get course details
- `POST /api/courses` - Enroll in course (auth required)

### Lessons
- `GET /api/lessons/[id]` - Get lesson content
- `POST /api/lessons/[id]` - Mark lesson complete (auth required)

### Progress
- `GET /api/progress` - Get user progress (auth required)

### AI Features
- `POST /api/ai/chat` - AI tutor conversation
- `POST /api/ai/quiz` - Generate AI quiz
- `GET /api/ai/recommendations` - Get recommendations (auth required)

## 🧪 Testing

The application builds successfully and runs without errors:

```bash
npm run build  # ✓ Builds successfully
npm run dev    # ✓ Starts development server
```

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

The SQLite database file (`learnkart.db`) is automatically created and seeded on first run.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure build passes
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
1. Check the existing course content and documentation
2. Try the AI tutor for learning-related questions
3. Review the code structure for development questions

---

**Built with ❤️ using Next.js, TypeScript, and AI technology**