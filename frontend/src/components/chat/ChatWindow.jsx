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
  const [replyingTo, setReplyingTo] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!activeChat) return;

    // Reset search when chat changes
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);

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

      const handleMessageReacted = (data) => {
        if (data.messageId) {
          updateMessage(activeChat, data.messageId, {
            reactions: data.reactions
          });
        }
      };

      const handleMessagePinned = (data) => {
        if (data.messageId) {
          updateMessage(activeChat, data.messageId, {
            isPinned: data.isPinned,
            pinnedAt: data.pinnedAt,
            pinnedBy: data.pinnedBy
          });
        }
      };

      // Listen for both 'receive-message' and 'new-message' events
      socket.on('receive-message', handleNewMessage);
      socket.on('new-message', handleNewMessage);
      socket.on('message-edited', handleMessageEdited);
      socket.on('message-deleted', handleMessageDeleted);
      socket.on('message-reacted', handleMessageReacted);
      socket.on('message-pinned', handleMessagePinned);

      // Cleanup function: Remove listeners when chat changes
      return () => {
        socket.emit('leave-chat', activeChat);
        // Remove the specific listeners for this chat
        socket.off('receive-message', handleNewMessage);
        socket.off('new-message', handleNewMessage);
        socket.off('message-edited', handleMessageEdited);
        socket.off('message-deleted', handleMessageDeleted);
        socket.off('message-reacted', handleMessageReacted);
        socket.off('message-pinned', handleMessagePinned);
      };
    }
  }, [activeChat, setMessages, addMessage, updateMessage, deleteMessage]);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim() || !activeChat) {
      setSearchResults([]);
      return;
    }

    const chatMessages = messages[activeChat] || [];
    const results = chatMessages.filter(msg => 
      msg.text && msg.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  }, [searchQuery, messages, activeChat]);

  if (!activeChat) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 dark:text-gray-400 px-4"
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
      className="w-full h-full md:flex-1 flex flex-col bg-white dark:bg-gray-900"
    >
      <ChatHeader chatId={activeChat} onSearchToggle={() => setShowSearch(!showSearch)} />
      
      {/* Search Bar */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
            autoFocus
          />
          {searchResults.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </p>
          )}
        </motion.div>
      )}

      <MessageList 
        chatId={activeChat} 
        loading={loading} 
        onReply={setReplyingTo}
        searchQuery={searchQuery}
        searchResults={searchResults}
      />
      <MessageInput chatId={activeChat} replyingTo={replyingTo} onCancelReply={() => setReplyingTo(null)} />
    </motion.div>
  );
}
