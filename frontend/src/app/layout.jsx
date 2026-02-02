'use client';

import { useEffect } from 'react';
import '@/styles/globals.css';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import toast, { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  const { user, loadFromStorage } = useAuthStore();
  const { darkMode } = useUIStore();
  const router = useRouter();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <head>
        <title>ConvoHub - Real-time Chat</title>
        <meta name="description" content="Premium real-time chat application" />
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
