'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { getInitials, formatLastSeen } from '@/lib/utils';

export default function ChatHeader({ chatId }) {
  const { chats, activeChat } = useChatStore();
  const { user: currentUser } = useAuthStore();
  const [headerData, setHeaderData] = useState(null);

  useEffect(() => {
    // Get the current chat
    const chat = (chats || []).find((c) => c._id === chatId);
    
    if (!chat) {
      setHeaderData(null);
      return;
    }

    // For one-to-one chats, find the other user (not the current user)
    const otherUser = chat.isGroup ? null : chat.members.find((m) => m._id !== currentUser?._id);
    
    // Set header data
    const displayName = chat.isGroup ? chat.name : (otherUser?.name || 'User');
    const displayAvatar = displayName || 'CH';
    const isOnline = otherUser?.isOnline ?? false;
    const lastSeen = otherUser?.lastSeen;

    setHeaderData({
      displayName,
      displayAvatar,
      isOnline,
      lastSeen,
      isGroup: chat.isGroup,
      memberCount: chat.members?.length
    });
  }, [chatId, chats, currentUser]);
  
  const getStatusText = () => {
    if (!headerData) return '';
    if (headerData.isGroup) {
      return `${headerData.memberCount} members`;
    }
    if (headerData.isOnline) {
      return '🟢 Online';
    }
    return `⚪ Last seen ${formatLastSeen(headerData.lastSeen)}`;
  };

  if (!headerData) return null;

  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
          {getInitials(headerData.displayAvatar)}
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">{headerData.displayName}</h2>
          <p className={`text-sm font-medium ${
            headerData.isOnline 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {getStatusText()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
