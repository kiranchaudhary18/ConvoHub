'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';
import { useUserStore } from '@/stores/userStore';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getInitials } from '@/lib/utils';

export default function GroupModal() {
  const { showGroupModal, setShowGroupModal } = useUIStore();
  const { selectedUsers, setSelectedUsers, addSelectedUser, removeSelectedUser, setChats } = useChatStore();
  const { users } = useUserStore();
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredUsers = (users || []).filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
      toast.error('Please enter a group name and select members');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/chats/group', {
        name: groupName,
        memberIds: selectedUsers.map((u) => u._id),
      });

      // Refresh chats
      const chatsResponse = await api.get('/chats');
      setChats(chatsResponse.data.chats || chatsResponse.data.data || []);

      toast.success('Group created successfully');
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowGroupModal(false);
    setGroupName('');
    setSearchQuery('');
    setSelectedUsers([]);
  };

  return (
    <AnimatePresence>
      {showGroupModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">Create Group</h2>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                />
              </div>

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected Members ({selectedUsers.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <motion.div
                        key={user._id}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{user.name}</span>
                        <button
                          onClick={() => removeSelectedUser(user._id)}
                          className="hover:text-red-600 transition"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Users */}
              <div>
                <label className="block text-sm font-medium mb-2">Add Members</label>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                  />
                </div>

                {/* Users List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUsers.some((u) => u._id === user._id);

                    return (
                      <motion.button
                        key={user._id}
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        onClick={() => {
                          if (isSelected) {
                            removeSelectedUser(user._id);
                          } else {
                            addSelectedUser(user);
                          }
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                          isSelected ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-xs">
                          {getInitials(user.name)}
                        </div>
                        <span className="flex-1 text-left font-medium">{user.name}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                            ✓
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateGroup}
                disabled={loading || !groupName.trim() || selectedUsers.length === 0}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition font-medium"
              >
                {loading ? 'Creating...' : 'Create'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
