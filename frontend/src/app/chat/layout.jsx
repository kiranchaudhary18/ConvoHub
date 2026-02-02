'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { useUIStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';
import { initializeSocket, getSocket, onEvent, offEvent } from '@/lib/socket';
import Sidebar from '@/components/chat/Sidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import { Loader } from 'lucide-react';
import api from '@/lib/api';

export default function ChatLayout({ children }) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { chats, setChats } = useChatStore();
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
        console.log('Users response:', response.data);
        console.log('Users count:', response.data.users?.length || 0);
        console.log('Total users:', response.data.totalUsers);
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

    // Setup socket listeners
    if (socket) {
      const handleUserOnline = (data) => {
        setUserOnline(data.userId);
      };

      const handleUserOffline = (data) => {
        setUserOffline(data.userId);
      };

      onEvent('user-online', handleUserOnline);
      onEvent('user-offline', handleUserOffline);

      return () => {
        clearInterval(userRefreshInterval);
        offEvent('user-online', handleUserOnline);
        offEvent('user-offline', handleUserOffline);
      };
    }

    return () => {
      clearInterval(userRefreshInterval);
    };
  }, [token, router, setChats, setUsers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
