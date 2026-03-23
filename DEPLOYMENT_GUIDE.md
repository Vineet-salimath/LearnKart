# LearnKart Deployment Guide - Vercel + Railway

Complete production deployment guide for LearnKart using Vercel (frontend) and Railway (backend).

---

## 📋 Pre-Deployment Checklist

- [ ] All code committed to GitHub
- [ ] No sensitive data in `.env` files
- [ ] Database setup ready
- [ ] API endpoints tested
- [ ] Frontend build successful (`npm run build`)

---

## STEP 1: Commit & Push to GitHub

### 1.1 Initialize Git (if not done)
```bash
cd D:\Kodnest Internship\LMS
git init
```

### 1.2 Add remote repository
```bash
git remote add origin https://github.com/Vineet-salimath/LearnKart.git
```

### 1.3 Add all files
```bash
git add .
```

### 1.4 Create initial commit
```bash
git commit -m "Initial commit: LearnKart LMS with production-ready UI"
```

### 1.5 Push to GitHub
```bash
git branch -M main
git push -u origin main
```

**Verify:** Check GitHub repo at https://github.com/Vineet-salimath/LearnKart

---

## STEP 2: Deploy Backend to Railway

Railway hosts Node.js servers. Perfect for your Express backend.

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway to access your repos

### 2.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub"**
3. Select **LearnKart** repository
4. Click **"Deploy Now"**

### 2.3 Configure Environment Variables

**In Railway Dashboard:**
1. Go to your project
2. Click **Variables** tab
3. Add these variables:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_publishable_key
AI_API_KEY=your_ai_service_key
EMAIL_SERVICE_KEY=your_email_key
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

### 2.4 Configure Build & Start Commands

**In Railway Settings:**
1. **Root Directory:** `server`
2. **Build Command:** `npm install`
3. **Start Command:** `npm start` (or `node src/app.js`)

### 2.5 Get Production URL
- Railway will generate a URL like: `https://learnkart-backend.railway.app`
- Copy this URL for later (Vercel frontend will call this)

**Status:** ✅ Backend deployed

---

## STEP 3: Deploy Frontend to Vercel

Vercel is perfect for React apps with automatic deployment.

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repos

### 3.2 Deploy Frontend

**Option A: From Dashboard**
1. Click **"New Project"**
2. Select **LearnKart** repo
3. Select **Framework: Vite** (or React)
4. Vercel auto-detects settings
5. Click **"Deploy"**

**Option B: Using Vercel CLI**
```bash
npm install -g vercel
cd frontend
vercel --prod
```

### 3.3 Configure Environment Variables

**In Vercel Project Settings:**
1. Go to **Settings → Environment Variables**
2. Add these variables:

```env
VITE_API_URL=https://your-railway-backend-url
VITE_AI_SERVICE=your_ai_service_url
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_APP_NAME=LearnKart
VITE_ENVIRONMENT=production
```

### 3.4 Configure Build Settings

**In Vercel Settings:**
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Root Directory:** `frontend`

### 3.5 Get Production URL
- Vercel generates URL: `https://learnkart.vercel.app`
- This is your public frontend URL

**Status:** ✅ Frontend deployed

---

## STEP 4: Connect Frontend & Backend

### 4.1 Update Backend CORS Settings

**In `server/src/app.js`:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://learnkart.vercel.app',  // Your Vercel URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 4.2 Update Railway Environment Variable
- Update `CORS_ORIGIN` in Railway to your Vercel URL
- Redeploy backend: Push changes to GitHub, Railway auto-deploys

### 4.3 Update Frontend Environment
- Vercel auto-deploys when you push to GitHub
- Make sure `VITE_API_URL` points to Railway backend

### 4.4 Test Connection
```bash
# In browser console (on Vercel app):
console.log(import.meta.env.VITE_API_URL)  // Should show Railway URL

# Test API call:
fetch('https://your-railway-url/api/test')
  .then(r => r.json())
  .then(data => console.log(data))
```

---

## STEP 5: Database Setup

### Option A: Railway PostgreSQL

**In Railway Dashboard:**
1. Click **"New Service"**
2. Select **"PostgreSQL"**
3. Railway generates `DATABASE_URL`
4. Copy to backend environment variables
5. Run migrations:
```bash
cd server
npx prisma migrate deploy
npx prisma db seed
```

### Option B: Existing Database
Update `DATABASE_URL` in Railway with your existing database connection string.

---

## STEP 6: Optional - Custom Domain

### For Frontend (Vercel)
1. Go to Vercel **Project Settings**
2. Click **"Domains"**
3. Add custom domain (e.g., `learnkart.com`)
4. Follow DNS configuration

### For Backend (Railway)
1. Go to Railway **Project Settings**
2. Click **"Domain"**
3. Add custom domain (e.g., `api.learnkart.com`)
4. Configure DNS

---

## STEP 7: Monitoring & Logs

### Railway Logs
```bash
# View logs in Railway Dashboard
Project → Logs tab

# Or via CLI:
railway logs
```

### Vercel Logs
```bash
# View in Vercel Dashboard
Project → Deployments → [Recent Deployment] → Logs
```

### Error Handling
- Check Network tab in browser DevTools
- Check Railway/Vercel logs
- Verify environment variables are set
- Test API endpoints with Postman/Thunder Client

---

## STEP 8: Continuous Deployment (Auto-Deploy)

**Both platforms support auto-deployment:**

### Setup:
1. Push changes to GitHub `main` branch
2. Vercel automatically rebuilds & deploys frontend
3. Railway automatically rebuilds & deploys backend
4. Check deployment status in dashboards

### Disable Auto-Deploy (if needed):
- **Vercel:** Project Settings → Git → Auto-deploy toggle
- **Railway:** Project Settings → Deployments

---

## Production Checklist

### Security
- [ ] Remove all `.env.local` files
- [ ] Use strong JWT secret
- [ ] Enable HTTPS everywhere
- [ ] Configure CORS properly
- [ ] Sanitize user inputs
- [ ] Rate limiting enabled
- [ ] No console.log in production

### Performance
- [ ] Frontend minified & optimized
- [ ] Database indexes created
- [ ] Caching headers set
- [ ] Code splitting enabled
- [ ] Images optimized
- [ ] CDN configured (optional)

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Log aggregation
- [ ] Alert system configured

### Testing
- [ ] All API endpoints tested
- [ ] Mobile responsive verified
- [ ] Cross-browser testing done
- [ ] Load testing completed
- [ ] Security audit passed

---

## Troubleshooting

### Frontend Not Loading
```bash
# Build locally first
cd frontend
npm run build
npm run preview

# Check Vercel logs
# Verify VITE_API_URL is set correctly
```

### API Calls Failing
```bash
# Test backend directly
curl https://your-railway-url/api/test

# Check CORS headers
# Verify DATABASE_URL in Railway
# Check Network tab in DevTools
```

### Database Connection Error
```bash
# Verify DATABASE_URL format
# Check database is running
# Test connection:
psql "your-database-url"
```

### Build Failures
```bash
# Local build test
npm run build

# Check build logs in Vercel
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Cost Estimation

### Railway
- **Free:** 5GB storage, 100 CPU hours/month
- **Pay as you go:** ~$5/month for small apps
- **Pro:** $20/month (unlimited)

### Vercel
- **Hobby Plan (Free):** Unlimited deployments, good for hobby projects
- **Pro Plan:** $20/month (faster builds, analytics)

---

## Post-Deployment Steps

1. **Verify URLs**
   - Frontend: https://learnkart.vercel.app
   - Backend: https://your-railway-url

2. **Test Features**
   - User registration
   - Login/authentication
   - Course enrollment
   - Chatbot functionality
   - Payment processing (if enabled)

3. **Set Up Monitoring**
   - Add error tracking
   - Configure uptime monitoring
   - Set up alerts

4. **Communicate with Team**
   - Share production URLs
   - Document API endpoints
   - Create runbooks for common issues

---

## Useful Links

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://railway.app/docs
- **Vercel CLI:** https://vercel.com/cli
- **Railway CLI:** https://docs.railway.app/develop/cli
- **Prisma Deploy:** https://www.prisma.io/docs/guides/deployment

---

## Quick Reference Commands

```bash
# Git operations
git add .
git commit -m "message"
git push

# Vercel CLI
vercel --prod              # Deploy to production
vercel env ls              # List environment variables
vercel logs                # View logs

# Railway CLI
railway up                 # Deploy
railway logs               # View logs
railway link               # Link to project

# Database
npm install @prisma/client
npx prisma migrate deploy  # Run migrations
npx prisma db seed         # Seed data
```

---

**Version:** 1.0  
**Last Updated:** March 2026  
**Status:** 🟢 Production Ready
