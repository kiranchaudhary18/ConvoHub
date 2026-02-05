'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { useUIStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';
import { initializeSocket } from '@/lib/socket';
import Sidebar from '@/components/chat/Sidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import { Loader } from 'lucide-react';
import api from '@/lib/api';

export default function ChatLayout({ children }) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { chats, setChats, addChatToList, removeChatFromList, updateChatInList, setActiveChat } = useChatStore();
  const { setUsers, setUserOnline, setUserOffline } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // Initialize socket
    const socket = initializeSocket();
    
    if (!socket) {
      console.log('❌ Socket initialization failed');
    } else {
      console.log('✅ Socket initialized successfully');
    }

    // Fetch chats
    const fetchChats = async () => {
      try {
        const response = await api.get('/chats');
        const chatsData = response.data?.chats || response.data?.data || [];
        setChats(chatsData);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch users
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data.users || response.data.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    fetchChats();
    fetchUsers();

    // Refresh users every 30 seconds to keep online status updated
    const userRefreshInterval = setInterval(fetchUsers, 30000);

    // Setup socket listeners for user status and new chats
    if (socket) {
      const handleUserOnline = (data) => {
        setUserOnline(data.userId);
      };

      const handleUserOffline = (data) => {
        setUserOffline(data.userId);
      };

      // Listen for new one-to-one chats
      const handleNewChat = (data) => {
        if (data.chat) {
          addChatToList(data.chat);
        }
      };

      // Listen for new groups
      const handleNewGroup = (data) => {
        if (data.chat) {
          addChatToList(data.chat);
        }
      };

      // Handle member left group
      const handleMemberLeftGroup = (data) => {
        if (data.chat) {
          updateChatInList(data.chat);
        }
      };

      // Handle user left group
      const handleLeftGroup = (data) => {
        if (data.chat) {
          updateChatInList(data.chat);
        }
      };

      // Handle member removed from group
      const handleMemberRemovedFromGroup = (data) => {
        if (data.chat) {
          updateChatInList(data.chat);
        }
      };

      // Handle removed from group
      const handleRemovedFromGroup = (data) => {
        if (data.chat) {
          updateChatInList(data.chat);
        }
      };

      // Handle admin transferred
      const handleAdminTransferred = (data) => {
        if (data.chat) {
          updateChatInList(data.chat);
        }
      };

      // Handle group deleted
      const handleGroupDeleted = (data) => {
        removeChatFromList(data.chatId);
        // If user was in this chat, clear active chat
        setActiveChat(null);
      };

      socket.on('user-online', handleUserOnline);
      socket.on('user-offline', handleUserOffline);
      socket.on('new-chat', handleNewChat);
      socket.on('new-group', handleNewGroup);
      socket.on('member-left-group', handleMemberLeftGroup);
      socket.on('left-group', handleLeftGroup);
      socket.on('member-removed-from-group', handleMemberRemovedFromGroup);
      socket.on('removed-from-group', handleRemovedFromGroup);
      socket.on('admin-transferred', handleAdminTransferred);
      socket.on('group-deleted', handleGroupDeleted);

      return () => {
        clearInterval(userRefreshInterval);
        socket.off('user-online', handleUserOnline);
        socket.off('user-offline', handleUserOffline);
        socket.off('new-chat', handleNewChat);
        socket.off('new-group', handleNewGroup);
        socket.off('member-left-group', handleMemberLeftGroup);
        socket.off('left-group', handleLeftGroup);
        socket.off('member-removed-from-group', handleMemberRemovedFromGroup);
        socket.off('removed-from-group', handleRemovedFromGroup);
        socket.off('admin-transferred', handleAdminTransferred);
        socket.off('group-deleted', handleGroupDeleted);
      };
    }

    return () => {
      clearInterval(userRefreshInterval);
    };
  }, [token, router, setChats, setUsers, setUserOnline, setUserOffline, addChatToList, removeChatFromList, updateChatInList, setActiveChat]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
