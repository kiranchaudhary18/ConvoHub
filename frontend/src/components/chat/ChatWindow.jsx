'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { motion } from 'framer-motion';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { getSocket, initializeSocket, onEvent, offEvent } from '@/lib/socket';
import api from '@/lib/api';

export default function ChatWindow() {
  const { activeChat, messages, setMessages, addMessage } = useChatStore();
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

      const handleNewMessage = (message) => {
        if (message.chatId === activeChat) {
          addMessage(activeChat, message);
        }
      };

      // Listen for both events for compatibility
      onEvent('receive-message', handleNewMessage);
      onEvent('new-message', handleNewMessage);

      return () => {
        socket.emit('leave-chat', activeChat);
        offEvent('receive-message', handleNewMessage);
        offEvent('new-message', handleNewMessage);
      };
    }
  }, [activeChat, setMessages, addMessage]);

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
