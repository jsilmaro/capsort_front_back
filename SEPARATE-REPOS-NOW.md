# 🚀 Separate Repositories - Quick Guide

## Goal:
- **Backend only** → https://github.com/jsilmaro/capsort_front_back.git
- **Frontend only** → https://github.com/mmxlvsu/Capsort.git

---

## ⚡ Quick Method (Recommended)

### Run the PowerShell Script:

```powershell
# In root directory (CAPSORT_FRONT_BACK)
.\separate-repos.ps1
```

The script will:
1. ✅ Commit current changes
2. ✅ Create backend-only copy
3. ✅ Push backend to jsilmaro/capsort_front_back
4. ✅ Update and push frontend to mmxlvsu/Capsort

---

## 📝 Manual Method (If script doesn't work)

### Step 1: Commit Everything First

```bash
git add .
git commit -m "Prepare for repository separation"
git push origin main
```

### Step 2: Separate Backend

```bash
# Go up one directory
cd ..

# Create new folder for backend only
mkdir capsort-backend-only
cd capsort-backend-only

# Copy backend files
cp -r ../CAPSORT_FRONT_BACK/backend/* .

# Copy deployment docs
cp ../CAPSORT_FRONT_BACK/RENDER-DEPLOYMENT-GUIDE.md .
cp ../CAPSORT_FRONT_BACK/RENDER-QUICK-START.md .
cp ../CAPSORT_FRONT_BACK/BACKEND-RENDER-READY.md .
```

### Step 3: Create Backend README

```bash
# Create README.md
cat > README.md << 'EOF'
# Capsort Backend API

Backend API for Capsort - Capstone Collection Platform

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📦 Deployment

Ready for Render deployment.

See [RENDER-DEPLOYMENT-GUIDE.md](RENDER-DEPLOYMENT-GUIDE.md)

## 🔗 Frontend Repository

https://github.com/mmxlvsu/Capsort
EOF
```

### Step 4: Push Backend

```bash
# Initialize git
git init
git add .
git commit -m "Backend only - ready for Render deployment"
git branch -M main

# Add remote and push
git remote add origin https://github.com/jsilmaro/capsort_front_back.git
git push -u origin main --force
```

### Step 5: Update Frontend

```bash
# Go to frontend directory
cd ../CAPSORT_FRONT_BACK/frontend

# Commit and push
git add .
git commit -m "Update frontend - Task 3 complete"
git push origin main
```

---

## ✅ Verify Separation

### Check Backend Repo:
```bash
git clone https://github.com/jsilmaro/capsort_front_back.git
cd capsort_front_back
ls
# Should see: src/, prisma/, package.json, etc.
# Should NOT see: frontend/
```

### Check Frontend Repo:
```bash
git clone https://github.com/mmxlvsu/Capsort.git
cd Capsort
ls
# Should see: src/, public/, package.json, etc.
# Should NOT see: backend/
```

---

## 🎯 What Each Repo Will Contain

### Backend Repo (jsilmaro/capsort_front_back):
```
✅ src/
✅ prisma/
✅ scripts/
✅ tests/
✅ package.json
✅ .env.example
✅ render.yaml
✅ build.sh
✅ README.md
✅ RENDER-DEPLOYMENT-GUIDE.md
✅ RENDER-QUICK-START.md
✅ BACKEND-RENDER-READY.md
❌ frontend/ (removed)
```

### Frontend Repo (mmxlvsu/Capsort):
```
✅ src/
✅ public/
✅ package.json
✅ .env
✅ .env.example
✅ README.md
❌ backend/ (never had it)
```

---

## 🔄 After Separation

### For Backend Changes:
```bash
# Clone backend repo
git clone https://github.com/jsilmaro/capsort_front_back.git
cd capsort_front_back

# Make changes
# ...

# Commit and push
git add .
git commit -m "Update backend"
git push origin main
```

### For Frontend Changes:
```bash
# Clone frontend repo
git clone https://github.com/mmxlvsu/Capsort.git
cd Capsort

# Make changes
# ...

# Commit and push
git add .
git commit -m "Update frontend"
git push origin main
```

---

## 🚨 Important Notes

1. **Backup First:**
   - Your current monorepo is already pushed
   - You can always go back to it if needed

2. **Force Push:**
   - Backend push uses `--force` to overwrite existing content
   - Make sure you want to replace what's there

3. **Environment Variables:**
   - After deployment, update:
     - Backend: `FRONTEND_URL` with deployed frontend URL
     - Frontend: `REACT_APP_API_URL` with deployed backend URL

---

## 📋 Quick Checklist

- [ ] Run `separate-repos.ps1` OR follow manual steps
- [ ] Verify backend repo has only backend files
- [ ] Verify frontend repo has only frontend files
- [ ] Clone both repos to test
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Update environment variables
- [ ] Test full application

---

## 🆘 Troubleshooting

### Script Won't Run?
```powershell
# Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run script
.\separate-repos.ps1
```

### Permission Denied?
- Make sure you're logged into GitHub
- Check you have write access to both repos
- Try using HTTPS instead of SSH

### Files Missing?
- Check you're in the right directory
- Verify files exist before copying
- Use `ls` or `dir` to list files

---

## ✅ Success!

After separation:
- ✅ Backend repo contains only backend code
- ✅ Frontend repo contains only frontend code
- ✅ Both repos are independent
- ✅ Ready for separate deployment

**Next:** Deploy backend to Render using `RENDER-QUICK-START.md`
