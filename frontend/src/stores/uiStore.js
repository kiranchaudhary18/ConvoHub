import { create } from 'zustand';

export const useUIStore = create((set) => ({
  darkMode: false,
  sidebarOpen: true,
  activeTab: 'chats', // chats, groups, users
  showGroupModal: false,
  showInviteModal: false,
  showProfileModal: false,
  typingUsers: {},

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setShowGroupModal: (show) => set({ showGroupModal: show }),
  setShowInviteModal: (show) => set({ showInviteModal: show }),
  setShowProfileModal: (show) => set({ showProfileModal: show }),

  setTypingUser: (userId, isTyping) =>
    set((state) => ({
      typingUsers: isTyping
        ? { ...state.typingUsers, [userId]: true }
        : { ...Object.fromEntries(
            Object.entries(state.typingUsers).filter(([id]) => id !== userId)
          ) },
    })),
}));
