# Repository Separation Guide

## 🎯 Goal

- **Frontend Only** → https://github.com/mmxlvsu/Capsort.git
- **Backend Only** → https://github.com/jsilmaro/capsort_front_back.git

---

## 📋 Current Situation

Right now you have a monorepo with both frontend and backend:
```
CAPSORT_FRONT_BACK/
├── frontend/
├── backend/
└── documentation files
```

We need to:
1. Push only backend to `jsilmaro/capsort_front_back`
2. Push only frontend to `mmxlvsu/Capsort`

---

## 🚀 Step-by-Step Separation

### Step 1: Commit Current Changes to Monorepo

First, let's save everything:

```bash
# In root directory
git add .
git commit -m "Prepare for repository separation - backend ready for Render"
git push origin main
```

---

### Step 2: Push Backend to Main Repo

The backend repo (`jsilmaro/capsort_front_back`) will contain ONLY the backend code.

#### Option A: Using Subtree (Recommended)

```bash
# In root directory (CAPSORT_FRONT_BACK)

# Add backend remote if not already added
git remote add backend-only https://github.com/jsilmaro/capsort_front_back.git

# Push only backend folder to backend repo
git subtree push --prefix=backend backend-only main
```

#### Option B: Manual Method

```bash
# Create a new directory for backend only
cd ..
mkdir capsort-backend-only
cd capsort-backend-only

# Initialize git
git init

# Add remote
git remote add origin https://github.com/jsilmaro/capsort_front_back.git

# Copy backend files
cp -r ../CAPSORT_FRONT_BACK/backend/* .
cp ../CAPSORT_FRONT_BACK/RENDER-DEPLOYMENT-GUIDE.md .
cp ../CAPSORT_FRONT_BACK/RENDER-QUICK-START.md .
cp ../CAPSORT_FRONT_BACK/BACKEND-RENDER-READY.md .

# Create README for backend
cat > README.md << 'EOF'
# Capsort Backend API

Backend API for Capsort - Capstone Collection Platform

## 🚀 Quick Start

### Local Development:
\`\`\`bash
npm install
npm run dev
\`\`\`

### Deployment:
See [RENDER-DEPLOYMENT-GUIDE.md](RENDER-DEPLOYMENT-GUIDE.md)

## 📚 Documentation

- [Render Deployment Guide](RENDER-DEPLOYMENT-GUIDE.md)
- [Quick Start](RENDER-QUICK-START.md)
- [Backend Ready](BACKEND-RENDER-READY.md)

## 🔗 Related Repositories

- Frontend: https://github.com/mmxlvsu/Capsort
EOF

# Commit and push
git add .
git commit -m "Backend only - ready for Render deployment"
git branch -M main
git push -u origin main --force
```

---

### Step 3: Push Frontend to Frontend Repo

The frontend repo (`mmxlvsu/Capsort`) already exists and has frontend code.

#### Update Frontend Repo:

```bash
# Navigate to frontend directory
cd CAPSORT_FRONT_BACK/frontend

# Check current remote
git remote -v

# Should show: origin  https://github.com/mmxlvsu/Capsort.git

# Make sure all changes are committed
git add .
git commit -m "Update frontend with latest changes - Task 3 complete"

# Push to frontend repo
git push origin main
```

---

## 🔧 Alternative: Clean Separation Script

I'll create a script to automate this:

### Create `separate-repos.sh`:

```bash
#!/bin/bash

echo "🔄 Starting repository separation..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Commit current changes
echo -e "${BLUE}Step 1: Committing current changes...${NC}"
git add .
git commit -m "Prepare for repository separation"

# Step 2: Push backend only
echo -e "${BLUE}Step 2: Preparing backend repository...${NC}"
cd ..
mkdir -p capsort-backend-temp
cd capsort-backend-temp

# Copy backend files
cp -r ../CAPSORT_FRONT_BACK/backend/* .
cp ../CAPSORT_FRONT_BACK/RENDER-*.md .
cp ../CAPSORT_FRONT_BACK/BACKEND-RENDER-READY.md .

# Create backend README
cat > README.md << 'EOF'
# Capsort Backend API

Backend API for Capsort - Capstone Collection Platform

## 🚀 Deployment

This backend is ready for deployment on Render.

See [RENDER-DEPLOYMENT-GUIDE.md](RENDER-DEPLOYMENT-GUIDE.md) for instructions.

## 📚 Documentation

- [Render Deployment Guide](RENDER-DEPLOYMENT-GUIDE.md)
- [Quick Start](RENDER-QUICK-START.md)

## 🔗 Frontend Repository

https://github.com/mmxlvsu/Capsort
EOF

# Initialize and push
git init
git add .
git commit -m "Backend only - ready for Render deployment"
git branch -M main
git remote add origin https://github.com/jsilmaro/capsort_front_back.git
git push -u origin main --force

echo -e "${GREEN}✅ Backend pushed to jsilmaro/capsort_front_back${NC}"

# Step 3: Push frontend
echo -e "${BLUE}Step 3: Updating frontend repository...${NC}"
cd ../CAPSORT_FRONT_BACK/frontend

git add .
git commit -m "Update frontend - Task 3 complete"
git push origin main

echo -e "${GREEN}✅ Frontend pushed to mmxlvsu/Capsort${NC}"

echo -e "${GREEN}🎉 Repository separation complete!${NC}"
```

---

## 📝 Manual Separation (Safest Method)

### For Backend Repository:

1. **Create new folder:**
```bash
cd ..
mkdir capsort-backend
cd capsort-backend
```

2. **Copy backend files:**
```bash
# Copy all backend files
cp -r ../CAPSORT_FRONT_BACK/backend/* .

# Copy deployment docs
cp ../CAPSORT_FRONT_BACK/RENDER-DEPLOYMENT-GUIDE.md .
cp ../CAPSORT_FRONT_BACK/RENDER-QUICK-START.md .
cp ../CAPSORT_FRONT_BACK/BACKEND-RENDER-READY.md .
```

3. **Create backend-specific README:**
```bash
cat > README.md << 'EOF'
# Capsort Backend API

Backend API for Capsort - Capstone Collection Platform

## 🚀 Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## 📦 Deployment

Ready for Render deployment. See [RENDER-DEPLOYMENT-GUIDE.md](RENDER-DEPLOYMENT-GUIDE.md)

## 🔗 Frontend

https://github.com/mmxlvsu/Capsort
EOF
```

4. **Initialize git and push:**
```bash
git init
git add .
git commit -m "Backend only - ready for Render deployment"
git branch -M main
git remote add origin https://github.com/jsilmaro/capsort_front_back.git
git push -u origin main --force
```

### For Frontend Repository:

Frontend already has its own repo, just update it:

```bash
cd CAPSORT_FRONT_BACK/frontend
git add .
git commit -m "Update frontend with latest features"
git push origin main
```

---

## 🗂️ Final Repository Structure

### Backend Repo (jsilmaro/capsort_front_back):
```
capsort_front_back/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── index.js
├── prisma/
│   └── schema.prisma
├── scripts/
├── tests/
├── package.json
├── .env.example
├── render.yaml
├── build.sh
├── README.md
├── RENDER-DEPLOYMENT-GUIDE.md
├── RENDER-QUICK-START.md
└── BACKEND-RENDER-READY.md
```

### Frontend Repo (mmxlvsu/Capsort):
```
Capsort/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── assets/
├── public/
├── package.json
├── .env
├── .env.example
└── README.md
```

---

## ✅ Verification

After separation, verify:

### Backend Repo:
```bash
git clone https://github.com/jsilmaro/capsort_front_back.git
cd capsort_front_back
ls -la
# Should see: src/, prisma/, package.json, etc.
# Should NOT see: frontend/
```

### Frontend Repo:
```bash
git clone https://github.com/mmxlvsu/Capsort.git
cd Capsort
ls -la
# Should see: src/, public/, package.json, etc.
# Should NOT see: backend/
```

---

## 🔄 Keeping Repos in Sync

After separation, when you make changes:

### For Backend Changes:
```bash
# Work in backend repo
cd capsort-backend
# Make changes
git add .
git commit -m "Update backend"
git push origin main
```

### For Frontend Changes:
```bash
# Work in frontend repo
cd Capsort
# Make changes
git add .
git commit -m "Update frontend"
git push origin main
```

---

## 🚨 Important Notes

1. **Backup First:**
   - Make sure your current monorepo is pushed and backed up
   - Keep a local copy before separation

2. **Force Push Warning:**
   - Using `--force` will overwrite existing repo
   - Make sure you want to replace existing content

3. **Environment Variables:**
   - Backend: Update `FRONTEND_URL` after frontend deployment
   - Frontend: Update `REACT_APP_API_URL` after backend deployment

4. **Documentation:**
   - Backend repo gets deployment docs
   - Frontend repo gets user-facing docs
   - Keep README files updated

---

## 📋 Checklist

### Before Separation:
- [ ] Commit all changes in monorepo
- [ ] Backup monorepo
- [ ] Verify both remotes are correct
- [ ] Test both backend and frontend locally

### During Separation:
- [ ] Copy backend files to new location
- [ ] Initialize backend git repo
- [ ] Push backend to jsilmaro/capsort_front_back
- [ ] Update frontend repo
- [ ] Push frontend to mmxlvsu/Capsort

### After Separation:
- [ ] Clone both repos to verify
- [ ] Test backend independently
- [ ] Test frontend independently
- [ ] Update environment variables
- [ ] Update documentation links
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel

---

## 🎯 Quick Commands Summary

```bash
# Backend separation
cd ..
mkdir capsort-backend
cd capsort-backend
cp -r ../CAPSORT_FRONT_BACK/backend/* .
cp ../CAPSORT_FRONT_BACK/RENDER-*.md .
git init
git add .
git commit -m "Backend only"
git remote add origin https://github.com/jsilmaro/capsort_front_back.git
git push -u origin main --force

# Frontend update
cd ../CAPSORT_FRONT_BACK/frontend
git add .
git commit -m "Update frontend"
git push origin main
```

---

**Ready to separate!** Choose your preferred method and follow the steps above.
