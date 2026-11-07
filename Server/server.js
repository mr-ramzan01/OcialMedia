require('dotenv').config({ quiet: true });

const http = require('http');
const cloudinary = require('cloudinary').v2;
const { Server } = require('socket.io');
const app = require('./app');
const connection = require('./config/database');
const { allowedOrigins } = require('./config/origins');

const PORT = process.env.PORT || 8080;

// Fail fast on missing secrets
if (!process.env.JWT_SECRET_KEY) {
  console.error('JWT_SECRET_KEY is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

// Uncaught Error Handler
process.on('uncaughtException', (err) => {
  console.error({ error: err.message, message: 'Server shutdown due to uncaught error' });
  process.exit(1);
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on('setup', (userData) => {
    if (!userData || !userData._id) return;
    socket.userId = String(userData._id);
    socket.join(socket.userId);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    if (room) socket.join(String(room));
  });

  socket.on('typing', (room) => socket.in(String(room)).emit('typing'));
  socket.on('stop typing', (room) => socket.in(String(room)).emit('stop typing'));

  socket.on('new message', (newMessageReceived) => {
    const chat = newMessageReceived && newMessageReceived.chat_id;
    if (!chat || !Array.isArray(chat.users)) return;

    const senderId = String(newMessageReceived.sender && newMessageReceived.sender._id);
    chat.users.forEach((user) => {
      const userId = String(user && user._id ? user._id : user);
      if (userId === senderId) return;
      socket.in(userId).emit('message received', newMessageReceived);
    });
  });

  socket.on('disconnect', () => {
    if (socket.userId) socket.leave(socket.userId);
  });
});

async function start() {
  try {
    await connection();
  } catch (error) {
    console.error('db not connected:', error.message);
    process.exit(1);
  }

  httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}

start();

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err && err.message ? err.message : err);
  console.error('Closing the server due to unhandledPromiseRejection');
  httpServer.close(() => process.exit(1));
});

// Graceful shutdown
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    httpServer.close(() => process.exit(0));
  });
}
