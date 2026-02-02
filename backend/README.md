# ConvoHub Backend

A production-ready real-time chat backend built with Node.js, Express, MongoDB, and Socket.IO.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based signup and login with bcrypt password hashing
- **Real-time Messaging**: Send and receive messages instantly using Socket.IO
- **One-to-One Chats**: Direct messaging between users
- **Group Chats**: Create and manage group conversations with admin controls
- **Message Status**: Track message read receipts with "seen by" functionality
- **User Presence**: Real-time online/offline status with lastSeen timestamps
- **Typing Indicators**: Show when users are typing in real-time
- **Email Invites**: Invite unregistered users via email with secure tokens
- **Member Management**: Add/remove members from group chats (admin only)

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation

1. **Navigate to project directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Edit `.env` file with your settings:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/convohub
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
INVITE_EXPIRY=24
```

**Note for Gmail**: Use [App Password](https://support.google.com/accounts/answer/185833) instead of regular password.

4. **Start the server**
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── mail.js            # Email configuration
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Chat.js            # Chat schema
│   │   ├── Message.js         # Message schema
│   │   └── Invite.js          # Invite schema
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── userController.js  # User logic
│   │   ├── chatController.js  # Chat logic
│   │   ├── messageController.js # Message logic
│   │   └── inviteController.js # Invite logic
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── messageRoutes.js
│   │   └── inviteRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── socket/
│   │   └── socket.js          # Socket.IO handlers
│   └── app.js                 # Express app configuration
├── server.js                  # Server entry point
├── package.json
└── .env
```

## 🔌 API Endpoints

### Authentication

**Signup**
```
POST /api/auth/signup
Body: { name, email, password }
Response: { success, token, user }
```

**Login**
```
POST /api/auth/login
Body: { email, password }
Response: { success, token, user }
```

### Users

**Get All Users** (except logged-in)
```
GET /api/users
Headers: { Authorization: Bearer <token> }
Response: { success, count, users[] }
```

**Get Profile**
```
GET /api/users/profile
Headers: { Authorization: Bearer <token> }
Response: { success, user }
```

**Update Last Seen**
```
PUT /api/users/lastseen
Headers: { Authorization: Bearer <token> }
Response: { success, user }
```

**Update Online Status**
```
PUT /api/users/online-status
Headers: { Authorization: Bearer <token> }
Body: { isOnline: boolean }
Response: { success, user }
```

### Chats

**Create/Get One-to-One Chat**
```
POST /api/chats/one-to-one
Headers: { Authorization: Bearer <token> }
Body: { recipientId }
Response: { success, chat }
```

**Create Group Chat**
```
POST /api/chats/group
Headers: { Authorization: Bearer <token> }
Body: { name, memberIds[] }
Response: { success, chat }
```

**Get All Chats**
```
GET /api/chats
Headers: { Authorization: Bearer <token> }
Response: { success, count, chats[] }
```

**Add Member to Group**
```
PUT /api/chats/:chatId/add-member
Headers: { Authorization: Bearer <token> }
Body: { memberId }
Response: { success, chat }
```

**Remove Member from Group**
```
PUT /api/chats/:chatId/remove-member
Headers: { Authorization: Bearer <token> }
Body: { memberId }
Response: { success, chat }
```

### Messages

**Send Message**
```
POST /api/messages
Headers: { Authorization: Bearer <token> }
Body: { chatId, text }
Response: { success, data: message }
```

**Get Messages**
```
GET /api/messages/:chatId?page=1&limit=50
Headers: { Authorization: Bearer <token> }
Response: { success, totalMessages, page, limit, messages[] }
```

**Mark Message as Seen**
```
PUT /api/messages/:messageId/mark-seen
Headers: { Authorization: Bearer <token> }
Response: { success, data: message }
```

**Mark All Messages as Seen**
```
PUT /api/messages/chat/:chatId/mark-all-seen
Headers: { Authorization: Bearer <token> }
Response: { success }
```

### Invites

**Send Invite**
```
POST /api/invites/send
Headers: { Authorization: Bearer <token> }
Body: { email, chatId }
Response: { success, invite }
```

**Verify Invite**
```
GET /api/invites/verify/:token
Response: { success, invite }
```

**Use Invite**
```
POST /api/invites/use/:token
Headers: { Authorization: Bearer <token> }
Response: { success, chat }
```

## 🔄 Socket.IO Events

### Client to Server

**Send Message**
```javascript
socket.emit('send-message', { chatId, text })
```

**Message Seen**
```javascript
socket.emit('message-seen', { messageId, chatId })
```

**Typing**
```javascript
socket.emit('typing', { chatId })
```

**Stop Typing**
```javascript
socket.emit('stop-typing', { chatId })
```

**Join Chat**
```javascript
socket.emit('join-chat', chatId)
```

**Leave Chat**
```javascript
socket.emit('leave-chat', chatId)
```

### Server to Client

**Receive Message**
```javascript
socket.on('receive-message', (message) => {})
```

**Message Seen Update**
```javascript
socket.on('message-seen-update', (data) => {})
```

**User Typing**
```javascript
socket.on('user-typing', (data) => {})
```

**User Stopped Typing**
```javascript
socket.on('user-stopped-typing', (data) => {})
```

**User Joined**
```javascript
socket.on('user-joined', (data) => {})
```

**User Left**
```javascript
socket.on('user-left', (data) => {})
```

**User Online**
```javascript
socket.on('user-online', (data) => {})
```

**User Offline**
```javascript
socket.on('user-offline', (data) => {})
```

## 🗄️ Database Schemas

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  isOnline: Boolean,
  lastSeen: Date,
  createdAt: Date
}
```

### Chat
```javascript
{
  isGroup: Boolean,
  name: String,
  members: [ObjectId],
  admin: ObjectId,
  lastMessage: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  chatId: ObjectId,
  senderId: ObjectId,
  text: String,
  type: String (text|image|file),
  seenBy: [ObjectId],
  createdAt: Date
}
```

### Invite
```javascript
{
  email: String,
  invitedBy: ObjectId,
  chatId: ObjectId,
  token: String (unique),
  expiresAt: Date,
  used: Boolean,
  usedBy: ObjectId,
  usedAt: Date,
  createdAt: Date
}
```

## 🔐 Authentication Flow

1. User signs up with name, email, password
2. Password is hashed using bcrypt (10 rounds)
3. JWT token is generated with userId and secret
4. Token expires in 7 days (configurable)
5. Protected routes verify token and decode userId
6. Socket.IO connections authenticated via token in handshake

## 📧 Email Invite Flow

1. User invites someone via email
2. System generates unique secure token
3. Email sent with signup link including token
4. Invited user signs up using the link
5. System validates token (not expired, not used)
6. User auto-added to chat/group
7. Invite marked as used

## 🔄 Real-time Features

- **Message Delivery**: Messages delivered instantly via Socket.IO
- **Read Receipts**: See who has read messages with seenBy array
- **Typing Indicators**: Real-time typing notifications
- **Online Status**: Track when users come online/offline
- **Last Seen**: Update when user was last active

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- Request validation
- Protected routes with middleware
- Secure invite tokens
- User isolation (can only access their own chats)
- Admin-only group management

## 📝 Error Handling

All endpoints return standardized responses:

**Success**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error**
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🚀 Production Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set NODE_ENV to 'production'
- [ ] Use MongoDB Atlas or managed database
- [ ] Configure email service (Gmail App Password or SendGrid)
- [ ] Set FRONTEND_URL to production domain
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up backups
- [ ] Use environment-specific configurations

## 🐛 Debugging

Check server logs:
```bash
# Watch logs in real-time
npm run dev
```

Common issues:
- **MongoDB Connection Error**: Ensure MongoDB is running and URI is correct
- **Email Not Sending**: Verify EMAIL_USER and EMAIL_PASS in .env
- **Socket Connection Failed**: Check FRONTEND_URL matches frontend origin
- **Token Expired**: User needs to login again to get new token

## 📚 Next Steps

1. Connect with Next.js frontend
2. Implement file uploads (images, documents)
3. Add message search functionality
4. Implement voice/video calls
5. Add end-to-end encryption
6. Deploy to production (Heroku, Railway, etc.)

## 📄 License

MIT

## 🤝 Support

For issues and questions, please create an issue in the repository.

---

Built with ❤️ for ConvoHub
