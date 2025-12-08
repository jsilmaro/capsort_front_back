# 🚀 Render Deployment - Quick Start

## ⚡ 5-Minute Deployment

### Step 1: Push to GitHub (1 min)
```bash
cd backend
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Account (1 min)
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render

### Step 3: Deploy Backend (3 min)

1. **Click "New +" → "Web Service"**

2. **Connect Repository:**
   - Select: `capsort_front_back`
   - Click "Connect"

3. **Configure:**
   ```
   Name: capsort-backend
   Region: Oregon
   Branch: main
   Root Directory: backend
   Environment: Node
   Build Command: npm install && npx prisma generate && npx prisma db push
   Start Command: npm start
   Plan: Free
   ```

4. **Environment Variables:**
   Click "Add Environment Variable" and add:
   
   ```
   NODE_ENV=production
   DATABASE_URL=your_neon_database_url_here
   DIRECT_URL=your_neon_database_url_here
   JWT_SECRET=generate_random_32_char_string
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3001
   CLIENT_URL=http://localhost:3001
   ```

5. **Click "Create Web Service"**

6. **Wait 5-10 minutes for deployment**

---

## 🔑 Get Your Database URL

### From Neon (Current Setup):
1. Go to https://console.neon.tech
2. Select your project
3. Click "Connection Details"
4. Copy "Connection string"
5. Paste as `DATABASE_URL` in Render

### Or Create New Render Database:
1. In Render: "New +" → "PostgreSQL"
2. Name: `capsort-db`
3. Create Database
4. Copy "External Database URL"
5. Use in `DATABASE_URL`

---

## 🔐 Generate JWT Secret

Run this command:
```bash
openssl rand -base64 32
```

Or use online generator:
https://generate-secret.vercel.app/32

Copy the result and use as `JWT_SECRET`

---

## ✅ Verify Deployment

### 1. Check Health:
```
https://your-app-name.onrender.com/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Capsort Backend API is running"
}
```

### 2. Test API:
```bash
curl https://your-app-name.onrender.com/api/projects
```

---

## 🎯 Update Frontend

After backend is deployed:

1. **Copy your backend URL:**
   ```
   https://capsort-backend.onrender.com
   ```

2. **Update frontend/.env:**
   ```env
   REACT_APP_API_URL=https://capsort-backend.onrender.com/api
   ```

3. **Redeploy frontend**

---

## 📋 Environment Variables Explained

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Sets production mode |
| `DATABASE_URL` | Your Neon URL | Database connection |
| `DIRECT_URL` | Your Neon URL | Direct database access |
| `JWT_SECRET` | Random 32+ chars | Secret for JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Token expiration time |
| `FRONTEND_URL` | Your frontend URL | For CORS |
| `CLIENT_URL` | Your frontend URL | For CORS |

---

## 🐛 Common Issues

### Build Fails?
- Check `DATABASE_URL` is correct
- Verify Prisma is in `dependencies` not `devDependencies`

### Can't Connect to Database?
- Ensure URL includes `?sslmode=require`
- Check database is running
- Verify credentials

### CORS Errors?
- Add frontend URL to `FRONTEND_URL` and `CLIENT_URL`
- Update after deploying frontend

### Slow First Request?
- Normal for free tier (cold start)
- Service sleeps after 15 min inactivity
- First request wakes it up (30-60 seconds)

---

## 🔄 Auto-Deploy

Render auto-deploys when you push to main:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render detects changes and redeploys automatically!

---

## 📝 Next Steps

After deployment:

1. ✅ Test all API endpoints
2. ✅ Create admin account
3. ✅ Update frontend API URL
4. ✅ Test full application
5. ✅ Set up monitoring

---

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **Render Support:** https://render.com/support
- **Check Logs:** Render Dashboard → Your Service → Logs

---

## 📊 Your URLs

After deployment, save these:

```
Backend: https://capsort-backend.onrender.com
Health: https://capsort-backend.onrender.com/health
API: https://capsort-backend.onrender.com/api
```

---

**That's it! Your backend is now live on Render!** 🎉

Total time: ~5-10 minutes
