'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '@/lib/utils';
import { Check, CheckCheck, Trash2, Edit2, X, Smile, Reply, Pin } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { getSocket } from '@/lib/socket';

export default function MessageList({ chatId, loading, onReply, searchQuery, searchResults }) {
  const { messages, updateMessage, deleteMessage } = useChatStore();
  const { user: currentUser } = useAuthStore();
  const messagesEndRef = useRef(null);
  const deleteMenuRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  const chatMessages = messages[chatId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Listen for typing indicators
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleUserTyping = ({ userId, isTyping }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    };

    socket.on('user-typing', handleUserTyping);

    return () => {
      socket.off('user-typing', handleUserTyping);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Close delete menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deleteMenuRef.current && !deleteMenuRef.current.contains(event.target)) {
        setShowDeleteMenu(null);
        setActiveMessageId(null);
      }
    };

    if (showDeleteMenu || activeMessageId) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [showDeleteMenu, activeMessageId]);

  const handleEditClick = (message) => {
    setEditingId(message._id);
    setEditText(message.text);
  };

  const handleSaveEdit = async (messageId) => {
    if (!editText.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    if (editText === chatMessages.find(m => m._id === messageId)?.text) {
      setEditingId(null);
      return;
    }

    try {
      const response = await api.put(`/messages/${messageId}/edit`, { text: editText });
      updateMessage(chatId, messageId, response.data.data);
      setEditingId(null);
      toast.success('Message edited');
    } catch (error) {
      toast.error('Failed to edit message');
      console.error('Edit error:', error);
    }
  };

  const handleDeleteMessage = async (messageId, deleteForEveryone = false) => {
    try {
      setShowDeleteMenu(null);
      
      const endpoint = deleteForEveryone 
        ? `/messages/${messageId}/delete-for-everyone`
        : `/messages/${messageId}/delete-for-me`;
      
      await api.delete(endpoint);
      
      if (deleteForEveryone) {
        // Update message in store to show as deleted
        updateMessage(chatId, messageId, { 
          isDeleted: true, 
          deletedAt: new Date(),
          text: 'This message was deleted' 
        });
      } else {
        // Remove message from local view only
        deleteMessage(chatId, messageId);
      }
      
      toast.success(deleteForEveryone ? 'Message deleted for everyone' : 'Message deleted for you');
    } catch (error) {
      toast.error('Failed to delete message');
      console.error('Delete error:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  // Long press handlers for mobile
  const handleTouchStart = (messageId) => {
    const timer = setTimeout(() => {
      setActiveMessageId(messageId);
      setHoveredMessageId(messageId);
      // Vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms long press
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      const response = await api.post(`/messages/${messageId}/react`, { emoji });
      updateMessage(chatId, messageId, { reactions: response.data.data });
      setShowReactionPicker(null);
      toast.success('Reaction added');
    } catch (error) {
      toast.error('Failed to add reaction');
      console.error('Reaction error:', error);
    }
  };

  const handleRemoveReaction = async (messageId) => {
    try {
      const response = await api.delete(`/messages/${messageId}/react`);
      updateMessage(chatId, messageId, { reactions: response.data.data });
      toast.success('Reaction removed');
    } catch (error) {
      toast.error('Failed to remove reaction');
      console.error('Remove reaction error:', error);
    }
  };

  // Highlight search text
  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-300 dark:bg-yellow-600">{part}</mark>
      ) : (
        part
      )
    );
  };

  // Check if message is in search results
  const isSearchResult = (messageId) => {
    return searchResults && searchResults.some(msg => msg._id === messageId);
  };

  const handleTogglePin = async (messageId) => {
    try {
      const response = await api.put(`/messages/${messageId}/pin`);
      updateMessage(chatId, messageId, response.data.data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to pin/unpin message');
      console.error('Pin error:', error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 overscroll-contain">
      {/* Pinned Messages Bar */}
      {chatMessages.filter(m => m.isPinned).length > 0 && (
        <div className="sticky top-0 z-20 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Pin size={16} className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold mb-1">Pinned Messages ({chatMessages.filter(m => m.isPinned).length})</p>
              {chatMessages.filter(m => m.isPinned).slice(0, 2).map(msg => (
                <p key={msg._id} className="text-xs truncate">{msg.text}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">Loading messages...</p>
        </div>
      ) : chatMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full px-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base text-center">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        chatMessages.map((message, index) => {
          // Extract sender ID - handle both string and object formats
          const senderIdStr = typeof message.senderId === 'string' 
            ? message.senderId 
            : message.senderId?._id || message.senderId?.id;
          
          // Get current user ID
          const currentUserIdStr = typeof currentUser === 'string'
            ? currentUser
            : currentUser?._id || currentUser?.id;
          
          // Determine if message is sent by current user
          const isSent = !!(senderIdStr && currentUserIdStr && senderIdStr === currentUserIdStr);
          
          const isFile = message.type !== 'text' || message.fileUrl;
          const isEditing = editingId === message._id;
          const isDeleted = message.isDeleted;

          return (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-2 md:gap-3 ${isSent ? 'justify-end' : 'justify-start'}`}
              onMouseEnter={() => setHoveredMessageId(message._id)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              <div className="relative group max-w-[85%] sm:max-w-[75%] md:max-w-md lg:max-w-lg">
                {/* Pin indicator */}
                {message.isPinned && (
                  <div className="absolute -top-2 -left-2 z-10">
                    <Pin size={14} className="text-amber-500 fill-amber-500" />
                  </div>
                )}
                
                <div
                  className={`px-3 py-2 md:px-4 md:py-3 rounded-2xl ${
                    isSent
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                  } ${isDeleted ? 'italic opacity-50' : ''} ${
                    isSearchResult(message._id) ? 'ring-2 ring-yellow-400' : ''
                  } ${message.isPinned ? 'ring-2 ring-amber-400' : ''}`}
                  onTouchStart={() => !isDeleted && handleTouchStart(message._id)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                >
                  {/* Reply preview */}
                  {message.replyTo && !isDeleted && (
                    <div className="mb-2 p-2 bg-black/10 dark:bg-white/10 rounded border-l-2 border-current">
                      <p className="text-xs opacity-75 font-semibold">
                        {message.replyTo.senderId?.name || 'User'}
                      </p>
                      <p className="text-xs opacity-75 truncate">
                        {message.replyTo.text}
                      </p>
                    </div>
                  )}

                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className={`w-full px-3 py-2 rounded border ${
                          isSent
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500 text-gray-900 dark:text-white'
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(message._id)}
                          className={`flex-1 px-2 py-1 rounded text-sm font-medium transition ${
                            isSent
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-gray-400 dark:bg-gray-500 hover:bg-gray-500 dark:hover:bg-gray-600'
                          }`}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className={`flex-1 px-2 py-1 rounded text-sm font-medium transition ${
                            isSent
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-gray-400 dark:bg-gray-500 hover:bg-gray-500 dark:hover:bg-gray-600'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : isFile && message.fileUrl && !isDeleted ? (
                    <div className="space-y-2">
                      {message.type === 'image' || message.fileUrl.startsWith('data:image/') || message.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img
                          src={message.fileUrl}
                          alt="Shared image"
                          className="max-w-xs max-h-80 rounded-lg cursor-pointer hover:opacity-90 transition object-cover"
                          onClick={() => window.open(message.fileUrl, '_blank')}
                        />
                      ) : (
                        <a
                          href={message.fileUrl}
                          download={message.fileName}
                          className={`flex items-center gap-2 p-3 rounded-lg ${
                            isSent
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                          } transition`}
                        >
                          <span className="text-2xl">📎</span>
                          <span className="truncate">{message.fileName || 'Download File'}</span>
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="break-words">
                      {isDeleted 
                        ? 'This message was deleted' 
                        : searchQuery 
                          ? highlightText(message.text, searchQuery)
                          : message.text
                      }
                    </p>
                  )}
                  <div
                    className={`flex items-center justify-between gap-2 mt-1 text-xs ${
                      isSent ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span>{formatTime(message.createdAt)}</span>
                      {message.isEdited && <span className="italic">(edited)</span>}
                    </div>
                    {isSent &&
                      (message.seenBy?.length > 1 ? (
                        <CheckCheck size={14} />
                      ) : (
                        <Check size={14} />
                      ))}
                  </div>
                  
                  {/* Reactions display */}
                  {message.reactions && message.reactions.length > 0 && !isDeleted && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(
                        message.reactions.reduce((acc, r) => {
                          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([emoji, count]) => {
                        const userReacted = message.reactions.some(
                          r => r.emoji === emoji && (r.userId._id || r.userId) === currentUserIdStr
                        );
                        return (
                          <button
                            key={emoji}
                            onClick={() => userReacted ? handleRemoveReaction(message._id) : handleReaction(message._id, emoji)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition ${
                              userReacted
                                ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                                : 'bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500'
                            }`}
                          >
                            <span>{emoji}</span>
                            <span className="text-[10px] font-semibold">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Action buttons - Show on hover (desktop) or long press (mobile) */}
                {(!isDeleted && (hoveredMessageId === message._id || activeMessageId === message._id || isEditing || showDeleteMenu === message._id || showReactionPicker === message._id)) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute -top-10 ${isSent ? 'right-0' : 'left-0'} flex gap-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-1 z-10`}
                  >
                    {/* Reaction button - for all messages */}
                    <div className="relative">
                      <button
                        onClick={() => setShowReactionPicker(showReactionPicker === message._id ? null : message._id)}
                        title="React"
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                      >
                        <Smile size={16} className="text-yellow-500" />
                      </button>
                      
                      {/* Reaction picker */}
                      {showReactionPicker === message._id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-2 z-50 flex gap-1"
                        >
                          {quickReactions.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(message._id, emoji)}
                              className="text-2xl hover:scale-125 transition-transform"
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>

                    {/* Pin button - for all messages */}
                    <button
                      onClick={() => handleTogglePin(message._id)}
                      title={message.isPinned ? "Unpin message" : "Pin message"}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                    >
                      <Pin size={16} className={message.isPinned ? "text-amber-500 fill-amber-500" : "text-gray-500"} />
                    </button>

                    {/* Reply button - for all messages */}
                    <button
                      onClick={() => onReply && onReply(message)}
                      title="Reply"
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                    >
                      <Reply size={16} className="text-green-500" />
                    </button>

                    {/* Edit button - only for sent messages */}
                    {isSent && !message.isEdited ? (
                      <button
                        onClick={() => handleEditClick(message)}
                        title="Edit message"
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                      >
                        <Edit2 size={16} className="text-blue-500" />
                      </button>
                    ) : isSent && message.isEdited ? (
                      <div className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                        Can't edit
                      </div>
                    ) : null}
                    
                    {/* Delete button - for all messages */}
                    <div className="relative" ref={showDeleteMenu === message._id ? deleteMenuRef : null}>
                      <button
                        onClick={() => setShowDeleteMenu(showDeleteMenu === message._id ? null : message._id)}
                        title="Delete options"
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                      
                      {/* Delete dropdown menu */}
                      {showDeleteMenu === message._id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-50 min-w-[200px]"
                        >
                          <button
                            onClick={() => handleDeleteMessage(message._id, false)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            Delete for Me
                          </button>
                          {isSent && (
                            <button
                              onClick={() => handleDeleteMessage(message._id, true)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition flex items-center gap-2 border-t border-gray-200 dark:border-gray-600"
                            >
                              <Trash2 size={14} />
                              Delete for Everyone
                            </button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })
      )}
      
      {/* Typing Indicator */}
      {typingUsers.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex justify-start"
        >
          <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-none">
            <div className="flex gap-1">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
