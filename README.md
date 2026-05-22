# ConvoHub - Real-Time Chat Application


## Demo Video

[Watch Demo Video](https://www.youtube.com/watch?v=fxHiUyQCfhA&t=3s)

<div align="center">

![ConvoHub](https://img.shields.io/badge/ConvoHub-v1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A modern, scalable real-time chat platform built with cutting-edge technologies**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Setup](#-setup-guide) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

ConvoHub is a production-ready real-time chat application that enables seamless communication between users. With support for one-to-one and group messaging, advanced user status tracking, and a responsive UI, ConvoHub delivers a premium chat experience.

**Perfect for:**
- Internal team communication
- Customer support systems
- Community platforms
- Enterprise messaging solutions

---

## ✨ Key Features

### Core Messaging
- ✅ **Real-Time Messaging** - Instant message delivery using WebSocket (Socket.IO)
- ✅ **One-to-One Chats** - Private conversations between two users
- ✅ **Group Chats** - Collaborative group conversations with admin controls
- ✅ **Message Editing** - Edit sent messages
- ✅ **Message Deletion** - Delete for self or for everyone
- ✅ **Message Reactions** - React to messages with emojis
- ✅ **Message Pinning** - Pin important messages

### User Experience
- ✅ **User Status** - Real-time online/offline indicators
- ✅ **Last Seen** - Track when users were last active
- ✅ **Typing Indicators** - See when someone is typing
- ✅ **Read Receipts** - Delivery and read status
- ✅ **User Search** - Find users quickly

### Interface
- ✅ **Dark/Light Mode** - User-preferred theme
- ✅ **Responsive Design** - Works on desktop, tablet, mobile
- ✅ **Optimized Images** - Automatic image compression
- ✅ **Beautiful UI** - Modern gradient designs with Tailwind CSS
- ✅ **Smooth Animations** - Framer Motion transitions

### Security & Performance
- ✅ **JWT Authentication** - Secure user authentication
- ✅ **Password Hashing** - bcrypt encryption
- ✅ **Input Validation** - Server-side validation
- ✅ **Rate Limiting** - API protection
- ✅ **CORS Enabled** - Cross-origin resource sharing
- ✅ **SEO Optimized** - Meta tags and structured data

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework with SSR/SSG |
| **React 18** | UI library |
| **Tailwind CSS** | Utility-first CSS framework |
| **Zustand** | State management |
| **Socket.IO Client** | Real-time communication |
| **Framer Motion** | Animation library |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **Socket.IO** | Real-time WebSocket |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |
| **Cloudinary** | Image hosting |

### Deployment
| Platform | Component |
|----------|-----------|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **MongoDB Atlas** | Database hosting |

---

## 🏗️ System Architecture & Design Patterns

### Architecture Overview

ConvoHub follows a **distributed client-server architecture** with real-time WebSocket communication for optimal scalability and performance.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Next.js UI  │  │  Zustand     │  │  Socket.IO   │           │
│  │  React       │  │  Store       │  │  Client      │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                    ↓ (HTTP + WebSocket)
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                            │
│    CORS | Rate Limiting | Auth Middleware | Error Handler       │
└─────────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │Auth      │  │Chat      │  │Message   │  │Socket    │         │
│  │Service   │  │Service   │  │Service   │  │Handler   │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  MongoDB     │  │  Cloudinary  │  │  Session     │           │
│  │  Database    │  │  Image CDN   │  │  Store       │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

### Real-Time Message Flow Architecture

```
USER A          →    SERVER         →    USER B
(Sender)             (Processor)          (Recipient)
    │                    │                    │
    ├─ Type Message      │                    │
    │                    │                    │
    ├─ send-message      │                    │
    │  (WebSocket)       │                    │
    │                    ├─ Validate         │
    │                    │                    │
    │                    ├─ bcrypt sender    │
    │                    │                    │
    │                    ├─ Save to DB       │
    │                    │                    │
    │◄───────────────────┤ Confirm           │
    │ (sent status)      │ Delivery          │
    │                    │                    │
    │                    ├─ Convert to       │
    │                    │  Socket event     │
    │                    │                    │
    │                    ├─ Find recipient    │
    │                    │  in connected     │
    │                    │  sockets          │
    │                    │                    │
    │                    ├──────────────────►│
    │                    │ receive-message   │
    │                    │ (WebSocket)       │
    │                    │                    │
    │                    │              ┌────┤ Update UI
    │                    │              │    │
    │                    │              │    ├─ Mark as
    │                    │              │    │  delivered
    │                    │              │    │
    │                    │              │    ├─ Play sound
    │                    │              │    │
    │                    │              │    ├─ Show in
    │                    │              │    │  chat list
    │                    │              │    │
    │                    │◄─────────────┴────┤
    │                    │ read-receipt      │
    │                    │                    │
    │◄───────────────────┤ Update sender     │
    │ (read status)      │                    │
```

---

### State Management Pattern

#### Zustand Store Architecture
```javascript
// 4 Separate Stores for Separation of Concerns

1. authStore
   ├─ user (logged-in user)
   ├─ token (JWT)
   ├─ setAuth(user, token)
   └─ logout()

2. chatStore
   ├─ chats (all chats)
   ├─ activeChat (current chat ID)
   ├─ selectedUser (other user in 1-to-1 chat)
   ├─ messages (all messages by chatId)
   ├─ setChats(chats)
   ├─ setActiveChat(chatId)
   ├─ setSelectedUser(user)
   ├─ addMessage(chatId, message)
   └─ updateMessage(chatId, msgId, data)

3. userStore
   ├─ users (all users)
   ├─ setUsers(users)
   ├─ setUserOnline(userId)
   └─ setUserOffline(userId)

4. uiStore
   ├─ darkMode (theme)
   ├─ sidebarOpen (layout state)
   ├─ activeTab (current tab)
   ├─ toggleDarkMode()
   ├─ toggleSidebar()
   └─ setActiveTab(tab)
```

**Why This Pattern?**
- ✅ Single Responsibility Principle
- ✅ Easy to debug (store per concern)
- ✅ Scales well as app grows
- ✅ Each store only updates its domain

---

### Database Design Strategy

#### Schema Relationships
```
User ——→ Chat ←——— User
 │        ├─→ Message ←─┐
 │        │   (Sender: User)
 │        │
 │        └─→ Admin (User)
 │
 └─ isOnline Status
 └─ lastSeen Timestamp

Indexes Created:
├─ User: email (unique)
├─ Chat: members, updatedAt
├─ Message: chatId, createdAt
└─ TTL: Chat (30 days auto-delete)
```

#### Query Optimization
```javascript
// DON'T: Load entire user object
User.findById(userId)

// DO: Load only needed fields
User.findById(userId, 'name email avatar isOnline')

// DON'T: N+1 queries
chats.forEach(c => User.findById(c.admin))

// DO: Populate in single query
Chat.find().populate('members', 'name email')

// DON'T: No pagination
Message.find({ chatId })

// DO: Paginate results
Message.find({ chatId })
  .limit(20)
  .skip(page * 20)
  .sort({ createdAt: -1 })
```

---

### WebSocket Event-Driven Architecture

#### Socket Events Categorization
```
AUTHENTICATION EVENTS
├─ connection → Validate JWT
└─ disconnect → Clean up user session

MESSAGE EVENTS
├─ send-message → Validate, save, emit to room
├─ receive-message → Listener on recipient client
├─ message-edited → Update in DB and emit
├─ message-deleted → Mark as deleted and emit
└─ message-reacted → Update reactions

STATUS EVENTS
├─ user-online → Broadcast to all users
├─ user-offline → Broadcast to all users
├─ typing → Emit to current chat room only
└─ visited-chat → Mark chat as visited

GROUP EVENTS
├─ member-added → Notify group members
├─ member-removed → Notify group members
└─ group-deleted → Notify all members
```

---

### Authentication Flow

#### JWT Implementation
```
LOGIN REQUEST
    ↓
VALIDATE CREDENTIALS
    ├─ Find user by email
    ├─ Compare password (bcrypt.compare)
    └─ Abort if invalid
    ↓
GENERATE JWT
    ├─ Sign payload with secret
    ├─ Set expiration (24 hours)
    └─ Return token
    ↓
CLIENT STORES TOKEN
    ├─ localStorage (persistent)
    └─ Request Authorization header
    ↓
SUBSEQUENT REQUESTS
    ├─ Include token in header
    ├─ Server verifies token
    ├─ Decode and attach user to req.user
    └─ Process authenticated request
```

#### Middleware Flow
```
Request → CORS Check → Rate Limit → Auth Middleware
               ↓            ↓             ↓
           Pass if        Pass if      Verify JWT
           allowed        under         |
           origin         limit         ├─ Valid? Proceed
                                        ├─ Expired? Return 401
                                        └─ Invalid? Return 403
              ↓            ↓             ↓
          Route Handler ← ← ← ← ← ← ← ← ←
```

---

### Error Handling Architecture

#### Error Classification
```
CLIENT ERRORS (400-499)
├─ 400 Bad Request (Validation failed)
├─ 401 Unauthorized (No JWT)
├─ 403 Forbidden (Invalid JWT)
└─ 404 Not Found (Resource missing)

SERVER ERRORS (500-599)
├─ 500 Internal Error (Uncaught exception)
├─ 502 Bad Gateway (Service down)
└─ 503 Service Unavailable (Maintenance)

RESPONSE FORMAT:
{
  "success": false,
  "message": "User-friendly error message",
  "errors": {
    "field": "Specific validation error"
  },
  "statusCode": 400
}
```

---

### Scalability Strategy

#### Current Architecture (Single Server)
```
Suitable for: < 10K users
├─ Single Node.js process
├─ MongoDB single instance
├─ Works fine for MVP
└─ Cost-effective
```

#### Future Architecture (Horizontally Scaled)
```
Suitable for: 10K - 1M users
├─ Load Balancer
├─ Multiple Node.js instances
├─ Redis for session management
├─ Separate WebSocket servers
├─ Database replication
└─ CDN for static assets
```

#### Enterprise Architecture (Microservices)
```
Suitable for: 1M+ users
├─ Kubernetes orchestration
├─ Auth Service (separate)
├─ Chat Service (separate)
├─ Notification Service
├─ Analytics Service
├─ Message Queue (RabbitMQ)
├─ Distributed caching (Redis Cluster)
├─ Database sharding
└─ Multi-region deployment
```

---

### Performance Optimization Techniques

#### Frontend Optimizations
- **Code Splitting**: Dynamic imports for routes
- **Image Optimization**: Cloudinary automatic compression
- **Lazy Loading**: Components load on demand
- **Memoization**: React.memo for pure components
- **Debouncing**: Typing indicators debounced 300ms
- **Virtual Scrolling**: Render visible messages only

#### Backend Optimizations
- **Database Indexing**: Multi-field indexes for queries
- **Query Optimization**: Select only needed fields
- **Connection Pooling**: Reuse DB connections
- **Response Compression**: gzip all responses
- **Pagination**: Messages loaded in chunks
- **Caching**: Frequently accessed data cached

#### Monitoring Metrics
```
API Performance:
├─ Response times (target < 200ms)
├─ Error rates (target < 0.1%)
└─ Throughput (messages/second)

Database Performance:
├─ Query times (target < 50ms)
├─ Connection pool usage
└─ Disk I/O metrics

WebSocket Performance:
├─ Active user count
├─ Message delivery rate (target 99.9%)
└─ Connection drop rate (target < 1%)
```

---



## 🚀 Setup Guide

### Prerequisites
- **Node.js** v16+ & npm
- **MongoDB** (local or MongoDB Atlas)
- **Git** for version control
- **Code Editor** (VS Code recommended)

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file with required variables
cp .env.example .env
# Edit .env with your credentials

# 4. Start development server
npm run dev

# Backend will run on http://localhost:5000
```

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env.local file
cp .env.local.example .env.local
# Edit .env.local with API URL

# 4. Start development server
npm run dev

# Frontend will run on http://localhost:3000
```

### Verify Installation
```bash
# Open http://localhost:3000 in your browser
# You should see the ConvoHub login page
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/convohub

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this

# Email Service (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Image Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Optional: NextAuth, Analytics, etc
# Add other environment variables as needed
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chats` | Get all chats for user |
| POST | `/api/chats/one-to-one` | Create/get 1-to-1 chat |
| POST | `/api/chats/group` | Create group chat |
| GET | `/api/chats/:id/messages` | Get chat messages |
| POST | `/api/chats/:id/messages` | Send message |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update user profile |

### WebSocket Events

```javascript
// Emit Events (Client → Server)
socket.emit('join-chat', chatId)
socket.emit('send-message', { chatId, text, ... })
socket.emit('typing', { chatId, isTyping })

// Listen Events (Server → Client)
socket.on('receive-message', (message) => {})
socket.on('user-typing', (userName) => {})
socket.on('user-online', (userId) => {})
socket.on('user-offline', (userId) => {})
```

---

## 🎯 Features Explained

### Real-Time Messaging
- Messages are delivered instantly using WebSocket connections
- No page refresh needed - see messages as they arrive
- Works even with slow internet connections

### User Status Management
- **Online Status**: Updated when users connect/disconnect
- **Last Seen**: Tracked every 30 seconds
- **Typing Indicators**: Show real-time typing activity
- **Read Receipts**: Know when messages are read

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation on all inputs
- **Error Handling**: Proper error messages without exposing sensitive data

### Performance Optimization
- **Image Compression**: Automatic image resizing via Cloudinary
- **Lazy Loading**: Components and images load on demand
- **Pagination**: Messages load in chunks
- **Debouncing**: Optimized typing indicators
- **Caching**: Browser caching for assets

---

## 🔧 Development Workflow

### Available Commands

#### Backend
```bash
npm run dev      # Start development server with auto-reload
npm run build    # Build for production
npm start        # Start production server
npm test         # Run tests
```

#### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Start production server
npm lint         # Run ESLint
npm test         # Run tests
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/feature-name

# Create Pull Request for review
```

---

## 📦 Dependencies

### Key Frontend Libraries
- `next`: Latest Next.js framework
- `react`: React library
- `zustand`: Lightweight state management
- `socket.io-client`: Real-time communication client
- `framer-motion`: Animation library
- `tailwindcss`: Styling
- `axios`: HTTP client

### Key Backend Libraries
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `socket.io`: Real-time server
- `jsonwebtoken`: JWT authentication
- `bcrypt`: Password hashing
- `cloudinary`: Image hosting

---

## 🚢 Deployment

### Frontend Deployment (Vercel)
```bash
# 1. Push to GitHub
git push origin main

# 2. Connect repository to Vercel
# https://vercel.com/new

# 3. Set environment variables
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api

# 4. Deploy
# Automatic on push to main branch
```

### Backend Deployment (Render)
```bash
# 1. Create Render account
# https://render.com

# 2. Create new Web Service
# Connect your GitHub repository

# 3. Set environment variables
# MONGODB_URI, JWT_SECRET, etc.

# 4. Deploy
# Automatic on push to main branch
```

---

## 🧪 Testing

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# Run with coverage
npm test -- --coverage
```

---

## 🤝 Contributing

We welcome contributions from all developers!

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Standards

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Test your changes before submitting
- Update documentation as needed

### Reporting Bugs

If you find a bug:
1. Open an issue with clear description
2. Include steps to reproduce
3. Specify your environment
4. Attach screenshots if applicable

---

<div align="center">

**Made with ❤️ by Kiran Dekaliya**

</div>
