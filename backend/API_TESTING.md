# API Testing Guide for ConvoHub Backend

## Quick Start Test Sequence

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. User Registration
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response will include JWT token. Save it as `TOKEN1`.

### 3. Register Second User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

Save this token as `TOKEN2`. Also save the userId as `USER2_ID`.

### 4. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 5. Get All Users (except current)
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer TOKEN1"
```

### 6. Create One-to-One Chat
```bash
curl -X POST http://localhost:5000/api/chats/one-to-one \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN1" \
  -d '{
    "recipientId": "USER2_ID"
  }'
```

Save chatId as `CHAT_ID`.

### 7. Send Message
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN1" \
  -d '{
    "chatId": "CHAT_ID",
    "text": "Hello Jane!"
  }'
```

### 8. Get Messages
```bash
curl http://localhost:5000/api/messages/CHAT_ID \
  -H "Authorization: Bearer TOKEN1"
```

### 9. Create Group Chat
```bash
curl -X POST http://localhost:5000/api/chats/group \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN1" \
  -d '{
    "name": "Friends Group",
    "memberIds": ["USER2_ID"]
  }'
```

Save as `GROUP_CHAT_ID`.

### 10. Send Invite
```bash
curl -X POST http://localhost:5000/api/invites/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN1" \
  -d '{
    "email": "newuser@example.com",
    "chatId": "CHAT_ID"
  }'
```

Save token from response as `INVITE_TOKEN`.

### 11. Verify Invite
```bash
curl http://localhost:5000/api/invites/verify/INVITE_TOKEN
```

## Socket.IO Testing with Node.js Client

Create a test file `socket-test.js`:

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_JWT_TOKEN_HERE'
  }
});

socket.on('connect', () => {
  console.log('Connected to server');
  
  // Join chat room
  socket.emit('join-chat', 'CHAT_ID');
  
  // Send message
  setTimeout(() => {
    socket.emit('send-message', {
      chatId: 'CHAT_ID',
      text: 'Hello from Socket.IO!'
    });
  }, 1000);
});

socket.on('receive-message', (message) => {
  console.log('New message:', message);
});

socket.on('user-online', (data) => {
  console.log('User online:', data);
});

socket.on('user-offline', (data) => {
  console.log('User offline:', data);
});

socket.on('user-typing', (data) => {
  console.log('User typing:', data);
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

Run with: `node socket-test.js`

## Using Postman

1. Create a new Postman collection
2. Add POST request to `http://localhost:5000/api/auth/signup`
3. In "Tests" tab, add:

```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
pm.environment.set("userId", jsonData.user.id);
```

4. Use `{{token}}` in Authorization header for subsequent requests
5. Use `{{userId}}` for user IDs in request bodies

## Environment Variables for Testing

Set these in `.env.local` for testing:

```
MONGODB_URI=mongodb://localhost:27017/convohub-test
NODE_ENV=test
JWT_EXPIRE=24h
```

## Common Test Scenarios

### Scenario 1: Direct Message Exchange
1. Create two users
2. Create 1-to-1 chat
3. Send messages between them
4. Mark messages as seen
5. Verify message order and seen status

### Scenario 2: Group Chat with Members
1. Create group with 3+ members
2. Admin adds new member
3. Send group message
4. Verify all members receive it
5. Admin removes a member

### Scenario 3: Email Invitation Flow
1. Send invite to unregistered email
2. Verify token is created
3. Register new user with invite token
4. Verify user auto-added to chat
5. Verify invite marked as used

### Scenario 4: Online/Offline Status
1. User A goes online (Socket connect)
2. User B receives 'user-online' event
3. User A sends message
4. User A disconnects
5. User B receives 'user-offline' event with lastSeen

### Scenario 5: Typing Indicators
1. User A connects to chat
2. User B connects to same chat
3. User A emits 'typing'
4. User B receives 'user-typing' event
5. User A emits 'stop-typing'
6. User B receives 'user-stopped-typing' event

## Troubleshooting

### Token Not Working
- Make sure token is included in Authorization header: `Bearer <token>`
- Check token hasn't expired (default 7 days)
- Try logging in again

### Messages Not Appearing
- Verify user is member of the chat
- Check chatId is correct
- Ensure message text is not empty

### Sockets Not Connecting
- Verify frontend URL matches FRONTEND_URL in .env
- Check token is valid
- Ensure Socket.IO client matches server version

### Emails Not Sending
- Check EMAIL_USER and EMAIL_PASS in .env
- For Gmail: use App Password, not regular password
- Check email service is available
- Look at server logs for error details
