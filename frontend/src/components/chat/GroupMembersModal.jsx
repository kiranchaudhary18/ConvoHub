'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, UserMinus, LogOut, Crown, Trash2 } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getInitials } from '@/lib/utils';
import { getSocket } from '@/lib/socket';

export default function GroupMembersModal() {
  const { showGroupMembersModal, setShowGroupMembersModal } = useUIStore();
  const { activeChat, chats, setActiveChat, removeChatFromList, updateChatInList } = useChatStore();
  const { user: currentUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const chat = (chats || []).find((c) => c._id === activeChat);
  const isAdmin = chat?.admin?._id === currentUser?._id;
  const members = chat?.members || [];

  // Socket listeners for real-time updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.log('❌ Socket not available in GroupMembersModal');
      return;
    }

    console.log('🔌 Setting up socket listeners in GroupMembersModal for chat:', activeChat);
    console.log('🔌 Socket connected:', socket.connected);

    const handleMemberLeftGroup = (data) => {
      console.log('🔌 Received member-left-group event:', data);
      if (data.chatId === activeChat) {
        console.log('🔌 Updating chat list for member-left-group');
        updateChatInList(data.chat);
      }
    };

    const handleMemberRemovedFromGroup = (data) => {
      console.log('🔌 Received member-removed-from-group event:', data);
      if (data.chatId === activeChat) {
        console.log('🔌 Updating chat list for member-removed-from-group');
        updateChatInList(data.chat);
      }
    };

    const handleRemovedFromGroup = (data) => {
      console.log('🔌 Received removed-from-group event:', data);
      if (data.chatId === activeChat) {
        console.log('🔌 User was removed from group - updating UI');
        updateChatInList(data.chat);
        if (data.removedBy === currentUser?._id) {
          console.log('🔌 Current user was removed - closing modal and clearing active chat');
          setShowGroupMembersModal(false);
          setActiveChat(null);
        }
      }
    };

    const handleLeftGroup = (data) => {
      console.log('🔌 Received left-group event:', data);
      if (data.chatId === activeChat) {
        console.log('🔌 User left group - updating UI');
        updateChatInList(data.chat);
        console.log('🔌 Closing modal and clearing active chat');
        setShowGroupMembersModal(false);
        setActiveChat(null);
      }
    };

    const handleAdminTransferred = (data) => {
      console.log('🔌 Received admin-transferred event:', data);
      if (data.chatId === activeChat) {
        console.log('🔌 Admin transferred - updating chat list');
        updateChatInList(data.chat);
      }
    };

    const handleGroupDeleted = (data) => {
      console.log('🔌 Received group-deleted event:', data);
      if (data.chatId === activeChat) {
        console.log('🔌 Group deleted - removing from chat list');
        removeChatFromList(activeChat);
        console.log('🔌 Closing modal and clearing active chat');
        setShowGroupMembersModal(false);
        setActiveChat(null);
      }
    };

    // Set up socket listeners
    socket.on('member-left-group', handleMemberLeftGroup);
    socket.on('member-removed-from-group', handleMemberRemovedFromGroup);
    socket.on('removed-from-group', handleRemovedFromGroup);
    socket.on('left-group', handleLeftGroup);
    socket.on('admin-transferred', handleAdminTransferred);
    socket.on('group-deleted', handleGroupDeleted);

    console.log('🔌 Socket listeners set up successfully');

    return () => {
      console.log('🔌 Cleaning up socket listeners in GroupMembersModal');
      socket.off('member-left-group', handleMemberLeftGroup);
      socket.off('member-removed-from-group', handleMemberRemovedFromGroup);
      socket.off('removed-from-group', handleRemovedFromGroup);
      socket.off('left-group', handleLeftGroup);
      socket.off('admin-transferred', handleAdminTransferred);
      socket.off('group-deleted', handleGroupDeleted);
    };
  }, [activeChat, updateChatInList, removeChatFromList, setShowGroupMembersModal, setActiveChat, currentUser?._id]);

  const handleRemoveMember = async (memberId, memberName) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the group?`)) {
      return;
    }

    setLoading(true);
    try {
      await api.put(`/chats/${activeChat}/remove-member`, {
        memberId,
      });
      
      toast.success(`${memberName} removed from group`);
      
      // If current user was removed, immediate actions
      if (memberId === currentUser?._id) {
        setShowGroupMembersModal(false);
        setActiveChat(null);
        removeChatFromList(activeChat);
      }
      // Real-time updates will handle chat list updates via socket events
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    console.log('🔍 Leave group button clicked for chat:', activeChat);
    
    if (!confirm('Are you sure you want to leave this group?')) {
      console.log('🔍 User cancelled leave group');
      return;
    }

    console.log('🔍 User confirmed leave group');
    setLoading(true);
    
    try {
      console.log('🔍 Making API call to leave group...');
      const response = await api.put(`/chats/${activeChat}/leave`);
      
      console.log('🔍 API response:', response.data);
      toast.success(response.data.message || 'You left the group');
      
      console.log('🔍 API call successful - waiting for socket events...');
      
      // Don't do immediate UI updates - wait for socket events
      // Socket listeners will handle UI updates in real-time
      
    } catch (error) {
      console.error('🔍 Leave group error:', error);
      console.error('🔍 Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to leave group');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm(`Are you sure you want to delete "${chat.name}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/chats/${activeChat}`);
      
      toast.success('Group deleted successfully');
      
      // Immediate actions
      setShowGroupMembersModal(false);
      setActiveChat(null);
      removeChatFromList(activeChat);
      
      // Real-time updates will handle other users' chat lists via socket events
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete group');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowGroupMembersModal(false);
  };

  if (!chat || !chat.isGroup) {
    console.log('🔍 Modal not showing - chat is not a group or chat is null');
    return null;
  }

  console.log('🔍 Rendering GroupMembersModal - showGroupMembersModal:', showGroupMembersModal);

  return (
    <AnimatePresence>
      {showGroupMembersModal && (
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] md:max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <h2 className="text-lg md:text-xl font-bold">Group Members</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">({members.length})</span>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Group Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{chat.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Created by {chat.admin?.name || 'Unknown'} • {members.length} members
              </p>
            </div>

            {/* Members List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {members.map((member) => {
                const isCurrentUser = member._id === currentUser?._id;
                const isMemberAdmin = member._id === chat.admin?._id;

                return (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </span>
                          {isMemberAdmin && (
                            <Crown size={14} className="text-yellow-500" title="Admin" />
                          )}
                          {isCurrentUser && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">(You)</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {member.isOnline ? '🟢 Online' : '⚪ Offline'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Admin can remove other members (but not themselves) */}
                      {isAdmin && !isCurrentUser && !isMemberAdmin && (
                        <button
                          onClick={() => handleRemoveMember(member._id, member.name)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
                          title="Remove member"
                        >
                          <UserMinus size={16} />
                        </button>
                      )}
                      
                      {/* Regular members can leave the group */}
                      {!isAdmin && isCurrentUser && (
                        <button
                          onClick={handleLeaveGroup}
                          disabled={loading}
                          className="p-2 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded-lg transition"
                          title="Leave group"
                        >
                          <LogOut size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {/* Admin actions */}
              {isAdmin && (
                <div className="space-y-2">
                  <button
                    onClick={handleDeleteGroup}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition font-medium flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    {loading ? 'Deleting...' : 'Delete Group'}
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    As admin, you can remove members or delete the entire group
                  </p>
                </div>
              )}
              
              {/* Regular member leave action */}
              {!isAdmin && (
                <button
                  onClick={handleLeaveGroup}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition font-medium flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  {loading ? 'Leaving...' : 'Leave Group'}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
