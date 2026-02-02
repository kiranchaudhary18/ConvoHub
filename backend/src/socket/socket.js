const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Store active socket connections
const userSocketMap = new Map(); // userId -> socketId

// Initialize Socket.IO
const initializeSocket = (io) => {
  io.on('connection', async (socket) => {
    console.log('New user connected:', socket.id);

    // Authenticate user via socket
    const token = socket.handshake.auth.token;
    let userId;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;

      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        socket.disconnect();
        return;
      }

      // Store socket connection
      userSocketMap.set(userId, socket.id);

      // Update user online status
      await User.findByIdAndUpdate(userId, { isOnline: true });

      // Notify others that user is online
      socket.broadcast.emit('user-online', {
        userId,
        user: {
          id: user._id,
          name: user.name,
          isOnline: true,
        },
      });

      console.log(`${user.name} is online`);

      // ============ MESSAGE EVENTS ============

      // Handle sending message
      socket.on('send-message', async (data) => {
        try {
          const { chatId, text } = data;

          // Create message in database
          const message = await Message.create({
            chatId,
            senderId: userId,
            text,
            seenBy: [userId],
          });

          const populatedMessage = await message.populate('senderId', '-password');

          // Update chat's lastMessage
          await Chat.findByIdAndUpdate(
            chatId,
            {
              lastMessage: message._id,
              updatedAt: new Date(),
            },
            { new: true }
          );

          // Emit message to all users in the chat
          io.to(chatId).emit('receive-message', {
            _id: message._id,
            chatId,
            sender: {
              _id: populatedMessage.senderId._id,
              name: populatedMessage.senderId.name,
              email: populatedMessage.senderId.email,
              avatar: populatedMessage.senderId.avatar,
            },
            text,
            seenBy: [userId],
            createdAt: message.createdAt,
          });
        } catch (error) {
          console.error('Send message error:', error.message);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle message seen
      socket.on('message-seen', async (data) => {
        try {
          const { messageId, chatId } = data;

          const message = await Message.findByIdAndUpdate(
            messageId,
            { $addToSet: { seenBy: userId } },
            { new: true }
          );

          // Notify others in chat about seen status
          io.to(chatId).emit('message-seen-update', {
            messageId,
            userId,
            seenBy: message.seenBy,
          });
        } catch (error) {
          console.error('Message seen error:', error.message);
        }
      });

      // Handle typing indicator
      socket.on('typing', (data) => {
        const { chatId } = data;
        socket.broadcast.to(chatId).emit('user-typing', {
          userId,
          chatId,
        });
      });

      // Handle stop typing
      socket.on('stop-typing', (data) => {
        const { chatId } = data;
        socket.broadcast.to(chatId).emit('user-stopped-typing', {
          userId,
          chatId,
        });
      });

      // ============ CHAT ROOM EVENTS ============

      // Join chat room
      socket.on('join-chat', (chatId) => {
        socket.join(chatId);
        console.log(`User ${userId} joined chat ${chatId}`);

        // Notify others in the chat
        socket.broadcast.to(chatId).emit('user-joined', {
          userId,
          message: `User joined the chat`,
        });
      });

      // Leave chat room
      socket.on('leave-chat', (chatId) => {
        socket.leave(chatId);
        console.log(`User ${userId} left chat ${chatId}`);

        socket.broadcast.to(chatId).emit('user-left', {
          userId,
          message: `User left the chat`,
        });
      });

      // ============ DISCONNECT EVENT ============

      socket.on('disconnect', async () => {
        try {
          // Remove from socket map
          userSocketMap.delete(userId);

          // Update user offline status
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
          });

          // Notify others that user is offline
          socket.broadcast.emit('user-offline', {
            userId,
            lastSeen: new Date(),
          });

          console.log(`User ${userId} disconnected`);
        } catch (error) {
          console.error('Disconnect error:', error.message);
        }
      });
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      socket.disconnect();
    }
  });
};

// Get socket ID for a user
const getUserSocket = (userId) => {
  return userSocketMap.get(userId);
};

// Get all active users
const getActiveUsers = () => {
  return Array.from(userSocketMap.keys());
};

module.exports = {
  initializeSocket,
  getUserSocket,
  getActiveUsers,
  userSocketMap,
};
