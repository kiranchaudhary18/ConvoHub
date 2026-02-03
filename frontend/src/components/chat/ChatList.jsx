'use client';

import { motion } from 'framer-motion';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { formatDate, truncateMessage, getInitials } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

export default function ChatList({ searchQuery, showGroups = false }) {
  const { chats, activeChat, setActiveChat } = useChatStore();
  const { user: currentUser } = useAuthStore();
  const { users } = useUserStore();

  // Debug: Log current state
  if (chats && chats.length > 0) {
    const groupChats = chats.filter(c => c.isGroup ?? (c.members?.length > 2));
    const oneToOneChats = chats.filter(c => !(c.isGroup ?? (c.members?.length > 2)));
    console.log(`📋 ChatList [showGroups=${showGroups}]: ${chats.length} total | ${groupChats.length} groups | ${oneToOneChats.length} one-to-one | search="${searchQuery}"`);
    if (showGroups && groupChats.length > 0) {
      console.log('   Groups:', groupChats.map(g => ({ name: g.name, members: g.members?.length, isGroup: g.isGroup })));
    }
  }

  const getOtherMember = (chat) => {
    if (chat.isGroup) return null;
    
    // Handle case where members might be IDs (strings) or objects
    const members = chat.members || [];
    
    for (let member of members) {
      const memberId = typeof member === 'object' && member?._id ? member._id : member;
      
      // If this is not the current user, return them
      if (memberId !== currentUser?._id) {
        // Return the member object if available, otherwise create one from the ID
        if (typeof member === 'object' && member?._id) {
          return member;
        } else {
          return { _id: memberId, name: 'User' };
        }
      }
    }
    
    return null;
  };

  // Filter chats based on type (groups or one-to-one)
  const filteredChats = (chats || [])
    .filter((chat) => {
      // Ensure isGroup is set (fallback for legacy data)
      const isGroup = chat.isGroup ?? (chat.members?.length > 2); // If isGroup not set, assume group if >2 members
      
      // Filter by group type
      if (showGroups && !isGroup) return false;
      if (!showGroups && isGroup) return false;
      
      // For one-to-one chats, get the other member's name
      let name = '';
      if (isGroup) {
        name = chat.name || 'Group';
      } else {
        // Find the other member (not current user)
        const otherMember = getOtherMember(chat);
        name = otherMember?.name || 'Unknown';
      }
      
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    // Sort by latest message timestamp (newest first)
    .sort((a, b) => {
      const timeA = new Date(a.lastMessage?.createdAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.lastMessage?.createdAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

  // Display only real chats
  const displayList = filteredChats;

  return (
    <div className="space-y-2 p-4">
      {/* Header */}
      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
          {showGroups 
            ? `👥 Groups: ${filteredChats.length}` 
            : `💬 Chats: ${filteredChats.length}`
          }
        </p>
      </div>

      {displayList.length === 0 ? (
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
        displayList.map((chat, index) => {
          // Ensure isGroup is set
          const isGroup = chat.isGroup ?? (chat.members?.length > 2);
          const otherMember = getOtherMember(chat);
          const displayName = isGroup ? chat.name : otherMember?.name || 'Unknown';
          const isOnline = !isGroup && otherMember?.isOnline;
          
          return (
            <motion.button
              key={chat._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
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
                    {isGroup && (
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
                    {chat.lastMessage 
                      ? truncateMessage(chat.lastMessage?.text || 'No messages yet')
                      : 'Start a conversation'}
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
