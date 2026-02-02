import { create } from 'zustand';

export const useUserStore = create((set) => ({
  users: [],
  onlineUsers: new Set(),
  loading: false,

  setUsers: (users) => set({ users }),

  updateUserOnlineStatus: (userId, isOnline) =>
    set((state) => ({
      users: state.users.map((u) =>
        u._id === userId ? { ...u, isOnline } : u
      ),
    })),

  setUserOnline: (userId) =>
    set((state) => ({
      users: state.users.map((u) =>
        u._id === userId ? { ...u, isOnline: true } : u
      ),
      onlineUsers: new Set(state.onlineUsers).add(userId),
    })),

  setUserOffline: (userId) =>
    set((state) => {
      const newOnline = new Set(state.onlineUsers);
      newOnline.delete(userId);
      return {
        users: state.users.map((u) =>
          u._id === userId ? { ...u, isOnline: false } : u
        ),
        onlineUsers: newOnline,
      };
    }),

  setLoading: (loading) => set({ loading }),
}));
