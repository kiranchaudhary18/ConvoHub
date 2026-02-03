require('dotenv').config();
const http = require('http');
const socketIO = require('socket.io');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { initializeSocket } = require('./src/socket/socket');
const { setupCleanupJob } = require('./src/utils/cleanup');

// Get port from environment or use default
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Socket.IO CORS configuration
const socketCorsOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'https://convo-hub-chat.vercel.app',
];

// Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: socketCorsOrigins,
    credentials: true,
  },
});

// Set io on app so controllers can access it
app.set('io', io);

// Initialize socket handlers
initializeSocket(io);

// Connect to MongoDB
connectDB();

// Setup automated cleanup job (backup to TTL indexes)
setupCleanupJob();

// Start server
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     ConvoHub Backend Server Started    ║
╠════════════════════════════════════════╣
║  Port: ${PORT}                          
║  Environment: ${process.env.NODE_ENV || 'development'}
║  Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
╚════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
