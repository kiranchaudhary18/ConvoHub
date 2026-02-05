'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle, Lock, Users, Zap, Globe, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation - Hidden on mobile, visible on desktop */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:block sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-purple-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ConvoHub
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              aria-label="Sign in to ConvoHub"
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            ConvoHub: Real-time Chat for <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Instant Messaging</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            ConvoHub is a premium real-time chat application for instant messaging, group conversations, and secure communication. Connect with anyone, anywhere with ConvoHub.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/register')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl transition-all font-semibold text-lg flex items-center justify-center gap-2"
              aria-label="Start using ConvoHub"
            >
              Start with ConvoHub
              <ArrowRight size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')}
              className="px-8 py-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all font-semibold text-lg"
              aria-label="Sign in to ConvoHub"
            >
              Sign In
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
          >
            Why Choose ConvoHub
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: MessageCircle,
                title: 'Instant Messaging',
                desc: 'Send messages instantly with ConvoHub real-time chat.',
              },
              {
                icon: Lock,
                title: 'Secure Communication',
                desc: 'End-to-end encryption protects your conversations on ConvoHub.',
              },
              {
                icon: Users,
                title: 'Group Chat',
                desc: 'Create unlimited groups and chat with multiple people on ConvoHub.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                desc: 'ConvoHub delivers messages with minimal latency.',
              },
              {
                icon: Globe,
                title: 'Global Access',
                desc: 'Use ConvoHub from anywhere in the world.',
              },
              {
                icon: Shield,
                title: 'Data Privacy',
                desc: 'Your privacy matters. ConvoHub respects your data.',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all border border-purple-100 dark:border-gray-700"
                >
                  <Icon className="w-12 h-12 text-gradient-to-r from-purple-600 to-pink-600 mb-4 text-purple-600" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
          >
            Getting Started with ConvoHub
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { num: '1', title: 'Register', desc: 'Create your ConvoHub account instantly.' },
              { num: '2', title: 'Add Contacts', desc: 'Find and add friends to your ConvoHub contacts.' },
              { num: '3', title: 'Start Chatting', desc: 'Begin real-time conversations on ConvoHub now.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg"
                >
                  {step.num}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 my-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join Thousands on ConvoHub
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Experience the best real-time chat application. ConvoHub makes messaging simple and secure.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/register')}
            className="px-8 py-4 bg-white text-purple-600 rounded-xl hover:shadow-2xl transition-all font-bold text-lg"
            aria-label="Start using ConvoHub now"
          >
            Get Started with ConvoHub
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mb-20 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-800 pb-8 mb-8">
            <h3 className="text-white font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ConvoHub</h3>
            <p className="text-sm mt-2">The best real-time chat application for instant messaging.</p>
          </div>
          <div className="text-center text-sm">
            <p>&copy; 2026 ConvoHub. All rights reserved. ConvoHub - Real-time Chat Platform.</p>
          </div>
        </div>
      </footer>
      </div>

      {/* Mobile Bottom Header - Fixed at bottom on mobile, hidden on desktop */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-purple-200 dark:border-gray-700"
      >
        <div className="flex justify-between items-center h-16 px-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ConvoHub
          </h2>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/register')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium"
              aria-label="Start using ConvoHub"
            >
              Sign Up
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')}
              className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg text-sm font-medium"
              aria-label="Sign in to ConvoHub"
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
