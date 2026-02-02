'use client';

import { motion } from 'framer-motion';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { formatDate, truncateMessage, getInitials } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

export default function ChatList({ searchQuery, showGroups = false }) {
  const { chats, activeChat, setActiveChat } = useChatStore();
  const { user: currentUser } = useAuthStore();

  // Filter chats based on type (groups or one-to-one)
  const filteredChats = (chats || []).filter((chat) => {
    // Filter by group type
    if (showGroups && !chat.isGroup) return false;
    if (!showGroups && chat.isGroup) return false;
    
    // For one-to-one chats, get the other member's name
    let name = '';
    if (chat.isGroup) {
      name = chat.name || 'Group';
    } else {
      // Find the other member (not current user)
      const otherMember = chat.members?.find(m => m._id !== currentUser?._id);
      name = otherMember?.name || 'Unknown';
    }
    
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getOtherMember = (chat) => {
    if (chat.isGroup) return null;
    return chat.members?.find(m => m._id !== currentUser?._id);
  };

  return (
    <div className="space-y-2 p-4">
      {/* Header */}
      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
          {showGroups ? '👥 Groups' : '💬 Chats'}: {filteredChats.length}
        </p>
      </div>

      {filteredChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
          <MessageCircle size={40} className="mb-2 opacity-50" />
          <p className="text-sm">
            {showGroups ? 'No groups yet' : 'No chats yet'}
          </p>
          <p className="text-xs mt-1">
            {showGroups ? 'Create a new group to start' : 'Start chatting with users'}
          </p>
        </div>
      ) : (
        filteredChats.map((chat, index) => {
          const otherMember = getOtherMember(chat);
          const displayName = chat.isGroup ? chat.name : otherMember?.name || 'Unknown';
          const isOnline = !chat.isGroup && otherMember?.isOnline;
          
          return (
            <motion.button
              key={chat._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveChat(chat._id)}
              className={`w-full p-3 rounded-lg transition-all ${
                activeChat === chat._id
                  ? 'bg-blue-500 text-white'
                  : isOnline
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-900 dark:text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                      activeChat === chat._id ? 'bg-white text-blue-500' : 'bg-gradient-primary text-white'
                    }`}
                  >
                    {getInitials(displayName)}
                  </div>
                  {isOnline && activeChat !== chat._id && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{displayName}</p>
                    {chat.isGroup && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        activeChat === chat._id ? 'bg-blue-400' : 'bg-purple-500 text-white'
                      }`}>
                        {chat.members?.length || 0}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs truncate ${
                    activeChat === chat._id ? 'opacity-75' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {truncateMessage(chat.lastMessage?.text || 'No messages yet')}
                  </p>
                </div>
                {chat.lastMessage && (
                  <span className={`text-xs whitespace-nowrap ${
                    activeChat === chat._id ? 'opacity-75' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatDate(chat.lastMessage.createdAt)}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })
      )}
    </div>
  );
}
