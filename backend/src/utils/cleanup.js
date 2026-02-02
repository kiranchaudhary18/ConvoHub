const cron = require('node-cron');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

/**
 * Setup automated cleanup job
 * - Deletes messages older than 30 days
 * - Deletes chats older than 30 days (without messages)
 * - Runs daily at 2 AM
 */
const setupCleanupJob = () => {
  // Run cleanup every day at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('🧹 Starting auto-cleanup job...');

      // Calculate date 30 days ago
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Delete old messages
      const messagesDeleted = await Message.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
      });

      console.log(`✅ Deleted ${messagesDeleted.deletedCount} old messages`);

      // Delete empty chats older than 30 days
      const chatsDeleted = await Chat.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
      });

      console.log(`✅ Deleted ${chatsDeleted.deletedCount} old chats`);

      console.log('🧹 Cleanup job completed successfully');
    } catch (error) {
      console.error('❌ Cleanup job error:', error.message);
    }
  });

  console.log('📅 Auto-cleanup job scheduled (runs daily at 2:00 AM)');
};

module.exports = { setupCleanupJob };
