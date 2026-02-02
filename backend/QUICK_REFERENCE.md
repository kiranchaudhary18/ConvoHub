# ConvoHub Backend - Quick Reference Card

## 🚀 Quick Start (5 minutes)

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment
# Edit .env with your settings:
# - MongoDB URL
# - JWT_SECRET
# - Email credentials
# - Frontend URL

# 4. Start server
npm run dev

# 5. Test
curl http://localhost:5000/api/health
```

---

## 📋 Environment Setup

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/convohub
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
INVITE_EXPIRY=24
```

---

## 🔌 API Endpoints (18 total)

### Authentication
```
POST   /api/auth/signup          # Register user
POST   /api/auth/login            # Login user
```

### Users
```
GET    /api/users                 # Get all users
GET    /api/users/profile         # Get your profile
PUT    /api/users/lastseen        # Update lastSeen
PUT    /api/users/online-status   # Update online status
```

### Chats
```
POST   /api/chats/one-to-one      # Create 1-to-1 chat
POST   /api/chats/group            # Create group
GET    /api/chats                  # Get your chats
PUT    /api/chats/:id/add-member   # Add group member
PUT    /api/chats/:id/remove-member # Remove member
```

### Messages
```
POST   /api/messages                        # Send message
GET    /api/messages/:chatId                # Get messages
PUT    /api/messages/:id/mark-seen          # Mark read
PUT    /api/messages/chat/:id/mark-all-seen # Mark all read
```

### Invites
```
POST   /api/invites/send              # Send invite
GET    /api/invites/verify/:token     # Check invite
POST   /api/invites/use/:token        # Use invite
```

### Health
```
GET    /api/health                    # Server status
```

---

## 🔄 Socket.IO Events

### Send
```javascript
socket.emit('send-message', { chatId, text })
socket.emit('message-seen', { messageId, chatId })
socket.emit('typing', { chatId })
socket.emit('stop-typing', { chatId })
socket.emit('join-chat', chatId)
socket.emit('leave-chat', chatId)
```

### Listen
```javascript
socket.on('receive-message', (message) => {})
socket.on('message-seen-update', (data) => {})
socket.on('user-typing', (data) => {})
socket.on('user-stopped-typing', (data) => {})
socket.on('user-joined', (data) => {})
socket.on('user-left', (data) => {})
socket.on('user-online', (data) => {})
socket.on('user-offline', (data) => {})
```

---

## 📚 Documentation Map

| Document | Purpose |
|----------|---------|
| README.md | Setup & API reference |
| DEPLOYMENT.md | Deploy to production |
| FRONTEND_INTEGRATION.md | Connect frontend |
| API_TESTING.md | Test the API |
| PROJECT_SUMMARY.md | Project overview |
| FILE_STRUCTURE.md | Code organization |
| IMPLEMENTATION_CHECKLIST.md | Feature verification |

---

## 🔐 Authentication Flow

```javascript
// 1. Signup
POST /api/auth/signup
{ "name": "John", "email": "john@example.com", "password": "pass123" }
→ { "token": "jwt_token", "user": {...} }

// 2. Save token
localStorage.setItem('token', token)

// 3. Use in requests
headers: { "Authorization": "Bearer " + token }

// 4. Protected endpoints
GET /api/users (requires token)
```

---

## 💾 Database Models

```javascript
User {
  name, email, password (hashed), avatar,
  isOnline, lastSeen, createdAt
}

Chat {
  isGroup, name, members[], admin,
  lastMessage, createdAt, updatedAt
}

Message {
  chatId, senderId, text, type,
  seenBy[], createdAt
}

Invite {
  email, invitedBy, chatId, token,
  expiresAt, used, usedBy, usedAt
}
```

---

## 🛠️ Common Tasks

### Create Direct Chat
```javascript
POST /api/chats/one-to-one
{ "recipientId": "user_id" }
```

### Create Group
```javascript
POST /api/chats/group
{ "name": "Friends", "memberIds": ["id1", "id2"] }
```

### Send Message (API)
```javascript
POST /api/messages
{ "chatId": "chat_id", "text": "Hello!" }
```

### Send Message (Socket)
```javascript
socket.emit('send-message', { chatId, text })
```

### Mark as Read
```javascript
PUT /api/messages/chat/:chatId/mark-all-seen
```

### Send Invite
```javascript
POST /api/invites/send
{ "email": "new@example.com", "chatId": "chat_id" }
```

### Use Invite (After Signup)
```javascript
POST /api/invites/use/:token
```

---

## 🧪 Testing Sequence

```bash
# 1. Health check
curl http://localhost:5000/api/health

# 2. Signup user 1
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'
# Save TOKEN1 from response

# 3. Signup user 2
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@test.com","password":"pass123"}'
# Save TOKEN2 and USER2_ID

# 4. Create chat
curl -X POST http://localhost:5000/api/chats/one-to-one \
  -H "Authorization: Bearer TOKEN1" \
  -H "Content-Type: application/json" \
  -d '{"recipientId":"USER2_ID"}'
# Save CHAT_ID

# 5. Send message
curl -X POST http://localhost:5000/api/messages \
  -H "Authorization: Bearer TOKEN1" \
  -H "Content-Type: application/json" \
  -d '{"chatId":"CHAT_ID","text":"Hello Jane!"}'

# 6. Get messages
curl http://localhost:5000/api/messages/CHAT_ID \
  -H "Authorization: Bearer TOKEN1"

# See API_TESTING.md for complete guide
```

---

## ⚡ Performance Tips

- Use pagination for messages (50/page)
- Cache user lists
- Lazy load chat history
- Use Socket.IO for real-time only
- Monitor database queries
- Enable database indexes

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to random 32+ char string
- [ ] Set NODE_ENV=production
- [ ] Use strong MongoDB password
- [ ] Configure CORS for your domain
- [ ] Use HTTPS in production
- [ ] Enable database backups
- [ ] Monitor error logs
- [ ] Setup rate limiting
- [ ] Validate all inputs
- [ ] Use environment variables

---

## 🚀 Deployment Commands

### Heroku
```bash
heroku create convohub-api
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_uri
git push heroku main
```

### Railway
```bash
railway link
railway deploy
```

### Docker
```bash
docker-compose up -d
```

### AWS/Self-hosted
```bash
npm install
npm start
# Or use PM2: pm2 start server.js
```

---

## 📊 Project Statistics

- **Total Files**: 32
- **Lines of Code**: ~2,500+
- **API Endpoints**: 19 (including health)
- **Socket Events**: 14
- **Database Models**: 4
- **Controllers**: 5
- **Routes**: 5
- **Documentation Pages**: 8
- **Features**: 7 core + 7 bonus

---

## 🆘 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Port already in use | Change PORT in .env |
| MongoDB connection error | Check MongoDB is running & URI is correct |
| Emails not sending | Verify EMAIL_USER & EMAIL_PASS in .env |
| Socket not connecting | Check FRONTEND_URL matches frontend domain |
| Token not working | Make sure token is in Authorization header |
| Invite email not received | Check spam folder & email settings |

---

## 📞 Support Resources

- Full docs: See README.md
- API details: See DEPLOYMENT.md
- Testing: See API_TESTING.md
- Frontend: See FRONTEND_INTEGRATION.md
- Structure: See FILE_STRUCTURE.md
- Checklist: See IMPLEMENTATION_CHECKLIST.md

---

## 🎯 Next Steps

1. **Now**: Install & run locally
   ```bash
   npm install && npm run dev
   ```

2. **Next**: Test endpoints
   - See API_TESTING.md

3. **Then**: Deploy to production
   - See DEPLOYMENT.md

4. **Finally**: Build frontend
   - See FRONTEND_INTEGRATION.md

---

**ConvoHub Backend is ready to scale! 🚀**

Built with production-grade code and comprehensive documentation.

For questions, refer to the detailed documentation files.
