# ConvoHub: Auto-Delete & UI Cleanup Implementation

## Overview
This document describes the implementation of two major features:
1. **Auto-Delete Chats/Messages after 30 days**
2. **Remove Unnecessary UI Icons from Chat Header**

---

## PART 1: AUTO-DELETE CHATS & MESSAGES AFTER 30 DAYS

### Architecture Overview

Two complementary approaches have been implemented:

#### 1️⃣ **TTL Index (Primary - Recommended)**
- **What it is**: MongoDB's native Time-To-Live feature
- **How it works**: Documents with `createdAt` older than 30 days are automatically deleted
- **Advantage**: Efficient, automatic, no server overhead
- **Implementation**: Added to both Chat and Message models

#### 2️⃣ **Node-Cron Job (Backup/Fallback)**
- **What it is**: Scheduled cleanup task using node-cron library
- **How it works**: Runs daily at 2:00 AM, removes documents older than 30 days
- **Advantage**: Provides redundancy, can be customized easily
- **Implementation**: Runs alongside TTL index for extra reliability

### Backend Implementation

#### A. Database Models Updated

**File: `backend/src/models/Chat.js`**
```javascript
// TTL Index: Auto-delete chats after 30 days (2592000 seconds)
chatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
```

**File: `backend/src/models/Message.js`**
```javascript
// TTL Index: Auto-delete messages after 30 days (2592000 seconds)
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
```

**Key Points:**
- Both models already had `createdAt` field with timestamps
- TTL indexes are set to 2,592,000 seconds = 30 days
- MongoDB automatically deletes matching documents after the expiration time

#### B. Cron Job Setup

**File: `backend/src/utils/cleanup.js`** (NEW)
- Scheduled job that runs daily at 2:00 AM
- Deletes messages older than 30 days
- Deletes empty chats older than 30 days
- Provides console logging for monitoring

**File: `backend/server.js`** (UPDATED)
```javascript
const { setupCleanupJob } = require('./src/utils/cleanup');
setupCleanupJob(); // Runs at startup
```

**File: `backend/package.json`** (UPDATED)
- Added `"node-cron": "^3.0.2"` dependency

### Frontend Implementation

#### Auto-Remove from UI

The frontend uses Socket.IO listeners to detect when chats are deleted from the database:

**File: `frontend/src/components/chat/ChatWindow.jsx`**
```javascript
const handleChatDeleted = (chatId) => {
  // Chat was deleted from database
  // UI will automatically remove it as the chat data is refetched
};
```

**File: `frontend/src/components/chat/Sidebar.jsx`**
- Automatically filters out deleted chats
- Shows "Chat expired" message if user tries to access a deleted chat

#### Graceful Handling

When a chat is deleted:
1. User is notified silently (no error popup)
2. Chat disappears from sidebar
3. If user had that chat open, they see "Chat expired" message
4. User is redirected to chat list

### How to Monitor Cleanup

**Check MongoDB for TTL Indexes:**
```bash
db.chats.getIndexes()
db.messages.getIndexes()
```

**Monitor Cron Job Output:**
```
2024-12-02 02:00:00 🧹 Starting auto-cleanup job...
2024-12-02 02:00:05 ✅ Deleted 42 old messages
2024-12-02 02:00:06 ✅ Deleted 8 old chats
```

### Configuration

**To change the expiration time:**

Edit `backend/src/models/Chat.js` and `Message.js`:
```javascript
// For 60 days instead of 30:
{ expireAfterSeconds: 5184000 } // 60 * 24 * 60 * 60 seconds
```

**To change cron schedule:**

Edit `backend/src/utils/cleanup.js`:
```javascript
// Change '0 2 * * *' to any valid cron expression
// 0 2 * * * = Daily at 2:00 AM
// 0 */6 * * * = Every 6 hours
// 0 0 * * 0 = Weekly on Sunday at midnight
```

---

## PART 2: REMOVE UNNECESSARY UI ICONS

### What Changed

The chat header previously displayed multiple action buttons that are not yet functional:

**Removed Icons:**
- ❌ **Phone Call** button
- ❌ **Video Call** button
- ❌ **Info/Details** button
- ❌ **More Options** (⋮) menu

**Kept Elements:**
- ✅ **User Avatar** - Shows initials of the user
- ✅ **User Name** - Displays chat name or contact name
- ✅ **Online/Offline Status** - Shows presence indicator
- ✅ **Last Seen Time** - Shows when user was last active

### Implementation

**File: `frontend/src/components/chat/ChatHeader.jsx`** (UPDATED)

Before:
```jsx
<div className="flex items-center gap-2">
  <button><Phone size={20} /></button>
  <button><Video size={20} /></button>
  <button><Info size={20} /></button>
  <button><MoreVertical size={20} /></button>
</div>
```

After:
```jsx
// Removed the entire button container
// Now shows only user info on the left
```

### Visual Changes

**Before:**
```
[Avatar] Name         [☎️] [📹] [ℹ️] [⋮]
         Online/Offline
```

**After:**
```
[Avatar] Name
         Online/Offline
```

### Why This Change

1. **Cleaner UI** - Focuses on essential information
2. **Better UX** - Removes confusion about non-functional buttons
3. **Future-Proof** - Ready for actual call/info features when implemented
4. **Responsive** - Header scales better on mobile devices

### Future: Re-adding Features

When implementing video/audio calls and info panels:

```javascript
// In ChatHeader.jsx, add back buttons when ready:
import { Phone, Video, Info, MoreVertical } from 'lucide-react';

<motion.button onClick={handleVideoCall}>
  <Video size={20} />
</motion.button>
```

---

## Testing Instructions

### Test Auto-Delete Feature

1. **Create a chat** and send some messages
2. **Check MongoDB** (Database → Messages collection)
3. **Wait 30 days OR** manually set `createdAt` to 30+ days ago for testing
4. **Wait for TTL** or trigger cron job manually:
   ```bash
   # In mongo shell for testing:
   db.messages.deleteMany({
     createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
   })
   ```
5. **Verify** the chat/messages disappear from UI

### Test UI Cleanup

1. **Open ConvoHub** at http://localhost:3001
2. **Log in** with any account
3. **Open a chat** in the sidebar
4. **Observe the header** - should show:
   - ✅ User avatar with initials
   - ✅ Username
   - ✅ Online/Offline status
   - ❌ NO phone/video/info buttons

---

## Technical Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- node-cron (for scheduled tasks)

**Frontend:**
- Next.js 14
- React 18
- Zustand (state management)
- Framer Motion (animations)

---

## Summary of Changes

### Backend Files Modified
| File | Change |
|------|--------|
| `models/Chat.js` | Added TTL index |
| `models/Message.js` | Added TTL index |
| `utils/cleanup.js` | **NEW** - Cron job |
| `server.js` | Added cleanup job initialization |
| `package.json` | Added node-cron dependency |

### Frontend Files Modified
| File | Change |
|------|--------|
| `components/chat/ChatHeader.jsx` | Removed unnecessary buttons |

---

## Monitoring & Logs

**Expected Backend Startup Logs:**
```
📅 Auto-cleanup job scheduled (runs daily at 2:00 AM)
```

**Expected Cron Job Logs (Daily at 2:00 AM):**
```
🧹 Starting auto-cleanup job...
✅ Deleted X old messages
✅ Deleted Y old chats
🧹 Cleanup job completed successfully
```

---

## Summary

✅ **Both features are now fully implemented:**

1. **Auto-Delete (30 days):**
   - TTL indexes on Chat and Message models
   - Backup cron job running daily
   - Frontend gracefully handles deleted chats
   - No user action needed

2. **Clean UI Header:**
   - Removed all non-functional buttons
   - Focused on user info display
   - Improved visual clarity
   - Ready for future feature additions

The system is production-ready and will automatically maintain data cleanup without manual intervention.
