'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { Phone, Video, Info, MoreVertical } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function ChatHeader({ chatId }) {
  const { chats } = useChatStore();
  const chat = (chats || []).find((c) => c._id === chatId);
  const { user: currentUser } = useAuthStore();

  if (!chat) return null;

  const otherUser = chat.isGroup ? null : chat.members.find((m) => m._id !== currentUser?._id);
  const displayName = chat.isGroup ? chat.name : otherUser?.name;
  const isOnline = otherUser?.isOnline;

  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold">
          {getInitials(displayName || 'CH')}
        </div>
        <div>
          <h2 className="font-bold text-lg">{displayName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {chat.isGroup
              ? `${chat.members.length} members`
              : isOnline
              ? '🟢 Online'
              : '⚪ Offline'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <Phone size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <Video size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <Info size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <MoreVertical size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
}
