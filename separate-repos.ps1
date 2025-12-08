# PowerShell Script to Separate Repositories
# Run this from the root directory (CAPSORT_FRONT_BACK)

Write-Host "🔄 Starting repository separation..." -ForegroundColor Blue
Write-Host ""

# Step 1: Commit current changes
Write-Host "Step 1: Committing current changes to monorepo..." -ForegroundColor Cyan
git add .
git commit -m "Prepare for repository separation - backend ready for Render"
git push origin main

Write-Host "✅ Monorepo updated" -ForegroundColor Green
Write-Host ""

# Step 2: Prepare backend repository
Write-Host "Step 2: Preparing backend repository..." -ForegroundColor Cyan

# Create temp directory for backend
$backendTemp = "..\capsort-backend-temp"
if (Test-Path $backendTemp) {
    Write-Host "Removing existing temp directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $backendTemp
}

New-Item -ItemType Directory -Path $backendTemp | Out-Null
Write-Host "Created temp directory: $backendTemp" -ForegroundColor Gray

# Copy backend files
Write-Host "Copying backend files..." -ForegroundColor Gray
Copy-Item -Path "backend\*" -Destination $backendTemp -Recurse

# Copy deployment documentation
Copy-Item -Path "RENDER-DEPLOYMENT-GUIDE.md" -Destination $backendTemp
Copy-Item -Path "RENDER-QUICK-START.md" -Destination $backendTemp
Copy-Item -Path "BACKEND-RENDER-READY.md" -Destination $backendTemp

# Create backend README
$backendReadme = @"
# Capsort Backend API

Backend API for Capsort - Capstone Collection Platform

## 🚀 Quick Start

### Local Development:
``````bash
npm install
npm run dev
``````

### Environment Variables:
Copy `.env.example` to `.env` and fill in your values.

## 📦 Deployment

This backend is ready for deployment on Render.

See [RENDER-DEPLOYMENT-GUIDE.md](RENDER-DEPLOYMENT-GUIDE.md) for complete instructions.

Quick start: [RENDER-QUICK-START.md](RENDER-QUICK-START.md)

## 📚 Documentation

- [Render Deployment Guide](RENDER-DEPLOYMENT-GUIDE.md) - Complete deployment guide
- [Quick Start](RENDER-QUICK-START.md) - 5-minute deployment
- [Backend Ready](BACKEND-RENDER-READY.md) - Deployment checklist

## 🔗 Related Repositories

- **Frontend:** https://github.com/mmxlvsu/Capsort

## 🛠️ Tech Stack

- Node.js + Express
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- bcrypt for password hashing

## 📝 API Endpoints

See [BACKEND-API-REFERENCE.md](BACKEND-API-REFERENCE.md) for complete API documentation.

## 🔐 Security

- CORS protection
- Rate limiting
- Input sanitization
- JWT authentication
- Password hashing
- SQL injection protection

## 📊 Features

- User authentication (students and admins)
- Project management (CRUD)
- Saved projects functionality
- Password reset flow
- Admin analytics
- About page management

## 🤝 Contributing

This is the backend repository. For frontend contributions, see the frontend repo.

## 📄 License

MIT
"@

Set-Content -Path "$backendTemp\README.md" -Value $backendReadme

# Initialize git and push backend
Write-Host "Initializing backend git repository..." -ForegroundColor Gray
Set-Location $backendTemp
git init
git add .
git commit -m "Backend only - ready for Render deployment"
git branch -M main
git remote add origin https://github.com/jsilmaro/capsort_front_back.git

Write-Host ""
Write-Host "⚠️  About to push backend to: https://github.com/jsilmaro/capsort_front_back.git" -ForegroundColor Yellow
Write-Host "This will OVERWRITE the existing repository content." -ForegroundColor Yellow
$confirm = Read-Host "Continue? (yes/no)"

if ($confirm -eq "yes") {
    git push -u origin main --force
    Write-Host "✅ Backend pushed to jsilmaro/capsort_front_back" -ForegroundColor Green
} else {
    Write-Host "❌ Backend push cancelled" -ForegroundColor Red
}

# Return to original directory
Set-Location ..

Write-Host ""

# Step 3: Update frontend repository
Write-Host "Step 3: Updating frontend repository..." -ForegroundColor Cyan
Set-Location "CAPSORT_FRONT_BACK\frontend"

git add .
git commit -m "Update frontend - Task 3 complete, saved projects functionality"
git push origin main

Write-Host "✅ Frontend pushed to mmxlvsu/Capsort" -ForegroundColor Green

# Return to root
Set-Location ..\..

Write-Host ""
Write-Host "🎉 Repository separation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  Backend: https://github.com/jsilmaro/capsort_front_back" -ForegroundColor Gray
Write-Host "  Frontend: https://github.com/mmxlvsu/Capsort" -ForegroundColor Gray
Write-Host ""
Write-Host "🗑️  Temp directory created at: $backendTemp" -ForegroundColor Yellow
Write-Host "You can delete it after verifying the push was successful." -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Next steps:" -ForegroundColor Cyan
Write-Host "  1. Verify backend repo: git clone https://github.com/jsilmaro/capsort_front_back.git" -ForegroundColor Gray
Write-Host "  2. Verify frontend repo: git clone https://github.com/mmxlvsu/Capsort.git" -ForegroundColor Gray
Write-Host "  3. Deploy backend to Render (see RENDER-QUICK-START.md)" -ForegroundColor Gray
Write-Host "  4. Deploy frontend to Vercel" -ForegroundColor Gray
