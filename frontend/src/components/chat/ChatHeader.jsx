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
    
    // Debug log
    console.log('ChatHeader Debug:', {
      chatId,
      activeChat,
      chatFound: !!chat,
      isGroup: chat?.isGroup,
      members: chat?.members?.map(m => ({ _id: m._id, name: m.name })),
      currentUserId: currentUser?._id,
      otherUser: otherUser ? { _id: otherUser._id, name: otherUser.name } : null
    });

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
      className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold">
          {getInitials(headerData.displayAvatar)}
        </div>
        <div>
          <h2 className="font-bold text-lg">{headerData.displayName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {getStatusText()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
