'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function ChatPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full text-center"
    >
      <MessageCircle size={64} className="text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
        Welcome to ConvoHub
      </h2>
      <p className="text-gray-500 dark:text-gray-500">
        Select a chat to start messaging
      </p>
    </motion.div>
  );
}
