# 🎓 Learning Management System (LMS)

A modern, production-ready Learning Management System built with React, Node.js, and Supabase. Features a premium UI/UX inspired by top platforms like 360Learning and Cisco Networking Academy.

## ✨ Features

### 🎯 Core Functionality
- **Authentication System** - Secure signup/login with Supabase Auth
- **Course Management** - Create, edit, and publish courses with sections and lessons
- **Video Learning** - YouTube video integration with progress tracking
- **Mock Payment System** - Udemy-style checkout flow (UI only, no real payments)
- **Progress Tracking** - Auto-save progress, resume playback
- **Role-Based Access** - Student, Instructor, and Admin roles

### 🎨 User Experience
- **Modern UI** - Clean, responsive design with Tailwind CSS
- **Premium Components** - Custom-built component library
- **Smooth Animations** - Framer Motion animations and micro-interactions
- **Mobile Responsive** - Works perfectly on all devices
- **Dark/Light Theme** - Coming soon

### 🔧 Technical Stack
- **Frontend:** React 18 + Vite, Tailwind CSS, Zustand, React Router
- **Backend:** Node.js + Express, Prisma ORM
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Authentication
- **Video:** YouTube IFrame API
- **UI Components:** Custom shadcn/ui inspired components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone & Install
\`\`\`bash
git clone <repository-url>
cd LMS

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
\`\`\`

### 2. Environment Setup

**Backend (.env in /server folder):**
\`\`\`env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database (Your Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres

# JWT Secrets
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Optional Services
STRIPE_SECRET_KEY=sk_test_placeholder
CLOUDINARY_CLOUD_NAME=placeholder
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@email.com
EMAIL_FROM=LMS Platform <no-reply@lms.com>
\`\`\`

**Frontend (.env in /frontend folder):**
\`\`\`env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
VITE_APP_URL=http://localhost:5173
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_mock_key_for_ui_testing_only
\`\`\`

### 3. Database Setup
\`\`\`bash
cd server

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (creates sample users & courses)
npm run prisma:seed
\`\`\`

### 4. Start Development Servers
\`\`\`bash
# Terminal 1: Backend Server
cd server
npm run dev
# → http://localhost:5000

# Terminal 2: Frontend Server
cd frontend
npm run dev
# → http://localhost:5173
\`\`\`

## 🎯 Application Status

### ✅ **COMPLETED FEATURES**

#### Backend API (100% Complete)
- ✅ Authentication system (JWT + Supabase)
- ✅ User management (CRUD operations)
- ✅ Course management (create, edit, publish)
- ✅ Section & lesson management
- ✅ Enrollment system
- ✅ Progress tracking
- ✅ Mock payment processing
- ✅ Admin panel APIs
- ✅ Database schema & migrations
- ✅ Seed data with sample content

#### Frontend UI (95% Complete)
- ✅ **Pages (13/13):** All required pages implemented
  - Home, Course Listing, Course Detail, Course Player
  - Cart, Checkout, Order Success
  - Login, Register
  - Student Dashboard, Instructor Dashboard, Course Builder
  - Admin Dashboard
- ✅ **Components (25+):** All major components built
  - Course cards, video player, lesson lists
  - Payment forms, shopping cart
  - Admin tables, dashboard stats
  - Common UI components (buttons, cards, etc.)

#### Core Functionality
- ✅ **Authentication:** Signup/login/logout working
- ✅ **Course Creation:** Instructors can create courses
- ✅ **Video Learning:** YouTube integration with progress tracking
- ✅ **Mock Payments:** Complete checkout flow (UI only)
- ✅ **Responsive Design:** Works on mobile, tablet, desktop

### ⚠️ **CURRENT STATUS**
- **Backend Server:** ✅ Running on http://localhost:5000
- **Frontend Server:** ✅ Running on http://localhost:5173
- **Database:** ✅ Connected to Supabase PostgreSQL
- **Authentication:** ✅ Supabase Auth configured

### 🔄 **NEXT STEPS** (Optional Enhancements)
- [ ] Add real Stripe payment processing
- [ ] Implement quiz/assessment system
- [ ] Add certificate generation
- [ ] Build discussion forums
- [ ] Add course reviews/ratings
- [ ] Implement push notifications
- [ ] Add offline course downloads

## 📱 User Roles & Access

### 👨‍🎓 **Student**
- Browse and search courses
- Enroll in courses (free or paid)
- Watch videos and track progress
- Access enrolled course content
- View learning dashboard

### 👨‍🏫 **Instructor**
- Create and publish courses
- Add sections, lessons, and videos
- View enrollment statistics
- Manage course pricing
- Access instructor dashboard

### 👨‍💼 **Admin**
- Manage all users and courses
- View platform analytics
- Control course publishing
- Access admin dashboard
- System configuration

## 🎨 Design System

### Color Palette
\`\`\`css
Primary: #5B4EE8 (Deep Violet)
Secondary: #00C48C (Emerald Green)
Accent: #FF6B6B (Coral Red)
Background: #F7F8FC
Text: #1A1D2E
Muted: #6B7280
\`\`\`

### Typography
- **Headings:** Sora (Google Fonts)
- **Body:** DM Sans (Google Fonts)

## 🛠️ Development

### Project Structure
\`\`\`
LMS/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # UI Components
│   │   ├── pages/          # Route Pages
│   │   ├── store/          # Zustand State
│   │   ├── api/            # API Layer
│   │   └── utils/          # Helper Functions
│   └── public/             # Static Assets
│
└── server/                  # Express Backend
    ├── src/
    │   ├── modules/        # Feature Modules
    │   ├── middleware/     # Auth & Validation
    │   ├── config/         # App Configuration
    │   └── utils/          # Helper Functions
    └── prisma/             # Database Schema
\`\`\`

### Available Scripts

**Backend:**
\`\`\`bash
npm start          # Production server
npm run dev        # Development with nodemon
npm run prisma:*   # Database operations
\`\`\`

**Frontend:**
\`\`\`bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview build
\`\`\`

## 🔒 Security Features
- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only refresh token cookies
- CORS protection
- Rate limiting on auth endpoints
- SQL injection protection via Prisma
- Input validation with Zod

## 📖 API Documentation

### Authentication
\`\`\`
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/me         # Get current user
\`\`\`

### Courses
\`\`\`
GET  /api/courses         # List courses
GET  /api/courses/:slug   # Course details
POST /api/courses         # Create course (Instructor)
PUT  /api/courses/:id     # Update course (Instructor)
\`\`\`

### Full API documentation available at: http://localhost:5000/health

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

## 🎉 **Ready to Use!**

Your LMS is now running:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **Admin Panel:** http://localhost:5173/admin

**Default Login Credentials:**
- **Admin:** admin@lms.com / Password123!
- **Instructor:** instructor@lms.com / Password123!
- **Student:** student@lms.com / Password123!

Happy Learning! 📚✨