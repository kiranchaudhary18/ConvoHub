# 🚀 ConvoHub - Real-Time Chat Application

A modern, production-ready real-time chat application with beautiful UI, advanced features, and complete authentication system.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-white?logo=socket.io)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

## ✨ Key Features

- ✅ **Real-time messaging** with Socket.IO
- ✅ **One-to-one & Group chats**
- ✅ **JWT Authentication** with secure tokens
- ✅ **Image/File uploads** via Cloudinary
- ✅ **Message read receipts** & typing indicators
- ✅ **Online/Offline status** tracking
- ✅ **Email invitations** system
- ✅ **Dark/Light mode** support
- ✅ **Responsive design** for all devices
- ✅ **Admin controls** for groups

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14, React 18, Tailwind CSS, Framer Motion, Socket.IO Client, Zustand

### Backend
- Node.js, Express.js, MongoDB, Socket.IO, JWT, Nodemailer, Cloudinary

### Deployment
- Frontend: Vercel
- Backend: Render.com
- Database: MongoDB Atlas
- Storage: Cloudinary

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB account (Atlas)
- Cloudinary account
- Gmail account (for emails)

### Backend Setup

```bash
cd backend
npm install

# Create .env file with:
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/convohub
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=app_password
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=http://localhost:3000
INVITE_EXPIRY=24

npm run dev  # Start development server
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install

# Create .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

npm run dev  # Start development server
```

Frontend runs on `http://localhost:3000`

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Chats
- `GET /api/chats` - Get all chats
- `POST /api/chats/one-to-one` - Create one-to-one chat
- `POST /api/chats/group` - Create group chat

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:chatId` - Get messages
- `POST /api/messages/upload` - Upload file/image

---

## 🚢 Deployment

### Backend (Render.com)
1. Push to GitHub
2. Create Web Service on Render
3. Connect GitHub repo
4. Set environment variables
5. Deploy (auto-deploys on push)

### Frontend (Vercel)
1. Push to GitHub
2. Import project on Vercel
3. Set environment variables
4. Deploy (auto-deploys on push)

**Important**: Update `NEXT_PUBLIC_API_URL` and `FRONTEND_URL` to your deployed URLs after deployment.

---

## 📂 Project Structure

```
ConvoHub/
├── backend/
│   ├── server.js
│   ├── src/
│   │   ├── app.js
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── socket/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── stores/
│   └── package.json
```

---

## 🔐 Key Features Explained

### Real-Time Messaging
- Instant message delivery via Socket.IO
- Message delivery & read status
- Typing indicators

### File Uploads
- WhatsApp-style image preview
- Optional captions
- Cloudinary cloud storage
- Support for multiple file types

### Group Management
- Create/edit groups
- Invite members
- Admin controls
- Member list

### Authentication
- JWT-based tokens
- Password strength validation
- Email verification
- Secure session management

---

## 🧪 Testing Locally

**Test backend:**
```bash
curl -X GET http://localhost:5000/api/health
```

**Test chat endpoint:**
```bash
curl -X GET http://localhost:5000/api/chats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Update `FRONTEND_URL` in backend `.env` |
| Socket.IO not connecting | Check `NEXT_PUBLIC_SOCKET_URL` |
| Images not loading | Verify Cloudinary credentials |
| Email not sending | Generate Gmail app password (not regular password) |
| DB connection error | Check MongoDB URI and IP whitelist |

---

## 📚 Additional Resources

- [Full Documentation](./README_COMPLETE.md) - Comprehensive guide with all details
- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Socket.IO Docs](https://socket.io/docs/)

---

## 🙋 Support

For issues and questions, please open an issue on GitHub or contact the team.

---

**Made with ❤️ by ConvoHub Team** | Production Ready | February 2, 2026
│   │   │   ├── register/      # Signup page
│   │   │   └── chat/          # Chat pages
│   │   ├── components/        # React components
│   │   ├── stores/            # Zustand stores
│   │   ├── lib/               # Utilities & API
│   │   └── styles/            # Tailwind CSS
│   ├── .env.local             # Environment config
│   └── package.json
│
├── COMPLETE_SETUP.md          # Complete setup guide
├── setup.bat                  # Windows setup script
└── setup.sh                   # Linux/macOS setup script
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- MongoDB Atlas account (or local MongoDB)
- Gmail account (for email invitations)

### 1. Clone or Extract Files
```bash
# Files are already in d:\ConvoHub
cd d:\ConvoHub
```

### 2. Backend Setup

**Create `.env` file in `backend/` directory:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/convohub?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_64_character_random_secret_key_here
JWT_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL for invite links
FRONTEND_URL=http://localhost:3000

# Invite Token Expiry (in hours)
INVITE_EXPIRY=24
```

**Install & Run Backend:**
```bash
cd backend
npm install
npm run dev
```

✅ Backend running on `http://localhost:5000`

### 3. Frontend Setup

**`.env.local` is already configured** (no changes needed)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

**Install & Run Frontend:**
```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running on `http://localhost:3000`

### 4. Open in Browser
- Visit `http://localhost:3000`
- Sign up with name, email, password
- Start chatting!

---

## 🔐 Authentication

### JWT Tokens
- Tokens expire in **7 days**
- Automatically sent with API requests
- Auto-refresh in Zustand store
- Auto-logout if expired

### Password Security
- Hashed with **bcrypt** (10 rounds)
- Never stored as plain text
- Validated on signup/login

---

## 💬 Features

### Chat Features
- **One-to-One Messaging** - Direct chats with users
- **Group Chats** - Create groups and manage members
- **Real-time Updates** - Messages arrive instantly
- **Read Receipts** - Single (✓) and double (✓✓) checks
- **Typing Indicators** - See when others are typing
- **Online Status** - Real-time presence detection
- **Message Timestamps** - Auto-formatted time display

### Group Management
- **Create Groups** - Give group a name
- **Add Members** - Multi-select user search
- **Remove Members** - Manage group composition
- **Admin Features** - Control group settings

### Email Invitations
- **Send Invites** - Invite friends via email
- **Secure Tokens** - Time-limited invite links (24h)
- **Pre-filled Signup** - Invited users auto-join chat
- **Nodemailer Integration** - Gmail or custom SMTP

### User Discovery
- **User Search** - Find users by name
- **User List** - Browse all active users
- **Online Indicators** - See who's available
- **Start Chats** - Quick chat initiation

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Chats
- `GET /api/chats` - Get all chats
- `POST /api/chats/one-to-one` - Create 1-to-1 chat
- `POST /api/chats/group` - Create group chat
- `PUT /api/chats/:id/add-member` - Add member
- `PUT /api/chats/:id/remove-member` - Remove member

### Messages
- `GET /api/messages/:chatId` - Get messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/mark-seen` - Mark as seen
- `PUT /api/messages/chat/:id/mark-all-seen` - Mark all as seen

### Users
- `GET /api/users` - Get all users
- `GET /api/users/profile` - Get current user
- `PUT /api/users/lastseen` - Update last seen
- `PUT /api/users/online-status` - Update status

### Invitations
- `POST /api/invites/send` - Send invitation
- `GET /api/invites/verify/:token` - Verify token
- `POST /api/invites/use/:token` - Use invite

---

## 🔌 Socket.IO Events

### Client → Server
```javascript
// Send message
socket.emit('send-message', { chatId, message })

// User typing
socket.emit('typing', { chatId })

// Mark as seen
socket.emit('mark-as-seen', { messageId })

// Online status
socket.emit('online')
socket.emit('offline')
```

### Server → Client
```javascript
// Message received
socket.on('message-received', (message) => { })

// User typing
socket.on('user-typing', (userId) => { })

// Message seen
socket.on('message-seen', (messageId) => { })

// User online
socket.on('user-online', (userId) => { })

// User offline
socket.on('user-offline', (userId) => { })
```

---

## 🎨 Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| **Next.js 14** | React framework with App Router |
| **React 18** | UI library |
| **Tailwind CSS** | Utility-first CSS framework |
| **Zustand** | State management (auth, chat, users) |
| **Axios** | HTTP client with interceptors |
| **Socket.IO** | Real-time communication |
| **Framer Motion** | Smooth animations |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |

### Backend
| Tech | Purpose |
|------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **Socket.IO** | Real-time events |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Nodemailer** | Email service |
| **dotenv** | Environment variables |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **MongoDB Atlas** | Cloud database |
| **Gmail/SMTP** | Email notifications |
| **Localhost** | Development server |

---

## 🧪 Testing

### Test Signup
1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Enter name, email, password
4. Click "Sign Up"
5. Auto-redirect to chat

### Test Login
1. Enter email and password
2. Click "Log In"
3. Get redirected to chat page
4. See list of users

### Test Messaging
1. Open two browser windows
2. Log in as different users
3. In Window 1: Select a user from sidebar
4. In Window 2: Do the same
5. Send messages - appear instantly!

### Test Groups
1. Click "New Group" in sidebar
2. Enter group name
3. Select users to add
4. Click "Create"
5. Start group conversation

### Test Invitations
1. Use the invite modal
2. Enter friend's email
3. They receive email with link
4. Click link to join chat

---

## 📝 Environment Variables

### Backend (.env)
```env
# Required
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
EMAIL_USER=gmail@gmail.com
EMAIL_PASS=app_password

# Optional
PORT=5000  # Default: 5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
INVITE_EXPIRY=24  # Hours
```

### Frontend (.env.local)
```env
# Required (already set)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build  # If using TypeScript
git push heroku main
```

Update environment variables on deployment platform:
- `MONGODB_URI` - Use production MongoDB URL
- `FRONTEND_URL` - Use production frontend URL
- `EMAIL_PASS` - Use app-specific password
- `JWT_SECRET` - Use secure random key

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check `MONGODB_URI` in `.env`
- Verify IP whitelist in MongoDB Atlas
- Ensure MongoDB Atlas cluster is running

### "Cannot send emails"
- Verify Gmail App Password (not regular password)
- Check `EMAIL_USER` and `EMAIL_PASS` are correct
- Ensure Gmail 2FA is enabled for app password

### "Messages not sending"
- Check backend is running on port 5000
- Verify frontend can reach API (`http://localhost:5000/api`)
- Check browser Network tab for errors
- Look for error messages in backend console

### "Socket.IO not connecting"
- Verify both frontend & backend are running
- Check `NEXT_PUBLIC_SOCKET_URL` in `.env.local`
- Check browser DevTools Network tab for WebSocket
- Verify JWT token is being sent with auth

### "Stuck at login"
- Clear browser cache & cookies
- Delete `node_modules` and reinstall: `npm install`
- Restart both frontend and backend
- Check browser console for JavaScript errors

---

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Complete Setup Guide](./COMPLETE_SETUP.md)
- [API Testing Guide](./backend/API_TESTING.md)

---

## 🎯 Roadmap

### Implemented ✅
- ✅ Authentication (signup/login)
- ✅ One-to-one messaging
- ✅ Group chats
- ✅ Real-time updates
- ✅ Online status
- ✅ Read receipts
- ✅ Email invitations
- ✅ Dark mode
- ✅ Responsive design

### Planned 🔜
- [ ] File/Image uploads
- [ ] Video/Audio calls
- [ ] Message search
- [ ] Chat notifications
- [ ] User profiles
- [ ] Message reactions
- [ ] Archived chats
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Mobile app

---

## 💡 Pro Tips

1. **Dark Mode** - Toggle with Moon/Sun icon
2. **Keyboard Shortcut** - Press Enter to send messages
3. **Mentions** - Prefix message with @ for notifications
4. **Search** - Use sidebar search to find users
5. **Groups** - Create groups for team discussions
6. **Invites** - Send email invites for easy onboarding

---

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

---

## 👤 Author

Built with ❤️ as a premium chat application.

---

## 🤝 Support

### Need Help?

1. **Check Documentation**
   - Read COMPLETE_SETUP.md
   - Check backend/API_TESTING.md

2. **Debug**
   - Check browser console (F12)
   - Check backend console logs
   - Verify .env variables

3. **Verify Setup**
   - Backend running? `npm run dev`
   - Frontend running? `npm run dev`
   - Can access `http://localhost:3000`?

4. **Common Issues**
   - Clear browser cache
   - Restart servers
   - Reinstall dependencies

---

## 🎉 Ready to Go!

Your ConvoHub application is now complete!

### Current Status
- ✅ Backend: `http://localhost:5000` (Running)
- ✅ Frontend: `http://localhost:3000` (Running)
- ✅ Database: MongoDB Atlas (Connected)
- ✅ Email: Gmail (Configured)
- ✅ Socket.IO: Ready (Real-time)

### Next Steps
1. Open `http://localhost:3000`
2. Sign up with your email
3. Start chatting!

---

**Enjoy ConvoHub! 🚀**
#   C o n v o H u b 
 
 