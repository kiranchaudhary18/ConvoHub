'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Send, Copy, CheckCircle, Link2 } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { validateEmail } from '@/lib/utils';

export default function SendInviteModal() {
  const { showSendInviteModal, setShowSendInviteModal } = useUIStore();
  const { user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const generateSignupLink = () => {
    return `${window.location.origin}/register?invite=${user?._id}`;
  };

  const handleCopyLink = async () => {
    const link = generateSignupLink();
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Invite link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error('Invalid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/invites/send-direct', {
        email: email.trim(),
      });

      if (response.data?.success) {
        toast.success(response.data?.message || 'Invitation sent successfully!');
        setInviteSent(true);
        setEmail('');
        
        // Reset after 2 seconds
        setTimeout(() => {
          setInviteSent(false);
          handleClose();
        }, 2000);
      } else {
        toast.error(response.data?.message || 'Failed to send invitation');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to send invitation';
      console.error('Invite error:', error);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowSendInviteModal(false);
    setEmail('');
    setInviteSent(false);
    setCopied(false);
  };

  return (
    <AnimatePresence>
      {showSendInviteModal && (
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Invite Friends to ConvoHub
              </h2>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {inviteSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-3"
                >
                  <CheckCircle size={48} className="text-green-500 mx-auto" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Invitation Sent!
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your friend will receive an email with the signup link
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Email Form */}
                  <form onSubmit={handleSendInvite} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Send Invite via Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter email address"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition"
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading || !email}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg text-white py-2.5 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                      {loading ? 'Sending...' : 'Send Invite'}
                    </motion.button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">OR</span>
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                  </div>

                  {/* Share Link */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Share Signup Link
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 truncate">
                          <Link2 size={18} className="text-purple-600 flex-shrink-0" />
                          <span className="truncate">{generateSignupLink()}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCopyLink}
                          className={`px-4 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 ${
                            copied
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          <Copy size={18} />
                        </motion.button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Copy this link and share it anywhere
                      </p>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      💡 Share your unique link on WhatsApp, Discord, or any social media. Your friend can sign up directly without needing a chat invitation.
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
