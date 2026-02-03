'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { getInitials } from '@/lib/utils';
import { MessageCircle, Users } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useChatStore } from '@/stores/chatStore';
import { useUIStore } from '@/stores/uiStore';
import { getSocket, initializeSocket } from '@/lib/socket';

export default function UsersList({ searchQuery }) {
  const { users } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const { setChats, setActiveChat } = useChatStore();
  const { setActiveTab, closeMobileSidebar } = useUIStore();

  // Filter out current user from the list
  const otherUsers = (users || []).filter(u => u._id !== currentUser?._id);

  const filteredUsers = otherUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count online users
  const onlineCount = otherUsers.filter((u) => u.isOnline).length;
  const totalCount = otherUsers.length;

  const handleStartChat = async (userId) => {
    try {
      // Create or get existing chat
      const response = await api.post('/chats/one-to-one', { recipientId: userId });
      const chat = response.data.chat;
      
      // Refresh chats list
      const chatsResponse = await api.get('/chats');
      setChats(chatsResponse.data.chats || chatsResponse.data.data || []);
      
      // Set active chat and switch to chats tab
      setActiveChat(chat._id);
      setActiveTab('chats');
      closeMobileSidebar();

      // Ensure socket is connected and join the chat room
      const socket = initializeSocket();
      if (socket) {
        socket.emit('join-chat', chat._id);
      }
      
      toast.success('Chat opened');
    } catch (error) {
      console.error('Start chat error:', error);
      toast.error('Failed to start chat');
    }
  };

  return (
    <div className="space-y-2 p-4">
      {/* User Stats Header */}
      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
          👥 {totalCount} users · 🟢 {onlineCount} online
        </p>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
          <Users size={40} className="mb-2 opacity-50" />
          <p className="text-sm">
            {totalCount === 0
              ? 'No other users registered yet'
              : searchQuery
              ? 'No users match your search'
              : 'No users available'}
          </p>
        </div>
      ) : (
        filteredUsers.map((u, index) => (
          <motion.div
            key={u._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center justify-between gap-3 p-3 rounded-lg transition cursor-pointer ${
              u.isOnline
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => handleStartChat(u._id)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-10 h-10 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold">
                  {getInitials(u.name)}
                </div>
                {u.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-700 animate-pulse"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${u.isOnline ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                  {u.name}
                </p>
                <p className={`text-xs ${u.isOnline ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  {u.isOnline ? '🟢 Online' : '⚪ Offline'}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 text-white rounded-lg transition flex-shrink-0 ${
                u.isOnline
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              <MessageCircle size={18} />
            </motion.button>
          </motion.div>
        ))
      )}
    </div>
  );
}
