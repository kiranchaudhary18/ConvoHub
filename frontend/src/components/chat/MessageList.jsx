'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '@/lib/utils';
import { Check, CheckCheck, Trash2, Edit2, X } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function MessageList({ chatId, loading }) {
  const { messages, updateMessage, deleteMessage } = useChatStore();
  const { user: currentUser } = useAuthStore();
  const messagesEndRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [hoveredMessageId, setHoveredMessageId] = useState(null);

  const chatMessages = messages[chatId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

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

  const handleDeleteMessage = async (messageId) => {
    try {
      const confirmed = window.confirm('Delete this message?');
      if (!confirmed) return;

      await api.delete(`/messages/${messageId}`);
      deleteMessage(chatId, messageId);
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
      console.error('Delete error:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
        </div>
      ) : chatMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
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
              className={`flex gap-3 ${isSent ? 'justify-end' : 'justify-start'}`}
              onMouseEnter={() => setHoveredMessageId(message._id)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              <div className="relative group">
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    isSent
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                  } ${isDeleted ? 'italic opacity-50' : ''}`}
                >
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
                    <p className="break-words">{isDeleted ? 'This message was deleted' : message.text}</p>
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
                </div>

                {/* Edit/Delete buttons */}
                {isSent && !isDeleted && (hoveredMessageId === message._id || isEditing) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-10 right-0 flex gap-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-1"
                  >
                    {!message.isEdited ? (
                      <button
                        onClick={() => handleEditClick(message)}
                        title="Edit message"
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                      >
                        <Edit2 size={16} className="text-blue-500" />
                      </button>
                    ) : (
                      <div className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                        Can't edit
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteMessage(message._id)}
                      title="Delete message"
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
