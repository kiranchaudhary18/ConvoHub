# ConvoHub Frontend Integration Guide

This guide helps frontend developers integrate with the ConvoHub backend.

## Quick Setup

### 1. Backend URL Configuration

Set the backend base URL in your frontend:

```javascript
// .env.local or config
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 2. Installation

```bash
npm install axios socket.io-client
```

### 3. API Client Setup

Create `utils/api.js`:

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

### 4. Socket Setup

Create `utils/socket.js`:

```javascript
import io from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  socket = io(process.env.REACT_APP_SOCKET_URL, {
    auth: {
      token,
    },
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
```

## Authentication Flow

### Signup

```javascript
import API from './utils/api';

const signup = async (name, email, password) => {
  try {
    const response = await API.post('/auth/signup', {
      name,
      email,
      password,
    });
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    console.error('Signup failed:', error.response.data.message);
  }
};
```

### Login

```javascript
const login = async (email, password) => {
  try {
    const response = await API.post('/auth/login', {
      email,
      password,
    });
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response.data.message);
  }
};
```

### Signup with Invite

```javascript
const signupWithInvite = async (name, email, password, inviteToken) => {
  try {
    // First signup
    const signupResponse = await API.post('/auth/signup', {
      name,
      email,
      password,
    });
    
    // Then use the invite
    const inviteResponse = await API.post(
      `/invites/use/${inviteToken}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${signupResponse.data.token}`,
        },
      }
    );
    
    return { signup: signupResponse.data, invite: inviteResponse.data };
  } catch (error) {
    console.error('Signup with invite failed:', error);
  }
};
```

## User Management

### Get All Users

```javascript
const getUsers = async () => {
  try {
    const response = await API.get('/users');
    return response.data.users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};
```

### Get User Profile

```javascript
const getUserProfile = async () => {
  try {
    const response = await API.get('/users/profile');
    return response.data.user;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};
```

## Chat Operations

### Create One-to-One Chat

```javascript
const createDirectChat = async (recipientId) => {
  try {
    const response = await API.post('/chats/one-to-one', {
      recipientId,
    });
    return response.data.chat;
  } catch (error) {
    console.error('Failed to create chat:', error);
  }
};
```

### Create Group Chat

```javascript
const createGroup = async (name, memberIds) => {
  try {
    const response = await API.post('/chats/group', {
      name,
      memberIds,
    });
    return response.data.chat;
  } catch (error) {
    console.error('Failed to create group:', error);
  }
};
```

### Get All Chats

```javascript
const getAllChats = async () => {
  try {
    const response = await API.get('/chats');
    return response.data.chats;
  } catch (error) {
    console.error('Failed to fetch chats:', error);
  }
};
```

### Add Member to Group

```javascript
const addMember = async (chatId, memberId) => {
  try {
    const response = await API.put(`/chats/${chatId}/add-member`, {
      memberId,
    });
    return response.data.chat;
  } catch (error) {
    console.error('Failed to add member:', error);
  }
};
```

### Remove Member from Group

```javascript
const removeMember = async (chatId, memberId) => {
  try {
    const response = await API.put(`/chats/${chatId}/remove-member`, {
      memberId,
    });
    return response.data.chat;
  } catch (error) {
    console.error('Failed to remove member:', error);
  }
};
```

## Message Operations

### Send Message via API

```javascript
const sendMessageViaAPI = async (chatId, text) => {
  try {
    const response = await API.post('/messages', {
      chatId,
      text,
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};
```

### Send Message via Socket (Recommended for Real-time)

```javascript
const sendMessageViaSocket = (chatId, text) => {
  const socket = getSocket();
  socket.emit('send-message', {
    chatId,
    text,
  });
};
```

### Get Messages with Pagination

```javascript
const getMessages = async (chatId, page = 1, limit = 50) => {
  try {
    const response = await API.get(`/messages/${chatId}`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  }
};
```

### Mark Message as Seen

```javascript
const markMessageSeen = async (messageId, chatId) => {
  try {
    // Via API
    await API.put(`/messages/${messageId}/mark-seen`);
    
    // Via Socket (real-time)
    const socket = getSocket();
    socket.emit('message-seen', { messageId, chatId });
  } catch (error) {
    console.error('Failed to mark message as seen:', error);
  }
};
```

### Mark All Messages as Seen

```javascript
const markAllMessagesSeen = async (chatId) => {
  try {
    await API.put(`/messages/chat/${chatId}/mark-all-seen`);
  } catch (error) {
    console.error('Failed to mark all messages as seen:', error);
  }
};
```

## Invite System

### Send Invite

```javascript
const sendInvite = async (email, chatId) => {
  try {
    const response = await API.post('/invites/send', {
      email,
      chatId,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send invite:', error);
  }
};
```

### Verify Invite Token

```javascript
const verifyInvite = async (token) => {
  try {
    const response = await API.get(`/invites/verify/${token}`);
    return response.data.invite;
  } catch (error) {
    console.error('Invalid or expired invite:', error);
  }
};
```

### Use Invite (After Signup)

```javascript
const useInvite = async (token) => {
  try {
    const response = await API.post(`/invites/use/${token}`);
    return response.data.chat;
  } catch (error) {
    console.error('Failed to use invite:', error);
  }
};
```

## Socket.IO Events

### Listen for Messages

```javascript
const setupMessageListener = () => {
  const socket = getSocket();
  
  socket.on('receive-message', (message) => {
    console.log('New message:', message);
    // Update UI with new message
  });
};
```

### Listen for Typing Indicators

```javascript
const setupTypingListeners = () => {
  const socket = getSocket();
  
  socket.on('user-typing', (data) => {
    console.log(`${data.userId} is typing...`);
  });
  
  socket.on('user-stopped-typing', (data) => {
    console.log(`${data.userId} stopped typing`);
  });
};
```

### Emit Typing Events

```javascript
const handleTyping = (chatId) => {
  const socket = getSocket();
  socket.emit('typing', { chatId });
};

const handleStopTyping = (chatId) => {
  const socket = getSocket();
  socket.emit('stop-typing', { chatId });
};
```

### Listen for Online/Offline

```javascript
const setupPresenceListeners = () => {
  const socket = getSocket();
  
  socket.on('user-online', (data) => {
    console.log(`${data.user.name} is online`);
  });
  
  socket.on('user-offline', (data) => {
    console.log(`User went offline at ${data.lastSeen}`);
  });
};
```

### Join/Leave Chat

```javascript
const joinChat = (chatId) => {
  const socket = getSocket();
  socket.emit('join-chat', chatId);
};

const leaveChat = (chatId) => {
  const socket = getSocket();
  socket.emit('leave-chat', chatId);
};
```

## React Hooks Example

### useAuth Hook

```javascript
import { useState, useCallback } from 'react';
import API from './api';

const useAuth = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/signup', { name, email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  return { user, token, loading, error, signup, login, logout };
};

export default useAuth;
```

### useChat Hook

```javascript
import { useState, useCallback, useEffect } from 'react';
import API from './api';
import { getSocket } from './socket';

const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch messages
  const fetchMessages = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await API.get(`/messages/${chatId}`, { params: { page, limit: 50 } });
      setMessages(response.data.messages);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  // Send message
  const sendMessage = useCallback((text) => {
    const socket = getSocket();
    socket.emit('send-message', { chatId, text });
  }, [chatId]);

  // Setup socket listeners
  useEffect(() => {
    const socket = getSocket();
    
    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, []);

  return { messages, loading, error, fetchMessages, sendMessage };
};

export default useChat;
```

## Common Patterns

### Handle Socket Connection

```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    connectSocket(token);
  }

  return () => {
    disconnectSocket();
  };
}, []);
```

### Handle Auto-mark Messages as Read

```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    markAllMessagesSeen(chatId);
  }, 500);

  return () => clearTimeout(timer);
}, [chatId, messages]);
```

## Error Handling

### Common Error Responses

```javascript
// 401 - Unauthorized (token invalid/expired)
// 400 - Bad Request (missing fields)
// 403 - Forbidden (not authorized for action)
// 404 - Not Found (resource doesn't exist)
// 500 - Server Error

const handleAPIError = (error) => {
  if (error.response?.status === 401) {
    // Redirect to login
    window.location.href = '/login';
  }
  
  const message = error.response?.data?.message || error.message;
  console.error('Error:', message);
};
```

## Testing

### Mock API for Development

```javascript
// utils/mockAPI.js
export const mockChats = [
  {
    _id: '1',
    isGroup: false,
    members: [
      { _id: 'user1', name: 'John' },
      { _id: 'user2', name: 'Jane' },
    ],
    lastMessage: null,
  },
];
```

---

For API endpoint details, refer to the backend README.md.
For deployment information, check DEPLOYMENT.md.
