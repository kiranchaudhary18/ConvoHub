# ConvoHub Backend - Complete File Structure

## Project Directory Tree

```
ConvoHub/
└── backend/
    ├── src/
    │   ├── config/
    │   │   ├── db.js                      # MongoDB Connection
    │   │   │   ├── connectDB()
    │   │   │   └── Error handling
    │   │   │
    │   │   └── mail.js                    # Email Configuration
    │   │       ├── mailTransporter
    │   │       ├── sendInviteEmail()
    │   │       └── HTML email templates
    │   │
    │   ├── models/
    │   │   ├── User.js                    # User Schema (7 fields)
    │   │   │   ├── name
    │   │   │   ├── email (unique)
    │   │   │   ├── password (hashed with bcrypt)
    │   │   │   ├── avatar
    │   │   │   ├── isOnline
    │   │   │   ├── lastSeen
    │   │   │   ├── createdAt
    │   │   │   ├── Pre-save hook for password hashing
    │   │   │   └── matchPassword() method
    │   │   │
    │   │   ├── Chat.js                    # Chat Schema (6 fields)
    │   │   │   ├── isGroup (boolean)
    │   │   │   ├── name (required for groups)
    │   │   │   ├── members (User refs)
    │   │   │   ├── admin (User ref)
    │   │   │   ├── lastMessage (Message ref)
    │   │   │   ├── createdAt
    │   │   │   └── updatedAt (auto-updates)
    │   │   │
    │   │   ├── Message.js                 # Message Schema (5 fields)
    │   │   │   ├── chatId (Chat ref, indexed)
    │   │   │   ├── senderId (User ref)
    │   │   │   ├── text (required)
    │   │   │   ├── type (text/image/file)
    │   │   │   ├── seenBy (User refs array)
    │   │   │   └── createdAt (indexed for sorting)
    │   │   │
    │   │   └── Invite.js                  # Invite Schema (7 fields)
    │   │       ├── email (lowercase)
    │   │       ├── invitedBy (User ref)
    │   │       ├── chatId (Chat ref)
    │   │       ├── token (unique, indexed)
    │   │       ├── expiresAt
    │   │       ├── used (boolean)
    │   │       ├── usedBy (User ref)
    │   │       ├── usedAt
    │   │       ├── Pre-save token generation
    │   │       └── createdAt
    │   │
    │   ├── controllers/
    │   │   ├── authController.js          # Authentication Logic
    │   │   │   ├── signup()
    │   │   │   │   ├── Validate input
    │   │   │   │   ├── Check duplicate email
    │   │   │   │   ├── Hash password
    │   │   │   │   ├── Generate JWT
    │   │   │   │   └── Return user & token
    │   │   │   │
    │   │   │   ├── login()
    │   │   │   │   ├── Validate credentials
    │   │   │   │   ├── Verify password
    │   │   │   │   ├── Generate JWT
    │   │   │   │   └── Return user & token
    │   │   │   │
    │   │   │   └── generateToken()
    │   │   │       └── Create JWT with expiry
    │   │   │
    │   │   ├── userController.js          # User Management Logic
    │   │   │   ├── getAllUsers()
    │   │   │   │   ├── Exclude logged-in user
    │   │   │   │   ├── Exclude passwords
    │   │   │   │   └── Return user list
    │   │   │   │
    │   │   │   ├── getUserProfile()
    │   │   │   │   └── Get current user details
    │   │   │   │
    │   │   │   ├── updateLastSeen()
    │   │   │   │   └── Update timestamp
    │   │   │   │
    │   │   │   └── updateOnlineStatus()
    │   │   │       ├── Set isOnline flag
    │   │   │       └── Update lastSeen
    │   │   │
    │   │   ├── chatController.js          # Chat Management Logic
    │   │   │   ├── createOrGetOneToOneChat()
    │   │   │   │   ├── Check if chat exists
    │   │   │   │   ├── Create if not exists
    │   │   │   │   └── Populate members
    │   │   │   │
    │   │   │   ├── createGroupChat()
    │   │   │   │   ├── Validate members
    │   │   │   │   ├── Add creator as member
    │   │   │   │   ├── Set creator as admin
    │   │   │   │   └── Return populated group
    │   │   │   │
    │   │   │   ├── getAllChats()
    │   │   │   │   ├── Fetch user's chats
    │   │   │   │   ├── Populate members & messages
    │   │   │   │   ├── Sort by updatedAt (recent first)
    │   │   │   │   └── Return list
    │   │   │   │
    │   │   │   ├── addMemberToGroup()
    │   │   │   │   ├── Verify user is admin
    │   │   │   │   ├── Check member doesn't exist
    │   │   │   │   ├── Add to members array
    │   │   │   │   └── Return updated chat
    │   │   │   │
    │   │   │   └── removeMemberFromGroup()
    │   │   │       ├── Verify user is admin
    │   │   │       ├── Remove from members array
    │   │   │       └── Return updated chat
    │   │   │
    │   │   ├── messageController.js       # Message Management Logic
    │   │   │   ├── sendMessage()
    │   │   │   │   ├── Validate input
    │   │   │   │   ├── Check user is in chat
    │   │   │   │   ├── Create message
    │   │   │   │   ├── Update chat lastMessage
    │   │   │   │   └── Populate sender details
    │   │   │   │
    │   │   │   ├── getMessages()
    │   │   │   │   ├── Check user is in chat
    │   │   │   │   ├── Fetch with pagination
    │   │   │   │   ├── Populate sender & seenBy
    │   │   │   │   └── Return in chronological order
    │   │   │   │
    │   │   │   ├── markMessageAsSeen()
    │   │   │   │   ├── Add user to seenBy
    │   │   │   │   └── Return updated message
    │   │   │   │
    │   │   │   └── markAllMessagesAsSeen()
    │   │   │       └── Update all messages in chat
    │   │   │
    │   │   └── inviteController.js        # Invite System Logic
    │   │       ├── sendInvite()
    │   │       │   ├── Check user is in chat
    │   │       │   ├── Check if email exists
    │   │       │   ├── Add existing users directly
    │   │       │   ├── Generate invite token
    │   │       │   ├── Set expiration time
    │   │       │   ├── Send email
    │   │       │   └── Return invite details
    │   │       │
    │   │       ├── verifyInvite()
    │   │       │   ├── Find invite by token
    │   │       │   ├── Check not used
    │   │       │   ├── Check not expired
    │   │       │   └── Return invite details
    │   │       │
    │   │       └── useInvite()
    │   │           ├── Verify token validity
    │   │           ├── Add user to chat
    │   │           ├── Mark as used
    │   │           └── Return updated chat
    │   │
    │   ├── routes/
    │   │   ├── authRoutes.js              # Auth Endpoints
    │   │   │   ├── POST /api/auth/signup
    │   │   │   └── POST /api/auth/login
    │   │   │
    │   │   ├── userRoutes.js              # User Endpoints (Protected)
    │   │   │   ├── GET /api/users
    │   │   │   ├── GET /api/users/profile
    │   │   │   ├── PUT /api/users/lastseen
    │   │   │   └── PUT /api/users/online-status
    │   │   │
    │   │   ├── chatRoutes.js              # Chat Endpoints (Protected)
    │   │   │   ├── POST /api/chats/one-to-one
    │   │   │   ├── POST /api/chats/group
    │   │   │   ├── GET /api/chats
    │   │   │   ├── PUT /api/chats/:chatId/add-member
    │   │   │   └── PUT /api/chats/:chatId/remove-member
    │   │   │
    │   │   ├── messageRoutes.js           # Message Endpoints (Protected)
    │   │   │   ├── POST /api/messages
    │   │   │   ├── GET /api/messages/:chatId
    │   │   │   ├── PUT /api/messages/:messageId/mark-seen
    │   │   │   └── PUT /api/messages/chat/:chatId/mark-all-seen
    │   │   │
    │   │   └── inviteRoutes.js            # Invite Endpoints
    │   │       ├── POST /api/invites/send (Protected)
    │   │       ├── GET /api/invites/verify/:token (Public)
    │   │       └── POST /api/invites/use/:token (Protected)
    │   │
    │   ├── middleware/
    │   │   └── authMiddleware.js          # JWT Middleware
    │   │       └── protect()
    │   │           ├── Extract token from header
    │   │           ├── Verify JWT
    │   │           ├── Fetch user from DB
    │   │           └── Attach to request
    │   │
    │   ├── socket/
    │   │   └── socket.js                  # Socket.IO Handlers
    │   │       ├── initializeSocket()
    │   │       │   ├── Connection event
    │   │       │   ├── Socket authentication
    │   │       │   ├── User socket mapping
    │   │       │   ├── Online status update
    │   │       │   │
    │   │       │   ├── Message Events:
    │   │       │   │   ├── send-message
    │   │       │   │   ├── message-seen
    │   │       │   │   │
    │   │       │   ├── Chat Room Events:
    │   │       │   │   ├── join-chat
    │   │       │   │   ├── leave-chat
    │   │       │   │   │
    │   │       │   ├── Presence Events:
    │   │       │   │   ├── typing
    │   │       │   │   ├── stop-typing
    │   │       │   │   │
    │   │       │   └── Disconnect Handling:
    │   │       │       ├── Remove socket mapping
    │   │       │       ├── Update offline status
    │   │       │       ├── Update lastSeen
    │   │       │       └── Notify others
    │   │       │
    │   │       ├── getUserSocket()
    │   │       ├── getActiveUsers()
    │   │       └── userSocketMap (Map)
    │   │
    │   └── app.js                         # Express App Configuration
    │       ├── CORS setup
    │       ├── Body parser middleware
    │       ├── Request logging
    │       ├── Route mounting
    │       │   ├── /api/auth
    │       │   ├── /api/users
    │       │   ├── /api/chats
    │       │   ├── /api/messages
    │       │   └── /api/invites
    │       ├── Health check endpoint
    │       ├── 404 handler
    │       └── Global error handler
    │
    ├── server.js                          # Server Entry Point
    │   ├── Load environment variables
    │   ├── Create HTTP server
    │   ├── Initialize Socket.IO
    │   ├── Connect to MongoDB
    │   ├── Start listening on PORT
    │   └── Handle process errors
    │
    ├── package.json                       # Dependencies & Scripts
    │   ├── scripts:
    │   │   ├── start: node server.js
    │   │   └── dev: nodemon server.js
    │   └── dependencies:
    │       ├── express
    │       ├── mongoose
    │       ├── socket.io
    │       ├── jsonwebtoken
    │       ├── bcrypt
    │       ├── nodemailer
    │       ├── cors
    │       ├── dotenv
    │       └── (devDependencies: nodemon)
    │
    ├── .env                               # Environment Variables
    │   ├── PORT
    │   ├── NODE_ENV
    │   ├── MONGODB_URI
    │   ├── JWT_SECRET
    │   ├── JWT_EXPIRE
    │   ├── EMAIL_SERVICE
    │   ├── EMAIL_USER
    │   ├── EMAIL_PASS
    │   ├── FRONTEND_URL
    │   └── INVITE_EXPIRY
    │
    ├── .gitignore                         # Git Ignore Rules
    │   ├── node_modules/
    │   ├── .env
    │   ├── *.log
    │   ├── .DS_Store
    │   └── IDE files
    │
    ├── README.md                          # Main Documentation
    │   ├── Features overview
    │   ├── Installation guide
    │   ├── Project structure
    │   ├── API endpoints reference
    │   ├── Socket.IO events
    │   ├── Database schemas
    │   ├── Security features
    │   ├── Production checklist
    │   └── Troubleshooting
    │
    ├── PROJECT_SUMMARY.md                 # Project Summary
    │   ├── What's included
    │   ├── Quick start
    │   ├── Complete documentation index
    │   ├── API endpoints summary
    │   ├── Database models
    │   ├── Feature breakdown
    │   └── Next steps
    │
    ├── DEPLOYMENT.md                      # Deployment Guide
    │   ├── Environment configuration
    │   ├── Gmail setup
    │   ├── MongoDB Atlas setup
    │   ├── Heroku deployment
    │   ├── Railway.app deployment
    │   ├── AWS EC2 deployment
    │   ├── Docker deployment
    │   ├── Security checklist
    │   ├── Monitoring setup
    │   ├── CI/CD pipeline
    │   ├── Backup & recovery
    │   └── Troubleshooting
    │
    ├── FRONTEND_INTEGRATION.md            # Frontend Integration Guide
    │   ├── Setup instructions
    │   ├── API client setup
    │   ├── Socket setup
    │   ├── Authentication flow examples
    │   ├── All API calls with code
    │   ├── Socket.IO events
    │   ├── React hooks examples
    │   ├── Common patterns
    │   ├── Error handling
    │   └── Testing
    │
    ├── API_TESTING.md                     # API Testing Guide
    │   ├── Quick start test sequence
    │   ├── cURL examples
    │   ├── Socket.IO testing
    │   ├── Postman setup
    │   ├── Test scenarios
    │   ├── Troubleshooting
    │   └── Environment setup
    │
    ├── setup.sh                           # Linux/macOS Setup Script
    │   ├── Check Node.js
    │   ├── Check npm
    │   ├── Install dependencies
    │   ├── Create .env file
    │   └── Display next steps
    │
    └── setup.bat                          # Windows Setup Script
        ├── Check Node.js
        ├── Check npm
        ├── Install dependencies
        ├── Create .env file
        └── Display next steps
```

## File Statistics

- **Total Files**: 23
- **Source Files**: 15 (models, controllers, routes, middleware, socket, config)
- **Configuration Files**: 1 (package.json, .env)
- **Documentation Files**: 6 (README, DEPLOYMENT, FRONTEND_INTEGRATION, API_TESTING, PROJECT_SUMMARY, this file)
- **Setup Scripts**: 2 (setup.sh, setup.bat)

## Key File Sizes (Approximate)

- app.js: ~2 KB
- server.js: ~1.5 KB
- Individual controllers: 3-5 KB each
- Individual models: 1-2 KB each
- Individual routes: ~1 KB each
- socket.js: ~4 KB
- Documentation files: 5-20 KB each
- package.json: ~1 KB

## Dependencies

**Production (7)**
- express: Web framework
- mongoose: MongoDB ORM
- socket.io: Real-time communication
- jsonwebtoken: JWT authentication
- bcrypt: Password hashing
- nodemailer: Email sending
- cors: CORS middleware
- dotenv: Environment variables

**Development (1)**
- nodemon: Auto-reload server

## API Routes Summary

| Method | Endpoint | Type | Purpose |
|--------|----------|------|---------|
| POST | /api/auth/signup | Public | User registration |
| POST | /api/auth/login | Public | User login |
| GET | /api/users | Private | Get all users |
| GET | /api/users/profile | Private | Get profile |
| PUT | /api/users/lastseen | Private | Update lastSeen |
| PUT | /api/users/online-status | Private | Update online status |
| POST | /api/chats/one-to-one | Private | Create 1-to-1 chat |
| POST | /api/chats/group | Private | Create group |
| GET | /api/chats | Private | Get all chats |
| PUT | /api/chats/:id/add-member | Private | Add member |
| PUT | /api/chats/:id/remove-member | Private | Remove member |
| POST | /api/messages | Private | Send message |
| GET | /api/messages/:id | Private | Get messages |
| PUT | /api/messages/:id/mark-seen | Private | Mark seen |
| PUT | /api/messages/chat/:id/mark-all-seen | Private | Mark all seen |
| POST | /api/invites/send | Private | Send invite |
| GET | /api/invites/verify/:token | Public | Verify invite |
| POST | /api/invites/use/:token | Private | Use invite |
| GET | /api/health | Public | Health check |

**Total Routes: 19**

## Socket Events Summary

| Event | Direction | Purpose |
|-------|-----------|---------|
| send-message | C→S | Send message |
| receive-message | S→C | Receive message |
| message-seen | C→S | Mark as seen |
| message-seen-update | S→C | Seen update |
| typing | C→S | User typing |
| user-typing | S→C | Typing indicator |
| stop-typing | C→S | Stop typing |
| user-stopped-typing | S→C | Stop typing notify |
| join-chat | C→S | Join room |
| user-joined | S→C | User joined notify |
| leave-chat | C→S | Leave room |
| user-left | S→C | User left notify |
| user-online | S→C | Online status |
| user-offline | S→C | Offline status |

**Total Socket Events: 14**

---

This complete file structure provides a production-ready, scalable backend for ConvoHub with all features implemented and fully documented.
