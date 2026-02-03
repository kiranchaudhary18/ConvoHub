'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, LogOut, Moon, Sun, Plus, Search } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';
import ChatList from './ChatList';
import UsersList from './UsersList';
import GroupModal from './GroupModal';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getInitials } from '@/lib/utils';

export default function Sidebar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode, activeTab, setActiveTab, sidebarOpen, toggleSidebar, setShowGroupModal } = useUIStore();
  const { chats } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/login');
    toast.success('Logged out successfully');
  };

  return (
    <>
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`${sidebarOpen ? 'w-80' : 'w-20'} bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            {sidebarOpen && <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">ConvoHub</h1>}
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <Menu size={20} />
            </button>
          </div>

          {sidebarOpen && (
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Tabs */}
        {sidebarOpen && (
          <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
            {['chats', 'groups'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg font-medium transition capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {sidebarOpen && (
            <>
              {activeTab === 'chats' && <ChatList searchQuery={searchQuery} showGroups={false} />}
              {activeTab === 'groups' && <ChatList searchQuery={searchQuery} showGroups={true} />}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {sidebarOpen && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGroupModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-primary hover:shadow-lg text-white py-2 rounded-lg font-medium transition"
              >
                <Plus size={20} />
                New Group
              </motion.button>

              <div className="flex gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="flex-1 p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition flex items-center justify-center"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                  {getInitials(user?.name || 'U')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition"
              >
                <LogOut size={20} />
                Logout
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      <GroupModal />
    </>
  );
}
