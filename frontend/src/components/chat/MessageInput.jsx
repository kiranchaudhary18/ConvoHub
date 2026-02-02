'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile, Paperclip, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { emitEvent, getSocket } from '@/lib/socket';
import EmojiPicker from 'emoji-picker-react';

export default function MessageInput({ chatId }) {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const { addMessage } = useChatStore();
  const { user: currentUser } = useAuthStore();
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await api.post('/messages', {
        text: message,
        chatId,
        type: 'text',
      });

      console.log('📤 Message sent:', {
        response: response.data,
        currentUser,
        chatId
      });

      addMessage(chatId, response.data.data);
      setMessage('');
      inputRef.current?.focus();
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Send message error:', error);
    }
  };

  const handleTyping = () => {
    const socket = getSocket();
    if (socket) {
      emitEvent('typing', { chatId });
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    inputRef.current?.focus();
    setShowEmojiPicker(false);
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0]; // Only handle first file
    setSelectedFile(file);
    setCaption(''); // Reset caption

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendWithFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('chatId', chatId);
      if (caption.trim()) {
        formData.append('caption', caption);
      }

      const response = await api.post('/messages/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      addMessage(chatId, response.data.data);
      toast.success('File sent successfully');

      // Clear preview and caption
      setSelectedFile(null);
      setFilePreview(null);
      setCaption('');
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleCancelFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setCaption('');
  };

  return (
    <motion.form
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      onSubmit={handleSend}
      className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      {/* Image/File Preview Modal */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900"
        >
          <div className="space-y-3">
            {/* Preview Image */}
            {filePreview && (
              <div className="relative inline-block">
                <img
                  src={filePreview}
                  alt="Preview"
                  className="max-h-48 max-w-xs rounded-lg object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={handleCancelFile}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                  title="Remove"
                >
                  <X size={16} />
                </motion.button>
              </div>
            )}

            {/* File Name */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              📎 {selectedFile.name}
            </div>

            {/* Caption Input */}
            <div className="flex items-end gap-2">
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg outline-none dark:text-white text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleCancelFile}
                className="px-3 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-lg transition text-sm font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleSendWithFile}
                disabled={uploading}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition text-sm font-medium"
              >
                Send
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Regular Message Input */}
      {!selectedFile && (
        <div className="p-4">
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              ref={emojiPickerRef}
              className="absolute bottom-24 left-4 z-50"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme="dark"
                lazyLoadEmojis={true}
              />
            </motion.div>
          )}

          <div className="flex items-end gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition flex-shrink-0"
              title="Add emoji"
            >
              <Smile size={20} className={showEmojiPicker ? 'text-yellow-500' : ''} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 rounded-lg transition flex-shrink-0"
              title="Attach file or image"
            >
              <Paperclip size={20} />
            </motion.button>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            />

            <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              disabled={!message.trim()}
              className="p-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition flex-shrink-0"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      )}
    </motion.form>
  );
}
