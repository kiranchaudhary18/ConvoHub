# 🚀 ConvoHub - Real-Time Chat Application

A modern, production-ready real-time chat application with beautiful UI, advanced features, and complete authentication system.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-white?logo=socket.io)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

---

## ✨ Features

### 📱 Core Chat Features
- **Real-time messaging** - Instant message delivery via Socket.IO
- **One-to-one & Group chats** - Create direct messages or group conversations
- **Message status** - See message delivery and read receipts
- **Typing indicators** - Know when someone is typing
- **Message reactions & editing** - Edit and delete messages
- **Online/Offline status** - See who's online in real-time

### 🔐 Authentication & Security
- **JWT-based authentication** - Secure token-based login
- **Email verification** - Verify email addresses
- **Password strength indicator** - Real-time password validation
- **Email invitations** - Invite users with custom links
- **Role-based access** - Admin functionality for groups

### 🎨 User Interface
- **Dark/Light mode** - System-aware theme switching
- **Responsive design** - Works on mobile, tablet, and desktop
- **Smooth animations** - Framer Motion for engaging UX
- **Avatar generation** - Random color avatars for users
- **Message search** - Find messages in conversations

### 📁 File Sharing
- **Image uploads** - Share images with preview
- **Document sharing** - Support for PDF, Word, Excel, etc.
- **Cloudinary integration** - Secure cloud storage
- **Image captions** - WhatsApp-style captions on images

### 🌐 Group Features
- **Create groups** - Initialize group conversations
- **Invite members** - Add users to groups
- **Admin controls** - Group admins can manage members
- **Group info** - View and edit group details
- **Member list** - See all group participants

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4
- **Database**: MongoDB 7
- **Real-time**: Socket.IO 4
- **Authentication**: JWT
- **Email**: Nodemailer
- **File Storage**: Cloudinary
- **Validation**: Express Validator

### DevOps & Deployment
- **Frontend**: Vercel
- **Backend**: Render.com
- **Database**: MongoDB Atlas
- **Email**: Gmail SMTP
- **Cloud Storage**: Cloudinary

---

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **MongoDB** account (MongoDB Atlas recommended)
- **Cloudinary** account for image hosting
- **Gmail account** for email service
- **Git** for version control

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/ConvoHub.git
cd ConvoHub
```

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
```

**Backend `.env` Configuration:**
```dotenv
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/convohub

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email (Gmail SMTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary (Image Hosting)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
INVITE_EXPIRY=24
```

**Start Backend Server:**
```bash
npm run dev    # Development mode
npm start      # Production mode
```

Server runs on `http://localhost:5000`

---

### 2️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
```

**Frontend `.env.local` Configuration (Development):**
```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

**Frontend `.env.production` Configuration (Production):**
```dotenv
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
```

**Start Frontend Development Server:**
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 📦 Installation & Setup Guide

### Detailed Setup Steps

#### Backend Requirements
1. **MongoDB Atlas Setup**
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create a cluster
   - Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

2. **Gmail SMTP Setup**
   - Enable 2-Factor Authentication on Gmail
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Use as `EMAIL_PASS` in `.env`

3. **Cloudinary Setup**
   - Sign up at https://cloudinary.com
   - Get API credentials from dashboard
   - Set folder: `convohub/messages` for organization

#### Frontend Configuration
- Update API URLs after backend deployment
- Configure environment variables for production
- Test Socket.IO connection

---

## 🗂️ Project Structure

```
ConvoHub/
├── backend/
│   ├── server.js                  # Entry point
│   ├── package.json               # Dependencies
│   ├── .env                       # Configuration (local)
│   ├── vercel.json               # Vercel deployment config
│   └── src/
│       ├── app.js                # Express setup & CORS
│       ├── config/
│       │   ├── db.js             # MongoDB connection
│       │   └── mail.js           # Nodemailer config
│       ├── models/               # Database schemas
│       │   ├── User.js
│       │   ├── Chat.js
│       │   ├── Message.js
│       │   └── Invite.js
│       ├── controllers/          # Business logic
│       │   ├── authController.js
│       │   ├── chatController.js
│       │   ├── messageController.js
│       │   └── userController.js
│       ├── routes/               # API endpoints
│       │   └── (route files)
│       ├── middleware/
│       │   └── authMiddleware.js
│       ├── socket/
│       │   └── socket.js         # Socket.IO handlers
│       └── utils/
│           └── cleanup.js        # Auto-delete old chats
│
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── .env.local                # Local development env
│   ├── .env.production           # Production env
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── app/
│       │   ├── layout.jsx        # Root layout
│       │   ├── page.jsx          # Home page
│       │   ├── login/
│       │   ├── register/
│       │   └── chat/
│       ├── components/
│       │   └── chat/
│       │       ├── ChatWindow.jsx
│       │       ├── ChatList.jsx
│       │       ├── MessageList.jsx
│       │       ├── MessageInput.jsx
│       │       ├── UsersList.jsx
│       │       └── Sidebar.jsx
│       ├── stores/               # Zustand state management
│       │   ├── authStore.js
│       │   ├── chatStore.js
│       │   ├── userStore.js
│       │   └── uiStore.js
│       ├── lib/
│       │   ├── api.js            # Axios instance
│       │   ├── socket.js         # Socket.IO instance
│       │   └── utils.js          # Helper functions
│       └── styles/
│           └── globals.css

```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/search/:query` - Search users

### Chats
- `GET /api/chats` - Get all user chats
- `POST /api/chats/one-to-one` - Create/get one-to-one chat
- `POST /api/chats/group` - Create group chat
- `PUT /api/chats/:id/add-member` - Add member to group
- `DELETE /api/chats/:id` - Delete chat

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:chatId` - Get chat messages
- `POST /api/messages/upload` - Upload file/image
- `PUT /api/messages/:id/edit` - Edit message
- `DELETE /api/messages/:id` - Delete message
- `PUT /api/messages/:id/mark-seen` - Mark as read

### Invites
- `POST /api/invites/send` - Send invite
- `GET /api/invites/verify/:token` - Verify invite
- `POST /api/invites/accept/:token` - Accept invite

---

## 🚢 Deployment

### Backend Deployment (Render.com)

1. **Push code to GitHub**
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

2. **Create Render.com Service**
   - Go to https://render.com
   - Connect GitHub account
   - Create New → Web Service
   - Select your repository
   - Set Build Command: `npm install`
   - Set Start Command: `npm start`

3. **Set Environment Variables in Render**
   - Go to Service Settings → Environment
   - Add all variables from `.env`
   - Update `FRONTEND_URL` to your deployed frontend URL

4. **Deploy**
   - Click Deploy
   - Wait for build to complete

### Frontend Deployment (Vercel)

1. **Push code to GitHub**
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

2. **Create Vercel Project**
   - Go to https://vercel.com
   - Click "Add New..." → Project
   - Import your GitHub repository
   - Framework: Next.js

3. **Set Environment Variables**
   - Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` = your backend URL
   - Add `NEXT_PUBLIC_SOCKET_URL` = your backend URL

4. **Deploy**
   - Vercel auto-deploys on push
   - Check deployment status in dashboard

---

## 🔒 Environment Variables Reference

### Backend `.env`
| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `NODE_ENV` | production | Environment mode |
| `MONGODB_URI` | mongodb+srv://... | MongoDB connection |
| `JWT_SECRET` | your_secret_key | JWT signing key |
| `JWT_EXPIRE` | 7d | Token expiration |
| `EMAIL_SERVICE` | gmail | Email provider |
| `EMAIL_USER` | your_email@gmail.com | Email account |
| `EMAIL_PASS` | app_password | Gmail app password |
| `CLOUDINARY_CLOUD_NAME` | your_cloud | Cloudinary name |
| `CLOUDINARY_API_KEY` | your_key | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | your_secret | Cloudinary secret |
| `FRONTEND_URL` | https://app.com | Frontend URL |
| `INVITE_EXPIRY` | 24 | Invite expiry hours |

### Frontend `.env.local` (Development)
| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | http://localhost:5000/api |
| `NEXT_PUBLIC_SOCKET_URL` | http://localhost:5000 |

### Frontend `.env.production` (Production)
| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | https://backend-url.com/api |
| `NEXT_PUBLIC_SOCKET_URL` | https://backend-url.com |

---

## 💡 Key Features Explained

### Real-Time Messaging
- Messages sent via REST API with WebSocket fallback
- Socket.IO for instant delivery
- Message status: sending → delivered → read

### File Uploads
1. User selects image/file
2. Shows preview (for images)
3. User adds optional caption
4. File uploads to Cloudinary
5. URL stored in MongoDB
6. Message displayed with file

### Group Chats
- Create groups with multiple members
- Admin controls for member management
- Group name and avatar
- Leave group functionality

### Authentication Flow
1. User registers with email & password
2. Password strength validated
3. JWT token issued on login
4. Token stored in localStorage
5. Included in all API requests
6. Auto-logout on token expiry

---

## 🧪 Testing

### Local Testing

**Test Authentication:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Test Messages:**
```bash
curl -X GET http://localhost:5000/api/chats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Socket.IO Testing
Use Socket.IO client to test real-time features:
```javascript
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
socket.emit('join-chat', chatId);
socket.on('new-message', (msg) => console.log(msg));
```

---

## 🐛 Common Issues & Solutions

### CORS Error
**Problem**: "Access to XMLHttpRequest blocked by CORS"
**Solution**: Update `FRONTEND_URL` in backend `.env` and redeploy

### Socket.IO Connection Failed
**Problem**: Real-time features not working
**Solution**: Check `NEXT_PUBLIC_SOCKET_URL` matches backend URL

### Images Not Loading
**Problem**: Uploaded images show 404
**Solution**: Verify Cloudinary credentials in `.env`

### Email Not Sending
**Problem**: "Failed to send email"
**Solution**: 
- Enable 2FA on Gmail
- Generate App Password
- Use app password, not actual Gmail password

### MongoDB Connection Error
**Problem**: "Could not connect to database"
**Solution**:
- Check MongoDB URI syntax
- Verify IP whitelist in MongoDB Atlas
- Ensure credentials are correct

---

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.IO Guide](https://socket.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 👨‍💻 Development Commands

### Backend
```bash
npm run dev      # Start with hot reload (nodemon)
npm start        # Start production
npm test         # Run tests
npm audit        # Check vulnerabilities
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Start production server
npm lint         # Run linter
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙋 Support

For support, email convohub@example.com or open an issue on GitHub.

---

## 🎉 Acknowledgments

- Socket.IO for real-time communication
- Cloudinary for cloud storage
- MongoDB for database
- Vercel and Render for hosting
- All contributors and users

---

**Made with ❤️ by ConvoHub Team**

*Last Updated: February 2, 2026*
