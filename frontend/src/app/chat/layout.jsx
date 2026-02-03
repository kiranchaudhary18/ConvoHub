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
  const { chats, setChats, addChatToList } = useChatStore();
  const { setUsers, setUserOnline, setUserOffline } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // Initialize socket
    const socket = initializeSocket();

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

      socket.on('user-online', handleUserOnline);
      socket.on('user-offline', handleUserOffline);
      socket.on('new-chat', handleNewChat);
      socket.on('new-group', handleNewGroup);

      return () => {
        clearInterval(userRefreshInterval);
        socket.off('user-online', handleUserOnline);
        socket.off('user-offline', handleUserOffline);
        socket.off('new-chat', handleNewChat);
        socket.off('new-group', handleNewGroup);
      };
    }

    return () => {
      clearInterval(userRefreshInterval);
    };
  }, [token, router, setChats, setUsers, setUserOnline, setUserOffline, addChatToList]);

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
