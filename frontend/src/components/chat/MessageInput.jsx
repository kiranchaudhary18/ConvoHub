'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useChatStore } from '@/stores/chatStore';
import { emitEvent, getSocket } from '@/lib/socket';

export default function MessageInput({ chatId }) {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const { addMessage } = useChatStore();
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await api.post('/messages', {
        text: message,
        chatId,
        type: 'text',
      });

      addMessage(chatId, response.data.data);
      setMessage('');

      // Note: Message is already saved via REST API, so we don't need to emit Socket.IO event
      // The server will handle broadcasting to other connected users
      // const socket = getSocket();
      // if (socket) {
      //   emitEvent('send-message', {
      //     chatId,
      //     text: message,
      //   });
      // }

      inputRef.current?.focus();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleTyping = () => {
    const socket = getSocket();
    if (socket) {
      emitEvent('typing', { chatId });
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('chatId', chatId);

        const response = await api.post('/messages/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        addMessage(chatId, response.data.data);
        toast.success('File sent successfully');
      }
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <motion.form
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      onSubmit={handleSend}
      className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800"
    >
      <div className="flex items-end gap-3">
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
          multiple
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
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition ml-2"
          >
            <Smile size={20} />
          </motion.button>
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
    </motion.form>
  );
}
