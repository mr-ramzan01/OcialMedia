const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
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

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
  try {
    res.send("In home");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
})
app.use('/api/users', userRouter);
app.use('/api/follows', followRouter);
app.use('/api/posts', postsRouter);
app.use('/api/likes', likesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/chats', chatsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/messages/notifications', messagesNotificationRouter);
app.use('/api/savedposts', savedPostsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/stories', storiesRouter);



app.get('*', (req, res) => {
  res.status(400).send("Invalid request");
})

module.exports = app;