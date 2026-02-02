'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { formatTime } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';

export default function MessageList({ chatId, loading }) {
  const { messages } = useChatStore();
  const { user: currentUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  const chatMessages = messages[chatId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

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
          const isSent = message.senderId === currentUser?._id;
          const isFile = message.type !== 'text' || message.fileUrl;

          return (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-3 ${isSent ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl group ${
                  isSent
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                }`}
              >
                {isFile && message.fileUrl ? (
                  <div className="space-y-2">
                    {message.type === 'image' || message.fileUrl.startsWith('data:image/') || message.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={message.fileUrl}
                        alt="Shared image"
                        className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition"
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
                  <p className="break-words">{message.text}</p>
                )}
                <div
                  className={`flex items-center justify-between gap-2 mt-1 text-xs ${
                    isSent ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <span>{formatTime(message.createdAt)}</span>
                  {isSent &&
                    (message.seenBy?.length > 1 ? (
                      <CheckCheck size={14} />
                    ) : (
                      <Check size={14} />
                    ))}
                </div>
              </div>
            </motion.div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
