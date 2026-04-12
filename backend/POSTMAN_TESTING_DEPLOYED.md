# Postman Testing Guide - Deployed Backend (Vercel)

## 🌐 Your Deployed Backend URL
**Base URL**: `https://YOUR-PROJECT-NAME.vercel.app`

> 👉 Apna actual Vercel URL Vercel Dashboard se check karein: https://vercel.com/dashboard

---

## 📧 EMAIL INVITE TESTING (Main Focus)

### **STEP 1: Register ek user**

**Method**: POST  
**URL**: `https://YOUR-PROJECT-NAME.vercel.app/api/auth/signup`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Response mein milega**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "abc123...",
    "name": "Test User",
    "email": "testuser@example.com"
  }
}
```

✅ **Token ko copy kar lein** - yeh next step mein use hoga!

---

### **STEP 2A: Create a Group Chat (invite ke liye)**

**Method**: POST  
**URL**: `https://YOUR-PROJECT-NAME.vercel.app/api/chats/group`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_FROM_STEP_1
```

**Body** (raw JSON):
```json
{
  "name": "Test Group",
  "memberIds": []
}
```

**Response**:
```json
{
  "success": true,
  "chat": {
    "_id": "65abc123...",
    "name": "Test Group",
    "isGroup": true
  }
}
```

✅ **Chat ID ko copy kar lein**

---

### **STEP 3: 📧 SEND EMAIL INVITE (Main Test)**

**Method**: POST  
**URL**: `https://YOUR-PROJECT-NAME.vercel.app/api/invites/send`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_FROM_STEP_1
```

**Body** (raw JSON):
```json
{
  "email": "kiranchaudhary1622@gmail.com",
  "chatId": "YOUR_CHAT_ID_FROM_STEP_2"
}
```

**Success Response**:
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "invite": {
    "_id": "xyz789...",
    "email": "kiranchaudhary1622@gmail.com",
    "token": "abc123def456...",
    "used": false,
    "expiresAt": "2026-02-18T..."
  }
}
```

### ⚠️ Agar Email Error Aaye:

**Error Response**:
```json
{
  "success": false,
  "message": "Failed to send invitation email"
}
```

**Solution**: 
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Check karo `EMAIL_USER` aur `EMAIL_PASS` sahi hain:
   - EMAIL_USER = `kiranchaudhary1622@gmail.com`
   - EMAIL_PASS = `nyxywffougraqccs` (spaces nahi!)
3. Redeploy karo

---

## 🔍 Additional Testing Routes

### **Health Check**
**GET** `https://YOUR-PROJECT-NAME.vercel.app/api/health`

---

### **Login**
**POST** `https://YOUR-PROJECT-NAME.vercel.app/api/auth/login`

**Body**:
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```

---

### **Verify Invite Token**
**GET** `https://YOUR-PROJECT-NAME.vercel.app/api/invites/verify/TOKEN_HERE`

Replace `TOKEN_HERE` with actual invite token from Step 3 response.

---

### **Get All Users**
**GET** `https://YOUR-PROJECT-NAME.vercel.app/api/users`

**Headers**:
```
Authorization: Bearer YOUR_TOKEN
```

---

### **Get My Chats**
**GET** `https://YOUR-PROJECT-NAME.vercel.app/api/chats`

**Headers**:
```
Authorization: Bearer YOUR_TOKEN
```

---

## 📝 Quick Steps Summary

1. ✅ **Signup** → Copy Token
2. ✅ **Create Group** → Copy Chat ID  
3. ✅ **Send Invite** → Email should arrive at `kiranchaudhary1622@gmail.com`
4. ✅ **Check Email** → Verify invite link received

---

## 🔗 Finding Your Vercel URL

1. Open: https://vercel.com/dashboard
2. Click on your backend project
3. Copy the URL shown at top (e.g., `https://convohub-backend.vercel.app`)
4. Replace `YOUR-PROJECT-NAME.vercel.app` with this URL in all above requests

---

## 🐛 Debugging

### Check Backend Logs:
1. Vercel Dashboard → Your Project
2. Click on latest deployment
3. Go to "Logs" or "Runtime Logs"
4. Search for email-related errors

### Common Issues:

**❌ 401 Unauthorized**
- Token galat hai ya expired hai
- User firse login karo aur naya token lelo

**❌ 404 Not Found**
- URL galat hai
- Route path check karo (trailing slashes nahi hone chahiye)

**❌ Email not sent**
- Environment variables check karo on Vercel
- Backend logs mein dekho kya error aa raha hai

---

## ✅ Success Criteria

Jab sab kuch sahi se kaam karega:

1. ✅ Step 1 successful → Token milega
2. ✅ Step 2 successful → Chat ID milega
3. ✅ Step 3 successful → Response mein `"success": true`
4. ✅ **Email arrive hoga** `kiranchaudhary1622@gmail.com` par with invite link
5. ✅ Invite link click karne par registration page open hoga with pre-filled token

---

**Happy Testing! 🚀**
