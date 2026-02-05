'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { motion } from 'framer-motion';
import { getInitials, formatLastSeen } from '@/lib/utils';
import { Menu, ArrowLeft, Search, Users } from 'lucide-react';

export default function ChatHeader({ chatId, onSearchToggle }) {
  const { chats, activeChat, setActiveChat } = useChatStore();
  const { user: currentUser } = useAuthStore();
  const { toggleMobileSidebar, isMobileSidebarOpen, setShowGroupMembersModal } = useUIStore();
  const [headerData, setHeaderData] = useState(null);

  const handleBackClick = () => {
    // On mobile, close current chat to show sidebar
    setActiveChat(null);
  };

  const handleShowGroupMembers = () => {
    setShowGroupMembersModal(true);
  };

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
      className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800"
    >
      {/* Mobile back button */}
      <button
        onClick={handleBackClick}
        className="md:hidden p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition mr-2"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm md:text-lg shadow-md flex-shrink-0">
          {getInitials(headerData.displayAvatar)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base md:text-lg text-gray-900 dark:text-white truncate">{headerData.displayName}</h2>
          <p className={`text-xs md:text-sm font-medium truncate ${
            headerData.isOnline 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {getStatusText()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Group members button - only show for group chats */}
        {headerData.isGroup && (
          <button
            onClick={handleShowGroupMembers}
            className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition"
            title="Group members"
          >
            <Users size={20} />
          </button>
        )}

        {/* Search button */}
        <button
          onClick={onSearchToggle}
          className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition"
          title="Search messages"
        >
          <Search size={20} />
        </button>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition"
        >
          <Menu size={20} />
        </button>
      </div>
    </motion.div>
  );
}
