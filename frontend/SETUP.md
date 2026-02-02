# ConvoHub Frontend Setup

## Quick Start

### 1. Install Dependencies
\`\`\`bash
cd d:\ConvoHub\frontend
npm install
\`\`\`

### 2. Configure Environment
The \`.env.local\` file is already configured:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
\`\`\`

### 3. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:3000\` in your browser.

---

## Backend Requirements

Make sure your ConvoHub backend is running:
- Backend URL: \`http://localhost:5000\`
- MongoDB connected and running
- Email configured in \`.env\`

---

## Features Implemented

✅ **Authentication**
- Login page with validation
- Signup page with email verification support
- JWT token storage & automatic refresh
- Protected routes with authentication checks

✅ **Chat Interface**
- Real-time messaging with Socket.IO
- One-to-one and group chats
- Online/offline status indicators
- Message read receipts
- Typing indicators
- Emoji and file support UI

✅ **Group Management**
- Create groups with multiple members
- Add/remove members
- Group avatars and names
- Admin controls

✅ **Invite System**
- Send email invitations
- Invite links with token validation
- Pre-filled signup for invited users

✅ **UI/UX**
- Dark/Light mode toggle
- Smooth animations with Framer Motion
- Responsive design (desktop & mobile)
- Loading states and skeleton screens
- Toast notifications
- Glassmorphism effects

✅ **State Management**
- Zustand stores for auth, chat, users, UI
- Automatic persistence to localStorage
- Real-time sync with backend

---

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── app/
│   │   ├── layout.jsx          # Root layout with dark mode
│   │   ├── page.jsx            # Home redirect to login
│   │   ├── login/
│   │   │   └── page.jsx        # Login page
│   │   ├── register/
│   │   │   └── page.jsx        # Signup page with invite support
│   │   └── chat/
│   │       ├── layout.jsx      # Chat layout with Socket.IO
│   │       ├── page.jsx        # Chat welcome screen
│   │       └── (will add more routes)
│   ├── components/
│   │   └── chat/
│   │       ├── Sidebar.jsx         # Left sidebar with chats/users/groups
│   │       ├── ChatList.jsx        # List of chats
│   │       ├── UsersList.jsx       # List of users to chat with
│   │       ├── ChatWindow.jsx      # Main chat window
│   │       ├── ChatHeader.jsx      # Chat header with info
│   │       ├── MessageList.jsx     # Message display with read receipts
│   │       ├── MessageInput.jsx    # Message input with emoji
│   │       ├── GroupModal.jsx      # Create group modal
│   │       └── InviteModal.jsx     # Send invite modal
│   ├── stores/
│   │   ├── authStore.js        # Auth state (user, token)
│   │   ├── chatStore.js        # Chat state (messages, chats, active)
│   │   ├── userStore.js        # Users state (list, online status)
│   │   └── uiStore.js          # UI state (dark mode, modals, tabs)
│   ├── lib/
│   │   ├── api.js              # Axios instance with interceptors
│   │   ├── socket.js           # Socket.IO client setup
│   │   └── utils.js            # Helper functions
│   └── styles/
│       └── globals.css         # Tailwind + custom animations
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── .env.local
\`\`\`

---

## API Integration

All API calls go through the Axios instance (\`src/lib/api.js\`) which:
- Automatically adds JWT token to requests
- Handles 401 errors by redirecting to login
- Base URL is \`http://localhost:5000/api\`

Example:
\`\`\`javascript
import api from '@/lib/api';

// Login
const response = await api.post('/auth/login', { email, password });

// Get messages
const messages = await api.get(\`/messages/\${chatId}\`);

// Send message
const message = await api.post('/messages', { text, chatId });
\`\`\`

---

## Socket.IO Events

Real-time features through Socket.IO:

**Emit:**
- \`send-message\` - Send a message
- \`typing\` - Notify typing status
- \`mark-as-seen\` - Mark messages as seen

**Listen:**
- \`message-received\` - New message received
- \`user-typing\` - User is typing
- \`user-online\` - User came online
- \`user-offline\` - User went offline

---

## Testing with Postman

### 1. Login
\`\`\`
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

Response includes JWT token - copy it for next requests.

### 2. Frontend will automatically:
- Store token in localStorage
- Add token to all API requests
- Redirect to chat page on successful login
- Connect to Socket.IO with the token

---

## Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

---

## Troubleshooting

**"Cannot connect to backend"**
- Ensure backend is running on port 5000
- Check \`.env.local\` API URLs are correct
- Check CORS is enabled in backend

**"Authentication keeps redirecting to login"**
- Token may have expired (7 days)
- Try logging in again
- Check token is being stored in localStorage

**"Messages not updating in real-time"**
- Check Socket.IO connection in browser DevTools Network tab
- Verify backend Socket.IO is initialized
- Check auth token is being sent

---

## Dark Mode

Toggle dark mode with the Moon/Sun icon in sidebar. Mode is saved to localStorage.

---

## Next Steps

1. Install dependencies: \`npm install\`
2. Start server: \`npm run dev\`
3. Open \`http://localhost:3000\`
4. Login with test account
5. Start chatting!

Enjoy! 🚀
