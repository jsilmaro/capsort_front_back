# Render Deployment Guide - Capsort Backend

## 🚀 Quick Deployment Steps

### Prerequisites:
- ✅ GitHub account
- ✅ Render account (sign up at https://render.com)
- ✅ Neon PostgreSQL database (or use Render's PostgreSQL)

---

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Commit all changes:**
```bash
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

2. **Verify files are in place:**
- ✅ `backend/render.yaml`
- ✅ `backend/build.sh`
- ✅ `backend/package.json` (updated with build scripts)
- ✅ `backend/.env.example` (for reference)

---

### Step 2: Set Up Database

#### Option A: Use Existing Neon Database (Recommended)

1. Go to your Neon dashboard
2. Copy your connection string
3. You'll use this in Render environment variables

#### Option B: Use Render PostgreSQL

1. In Render dashboard, click "New +"
2. Select "PostgreSQL"
3. Configure:
   - Name: `capsort-db`
   - Database: `capsort`
   - User: (auto-generated)
   - Region: Oregon (or closest to you)
   - Plan: Free
4. Click "Create Database"
5. Copy the "External Database URL"

---

### Step 3: Deploy Backend to Render

#### Method 1: Using render.yaml (Recommended)

1. **Go to Render Dashboard:**
   - Visit https://dashboard.render.com

2. **Create New Web Service:**
   - Click "New +"
   - Select "Web Service"

3. **Connect Repository:**
   - Connect your GitHub account
   - Select your repository: `capsort_front_back`
   - Click "Connect"

4. **Configure Service:**
   - Name: `capsort-backend`
   - Region: Oregon (or closest)
   - Branch: `main`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install && npx prisma generate && npx prisma db push`
   - Start Command: `npm start`
   - Plan: Free

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"

   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=your_neon_or_render_database_url
   DIRECT_URL=your_neon_or_render_database_url
   JWT_SECRET=your_super_secret_jwt_key_here_change_this
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-frontend-url.vercel.app
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

   **Important:** 
   - Replace `DATABASE_URL` with your actual database connection string
   - Generate a strong `JWT_SECRET` (use: `openssl rand -base64 32`)
   - Update `FRONTEND_URL` after deploying frontend

6. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

#### Method 2: Manual Configuration

If render.yaml doesn't work, configure manually:

1. **Build Command:**
```bash
npm install && npx prisma generate && npx prisma db push
```

2. **Start Command:**
```bash
npm start
```

3. **Environment Variables:** (Same as above)

---

### Step 4: Verify Deployment

1. **Check Health Endpoint:**
```
https://your-backend-url.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Capsort Backend API is running",
  "timestamp": "2025-11-30T...",
  "environment": "production"
}
```

2. **Test API Endpoints:**
```bash
# Test projects endpoint
curl https://your-backend-url.onrender.com/api/projects

# Test auth endpoint
curl https://your-backend-url.onrender.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

---

### Step 5: Create Admin Account

After deployment, create an admin account:

1. **SSH into Render (if needed):**
   - Go to your service in Render
   - Click "Shell" tab
   - Run: `node scripts/createAdmin.js`

2. **Or use Prisma Studio:**
   - Install Prisma CLI locally
   - Connect to production database
   - Run: `npx prisma studio`
   - Add admin user manually

3. **Or use API:**
```bash
# Create admin via database directly
# Use your local Prisma Studio connected to production DB
```

---

### Step 6: Update Frontend Configuration

Update your frontend `.env` file:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

Redeploy frontend with new API URL.

---

## 🔧 Environment Variables Reference

### Required Variables:

```env
# Node Environment
NODE_ENV=production

# Server Port (Render sets this automatically)
PORT=5000

# Database Connection
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
DIRECT_URL=postgresql://user:password@host:5432/database?sslmode=require

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=7d

# Frontend URLs (for CORS)
FRONTEND_URL=https://your-frontend-url.vercel.app
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Optional Variables:

```env
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload (if using)
MAX_FILE_SIZE=10485760

# Email Service (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 🗄️ Database Setup

### Initial Schema Push:

The build script automatically runs:
```bash
npx prisma db push
```

This creates all tables in your database.

### Verify Database:

1. **Check tables exist:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Expected tables:
- User
- Project
- SavedProject
- AboutContent

2. **Create initial admin:**
```sql
INSERT INTO "User" (
  "fullName", 
  "contactNumber", 
  "email", 
  "password", 
  "role", 
  "createdAt"
) VALUES (
  'Admin User',
  '+639123456789',
  'admin@capsort.com',
  '$2a$12$hashed_password_here',
  'admin',
  NOW()
);
```

---

## 🔍 Troubleshooting

### Issue 1: Build Fails

**Error:** `Prisma generate failed`

**Solution:**
1. Check `DATABASE_URL` is set correctly
2. Ensure Prisma is in dependencies (not devDependencies)
3. Try manual build command:
```bash
npm install && npx prisma generate
```

### Issue 2: Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
1. Verify `DATABASE_URL` format:
```
postgresql://user:password@host:5432/database?sslmode=require
```
2. Check database is running
3. Verify SSL mode is enabled
4. Test connection locally first

### Issue 3: CORS Errors

**Error:** `Access-Control-Allow-Origin`

**Solution:**
1. Add frontend URL to environment variables:
```env
FRONTEND_URL=https://your-frontend.vercel.app
CLIENT_URL=https://your-frontend.vercel.app
```
2. Verify CORS configuration in `src/index.js`
3. Check frontend is using correct API URL

### Issue 4: JWT Errors

**Error:** `Invalid token` or `Token expired`

**Solution:**
1. Ensure `JWT_SECRET` is set in production
2. Use same secret across all instances
3. Check token expiration time
4. Verify frontend is sending token correctly

### Issue 5: Slow Cold Starts

**Issue:** First request takes 30+ seconds

**Solution:**
- This is normal for Render free tier
- Service spins down after 15 minutes of inactivity
- Consider upgrading to paid plan for always-on service
- Or use a cron job to ping health endpoint every 10 minutes

---

## 📊 Monitoring

### Check Logs:

1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. Monitor for errors

### Health Checks:

Render automatically monitors:
- `/health` endpoint
- Response time
- Error rates

### Set Up Alerts:

1. Go to service settings
2. Add notification email
3. Configure alert thresholds

---

## 🔄 Continuous Deployment

### Auto-Deploy on Push:

Render automatically deploys when you push to main branch:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will:
1. Detect changes
2. Run build command
3. Deploy new version
4. Zero-downtime deployment

### Manual Deploy:

1. Go to Render dashboard
2. Select your service
3. Click "Manual Deploy"
4. Select branch
5. Click "Deploy"

---

## 🔐 Security Checklist

Before going live:

- [ ] Change `JWT_SECRET` to strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (automatic on Render)
- [ ] Configure CORS with specific origins
- [ ] Set up rate limiting
- [ ] Review and update security headers
- [ ] Enable database SSL
- [ ] Set up monitoring and alerts
- [ ] Create strong admin passwords
- [ ] Review API endpoints for security
- [ ] Test authentication flows
- [ ] Verify password reset works
- [ ] Check file upload limits
- [ ] Review error messages (don't expose sensitive info)

---

## 📝 Post-Deployment Tasks

1. **Test All Endpoints:**
   - Authentication (login, register, password reset)
   - Projects (CRUD operations)
   - Saved projects (save, unsave)
   - Admin features
   - Analytics

2. **Create Admin Account:**
   - Use scripts or Prisma Studio
   - Test admin login

3. **Update Frontend:**
   - Set production API URL
   - Test frontend-backend integration
   - Verify CORS works

4. **Monitor Performance:**
   - Check response times
   - Monitor error rates
   - Review logs

5. **Set Up Backups:**
   - Configure database backups
   - Export important data
   - Document recovery procedures

---

## 🌐 Your Deployment URLs

After deployment, save these URLs:

```
Backend API: https://capsort-backend.onrender.com
Health Check: https://capsort-backend.onrender.com/health
API Base: https://capsort-backend.onrender.com/api

Database: [Your Neon or Render PostgreSQL URL]
```

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)

---

## ✅ Deployment Checklist

### Pre-Deployment:
- [x] Update package.json with build scripts
- [x] Create render.yaml
- [x] Create build.sh
- [x] Update CORS configuration
- [x] Create .env.example
- [x] Test locally
- [x] Commit and push to GitHub

### Deployment:
- [ ] Create Render account
- [ ] Set up database
- [ ] Create web service
- [ ] Configure environment variables
- [ ] Deploy backend
- [ ] Verify health endpoint
- [ ] Test API endpoints

### Post-Deployment:
- [ ] Create admin account
- [ ] Update frontend API URL
- [ ] Test full application
- [ ] Set up monitoring
- [ ] Configure alerts
- [ ] Document URLs
- [ ] Create backups

---

**Your backend is now ready for Render deployment!** 🚀

Follow the steps above and your API will be live in minutes.
