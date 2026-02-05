'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MessageCircle, Lock, Users, Zap, Globe, Shield } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ConvoHub
            </h2>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              aria-label="Sign in to ConvoHub"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          ConvoHub: Real-time Chat for Instant Messaging
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          ConvoHub is a premium real-time chat application for instant messaging, group conversations, and secure communication. Connect with anyone, anywhere with ConvoHub.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => router.push('/register')}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            aria-label="Start using ConvoHub"
          >
            Start with ConvoHub
          </button>
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-semibold text-lg"
            aria-label="Sign in to ConvoHub"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800/50 py-16 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Why Choose ConvoHub
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: 'Instant Messaging',
                desc: 'Send messages instantly with ConvoHub real-time chat.'
              },
              {
                icon: Lock,
                title: 'Secure Communication',
                desc: 'End-to-end encryption protects your conversations on ConvoHub.'
              },
              {
                icon: Users,
                title: 'Group Chat',
                desc: 'Create unlimited groups and chat with multiple people on ConvoHub.'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                desc: 'ConvoHub delivers messages with minimal latency.'
              },
              {
                icon: Globe,
                title: 'Global Access',
                desc: 'Use ConvoHub from anywhere in the world.'
              },
              {
                icon: Shield,
                title: 'Data Privacy',
                desc: 'Your privacy matters. ConvoHub respects your data.'
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
                  <Icon className="w-12 h-12 text-blue-600 mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Getting Started with ConvoHub
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { num: '1', title: 'Register', desc: 'Create your ConvoHub account instantly.' },
            { num: '2', title: 'Add Contacts', desc: 'Find and add friends to your ConvoHub contacts.' },
            { num: '3', title: 'Start Chatting', desc: 'Begin real-time conversations on ConvoHub now.' },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join Thousands on ConvoHub
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Experience the best real-time chat application. ConvoHub makes messaging simple and secure.
          </p>
          <button
            onClick={() => router.push('/register')}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
            aria-label="Start using ConvoHub now"
          >
            Get Started with ConvoHub
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-800 pb-8 mb-8">
            <h3 className="text-white font-bold text-lg mb-4">ConvoHub</h3>
            <p className="text-sm">The best real-time chat application for instant messaging.</p>
          </div>
          <div className="text-center text-sm">
            <p>&copy; 2026 ConvoHub. All rights reserved. ConvoHub - Real-time Chat Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
