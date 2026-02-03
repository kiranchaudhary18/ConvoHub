'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { getSocket, initializeSocket } from '@/lib/socket';
import api from '@/lib/api';

export default function ChatWindow() {
  const { activeChat, messages, setMessages, addMessage, updateMessage, deleteMessage } = useChatStore();
  const { user: currentUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeChat) return;

    // Fetch messages
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/messages/${activeChat}`);
        const messagesData = response.data?.messages || response.data?.data || [];
        setMessages(activeChat, messagesData);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages(activeChat, []);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Setup socket listeners
    const socket = initializeSocket();
    if (socket) {
      // Join the chat room
      socket.emit('join-chat', activeChat);

      // Create handler functions with activeChat in closure
      const handleNewMessage = (message) => {
        if (message.chatId === activeChat) {
          addMessage(activeChat, message);
        }
      };

      const handleMessageEdited = (data) => {
        if (data.chatId === activeChat) {
          updateMessage(activeChat, data._id, data);
        }
      };

      const handleMessageDeleted = (data) => {
        if (data.chatId === activeChat) {
          // If deleted for everyone, update the message to show as deleted
          if (data.isDeleted) {
            updateMessage(activeChat, data._id, {
              isDeleted: true,
              deletedAt: data.deletedAt,
              text: 'This message was deleted'
            });
          } else {
            // If deleted for me only, remove from view
            deleteMessage(activeChat, data._id);
          }
        }
      };

      // Listen for both 'receive-message' and 'new-message' events
      socket.on('receive-message', handleNewMessage);
      socket.on('new-message', handleNewMessage);
      socket.on('message-edited', handleMessageEdited);
      socket.on('message-deleted', handleMessageDeleted);

      // Cleanup function: Remove listeners when chat changes
      return () => {
        socket.emit('leave-chat', activeChat);
        // Remove the specific listeners for this chat
        socket.off('receive-message', handleNewMessage);
        socket.off('new-message', handleNewMessage);
        socket.off('message-edited', handleMessageEdited);
        socket.off('message-deleted', handleMessageDeleted);
      };
    }
  }, [activeChat, setMessages, addMessage, updateMessage, deleteMessage]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 dark:text-gray-400"
        >
          <p className="text-lg font-semibold">Select a chat to start</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-white dark:bg-gray-900"
    >
      <ChatHeader chatId={activeChat} />
      <MessageList chatId={activeChat} loading={loading} />
      <MessageInput chatId={activeChat} />
    </motion.div>
  );
}
