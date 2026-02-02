# 🚀 ConvoHub Deployment Guide

Complete step-by-step guide to deploy ConvoHub to production.

---

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account with repository
- ✅ Vercel account (for frontend)
- ✅ Render.com account (for backend)
- ✅ MongoDB Atlas account
- ✅ Cloudinary account
- ✅ Gmail account with 2FA enabled

---

## 📝 Step 1: Prepare Your Code

### 1.1 Update Environment Variables

#### Backend `.env` (Local for reference)
```dotenv
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/convohub
JWT_SECRET=your_very_secure_secret_key_here
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://your-frontend-url.vercel.app
INVITE_EXPIRY=24
```

#### Frontend `.env.production`
```dotenv
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.onrender.com
```

### 1.2 Verify Files
```bash
# Backend
backend/
  ├── vercel.json     ✅ Should exist
  ├── server.js       ✅ Should exist
  ├── .env            ❌ Don't commit this
  └── package.json    ✅ Should exist

# Frontend
frontend/
  ├── .env.local      ❌ Don't commit this
  ├── .env.production ✅ Should exist
  ├── next.config.js  ✅ Should have distDir: 'dist'
  └── package.json    ✅ Should exist
```

### 1.3 Push to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

---

## 🔧 Step 2: Deploy Backend (Render.com)

### 2.1 Create MongoDB Database

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign in or create account
3. Create a cluster
4. Click "Connect" → "Drivers"
5. Copy connection string: `mongodb+srv://user:password@cluster.mongodb.net/myapp`
6. Create database name: `convohub`
7. Create user for database
8. Copy full URI: `mongodb+srv://dbuser:dbpass@cluster.mongodb.net/convohub?retryWrites=true&w=majority`

### 2.2 Create Render.com Service

1. Go to https://render.com
2. Sign in / Create account
3. Click "New +" → "Web Service"
4. Click "Connect" next to your GitHub repo
5. Select your ConvoHub repository
6. Fill in details:
   - **Name**: `convohub-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free or Paid (Free tier has limitations)

### 2.3 Add Environment Variables

In Render dashboard:
1. Go to your service → Settings → Environment
2. Add all variables:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/convohub
JWT_SECRET=your_secure_key
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=https://your-vercel-app.vercel.app
INVITE_EXPIRY=24
NODE_ENV=production
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (5-10 minutes)
3. Get your backend URL from Render dashboard
4. Save it: `https://your-backend.onrender.com`

---

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Update Frontend Environment

Update `frontend/.env.production`:
```dotenv
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
```

Push changes:
```bash
git add frontend/.env.production
git commit -m "Update production API URLs"
git push origin main
```

### 3.2 Create Vercel Project

1. Go to https://vercel.com
2. Sign in / Create account
3. Click "Add New" → "Project"
4. Select your ConvoHub GitHub repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Add Environment Variables

In Vercel:
1. Go to Project Settings → Environment Variables
2. Add variables:

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
```

### 3.4 Deploy

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Get your frontend URL from Vercel
4. Save it: `https://your-app.vercel.app`

---

## 🔄 Step 4: Update Backend FRONTEND_URL

Now that you have your frontend URL, update backend:

### 4.1 Update Environment Variable

In Render dashboard:
1. Go to backend service → Environment
2. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Click "Save"

### 4.2 Redeploy Backend

1. Go to "Deploys" tab
2. Click "Redeploy" on latest deployment
3. Wait for deployment to complete

---

## ✅ Step 5: Verification

### 5.1 Test Backend

```bash
# Test health check
curl https://your-backend.onrender.com/api/health

# Should respond:
# {"success":true,"message":"ConvoHub backend is running",...}
```

### 5.2 Test Frontend

1. Go to `https://your-app.vercel.app`
2. Page should load (check console for errors)

### 5.3 Test Registration

1. Click "Register"
2. Fill in form
3. Submit
4. Should see success message
5. Check browser console (F12) for any errors

### 5.4 Test Login

1. Click "Login"
2. Use registered credentials
3. Should redirect to chat page

### 5.5 Test Chat

1. Login with two different accounts
2. Create a chat between them
3. Send messages
4. Messages should appear in real-time

### 5.6 Test File Upload

1. In chat, click attachment icon
2. Select image
3. Add caption
4. Click "Send"
5. Image should appear in chat

---

## 🔐 Step 6: Security Checklist

- ✅ `CLOUDINARY_API_SECRET` is not exposed
- ✅ `JWT_SECRET` is long and random
- ✅ `.env` files are in `.gitignore`
- ✅ MongoDB username/password are secure
- ✅ Email password is app password (not actual password)
- ✅ CORS allows only your frontend URL
- ✅ API requires authentication tokens
- ✅ Sensitive endpoints are protected

---

## 🐛 Troubleshooting

### Frontend Shows Blank Page

**Check console** (Press F12):
```
CORS error, API URL error, or Socket.IO error
```

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Verify backend is running
3. Check Render logs for errors

### Login/Register Fails

**Error**: "Cannot connect to API"

**Solution**:
1. Check backend is deployed and running
2. Verify `FRONTEND_URL` in backend `.env`
3. Check CORS is configured correctly
4. Verify API URL is accessible

### Messages Don't Send

**Error**: "Cannot send message"

**Solution**:
1. Check Socket.IO connection
2. Verify `NEXT_PUBLIC_SOCKET_URL` is correct
3. Check backend logs for errors
4. Verify authentication token is valid

### Images Not Uploading

**Error**: "Cloudinary upload failed"

**Solution**:
1. Verify Cloudinary credentials
2. Check file size limit
3. Verify file type is allowed
4. Check Cloudinary account is active

### MongoDB Connection Error

**Error**: "Cannot connect to database"

**Solution**:
1. Verify MongoDB URI is correct
2. Check IP whitelist in MongoDB Atlas (allow all: 0.0.0.0/0)
3. Verify database user has correct permissions
4. Check database name is correct

### Emails Not Sending

**Error**: "Failed to send email"

**Solution**:
1. Gmail requires app password, not regular password
2. Enable 2FA on Gmail account
3. Generate app password: https://myaccount.google.com/apppasswords
4. Use generated password in `EMAIL_PASS`

---

## 📊 Production Monitoring

### Monitor Backend (Render)

1. Go to Render dashboard
2. Select your service
3. View "Logs" tab
4. Check for errors and warnings

### Monitor Frontend (Vercel)

1. Go to Vercel dashboard
2. Select your project
3. View "Logs" → "Build" and "Runtime"
4. Check for build or runtime errors

### Monitor Database (MongoDB)

1. Go to MongoDB Atlas
2. Click your cluster
3. View "Monitoring" tab
4. Check connection count, operations, etc.

---

## 🔄 Continuous Deployment

### Auto-Deploy on Push

Both Vercel and Render automatically deploy when you push to main branch:

```bash
# Make changes
git add .
git commit -m "Fix bug or add feature"
git push origin main

# Both frontend and backend will auto-deploy!
```

---

## 🆘 Emergency Rollback

If something breaks in production:

### Render Backend Rollback

1. Go to your Render service
2. Click "Deploys" tab
3. Find previous working deployment
4. Click the three dots menu
5. Select "Redeploy"

### Vercel Frontend Rollback

1. Go to your Vercel project
2. Click "Deployments" tab
3. Find previous working deployment
4. Click "Restore"

---

## 📈 Scaling Recommendations

### When Your App Gets Popular

**Backend**:
- Render Free tier has limitations (500 hours/month)
- Upgrade to Starter plan ($7/month) for continuous running
- Consider MongoDB paid tier for better performance

**Frontend**:
- Vercel is usually sufficient on free tier
- Monitor bandwidth usage
- Consider edge functions for optimization

**Database**:
- MongoDB Atlas free tier limited to 512MB
- Upgrade to shared tier ($57/year) for production
- Enable backups for data protection

---

## 📞 Support Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Deployment Complete! 🎉**

Your ConvoHub app is now live and ready for users!
