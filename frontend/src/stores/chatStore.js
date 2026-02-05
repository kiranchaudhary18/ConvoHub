import { create } from 'zustand';

export const useChatStore = create((set) => ({
  chats: [],
  messages: {},
  activeChat: null,
  selectedUsers: [],
  loading: false,

  setChats: (chats) => set({ chats }),
  
  addChatToList: (newChat) =>
    set((state) => {
      // Check if chat already exists
      const chatExists = state.chats.some((c) => c._id === newChat._id);
      if (chatExists) {
        return state;
      }
      // Add new chat to the beginning of the list
      return {
        chats: [newChat, ...state.chats],
      };
    }),

  removeChatFromList: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((c) => c._id !== chatId),
    })),

  updateChatInList: (updatedChat) =>
    set((state) => ({
      chats: state.chats.map((c) => 
        c._id === updatedChat._id ? updatedChat : c
      ),
    })),

  setMessages: (chatId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: messages },
    })),

  addMessage: (chatId, message) =>
    set((state) => {
      const existingMessages = state.messages[chatId] || [];
      // Prevent duplicate messages
      const messageExists = existingMessages.some((m) => m._id === message._id);
      if (messageExists) {
        return state;
      }
      return {
        messages: {
          ...state.messages,
          [chatId]: [...existingMessages, message],
        },
      };
    }),

  updateMessage: (chatId, messageId, updates) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId].map((msg) =>
          msg._id === messageId ? { ...msg, ...updates } : msg
        ),
      },
    })),

  deleteMessage: (chatId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId].map((msg) =>
          msg._id === messageId 
            ? { ...msg, isDeleted: true, text: 'This message was deleted' }
            : msg
        ),
      },
    })),

  setActiveChat: (chatId) => set({ activeChat: chatId }),

  setSelectedUsers: (users) => set({ selectedUsers: users }),
  addSelectedUser: (user) =>
    set((state) => ({
      selectedUsers: [...state.selectedUsers, user],
    })),
  removeSelectedUser: (userId) =>
    set((state) => ({
      selectedUsers: state.selectedUsers.filter((u) => u._id !== userId),
    })),

  setLoading: (loading) => set({ loading }),
}));
