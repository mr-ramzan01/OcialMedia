const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routers/userRouter.js');
const followRouter = require('./routers/followRouter.js');
const postsRouter = require('./routers/postsRouter.js');
const likesRouter = require('./routers/likesRouter.js');
const commentsRouter = require('./routers/commentsRouter.js');
const chatsRouter = require('./routers/chatsRouter.js');
const messagesRouter = require('./routers/messagesRouter.js');
const messagesNotificationRouter = require('./routers/messageNotificationRouter.js');
const savedPostsRouter = require('./routers/savedPostsRouter.js');
const notificationsRouter = require('./routers/notificationsRouter.js');
const storiesRouter = require('./routers/storiesRouter.js');
const errorMiddleware = require('./middlewares/Error.js');
const { allowedOrigins } = require('./config/origins.js');

const app = express();

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Generous global limit, tighter limit for credential endpoints
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 600, standardHeaders: 'draft-7', legacyHeaders: false });
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again in a few minutes' },
});

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send({ success: true, message: 'Ocial Media API is running' });
});

app.get('/health', (req, res) => {
  res.send({ success: true, uptime: process.uptime() });
});

app.use('/api', apiLimiter);
app.use(['/api/users/login', '/api/users/signup', '/api/users/forgot-password'], authLimiter);
app.use('/api/users', userRouter);
app.use('/api/follows', followRouter);
app.use('/api/posts', postsRouter);
app.use('/api/likes', likesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/chats', chatsRouter);
// Must be registered before /api/messages so "/notifications" is not treated as a chatId
app.use('/api/messages/notifications', messagesNotificationRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/savedposts', savedPostsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/stories', storiesRouter);

// 404 for anything else (Express 5: no "*" path needed)
app.use((req, res) => {
  res.status(404).send({ success: false, message: 'Invalid request' });
});

app.use(errorMiddleware);

module.exports = app;
