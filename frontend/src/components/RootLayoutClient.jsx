'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

export default function RootLayoutClient({ children }) {
  const { loadFromStorage } = useAuthStore();
  const { darkMode } = useUIStore();

  useEffect(() => {
    loadFromStorage();
    console.log('🔐 Loading auth from storage');
  }, [loadFromStorage]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      {children}
    </div>
  );
}
