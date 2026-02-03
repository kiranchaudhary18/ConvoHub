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

  // Debug log
  if (chats && chats.length > 0) {
    console.log('ChatList Debug - First chat members:', {
      chatId: chats[0]._id,
      isGroup: chats[0].isGroup,
      memberCount: chats[0].members?.length,
      members: chats[0].members?.map(m => ({
        _id: m._id,
        name: m.name,
        type: typeof m,
        isString: typeof m === 'string'
      })),
      currentUserId: currentUser?._id,
      currentUserName: currentUser?.name
    });
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
      // Filter by group type
      if (showGroups && !chat.isGroup) return false;
      if (!showGroups && chat.isGroup) return false;
      
      // For one-to-one chats, get the other member's name
      let name = '';
      if (chat.isGroup) {
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

  // For Chats tab, also show available users to chat with
  let displayList = filteredChats;
  if (!showGroups) {
    // Get users that aren't already in chats (excluding current user)
    const usersInChats = new Set(
      chats
        .filter(chat => !chat.isGroup)
        .flatMap(chat => chat.members || [])
        .map(member => (typeof member === 'object' ? member._id : member))
    );

    const availableUsers = (users || [])
      .filter(user => 
        user._id !== currentUser?._id && 
        !usersInChats.has(user._id) &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(user => ({
        _id: `temp-${user._id}`,
        tempUser: user,
        isTemp: true,
        members: [currentUser, user],
        isGroup: false,
        name: user.name,
        lastMessage: null,
        createdAt: new Date(),
      }));

    displayList = [...filteredChats, ...availableUsers];
  }

  return (
    <div className="space-y-2 p-4">
      {/* Header */}
      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
          {showGroups 
            ? `👥 Groups: ${filteredChats.length}` 
            : `💬 Chats: ${filteredChats.length} | 👤 New: ${displayList.length - filteredChats.length}`
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
          const otherMember = chat.tempUser || getOtherMember(chat);
          const displayName = chat.isGroup ? chat.name : otherMember?.name || 'Unknown';
          const isOnline = !chat.isGroup && otherMember?.isOnline;
          const isNewUser = chat.isTemp;
          
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
                  : isNewUser
                  ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-900 dark:text-white'
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
                  {isNewUser && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-purple-500 rounded-full border-2 border-white dark:border-gray-700"></div>
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
                    {isNewUser && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500 text-white">
                        New
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
