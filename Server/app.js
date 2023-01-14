const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const handleError = require('./middlewares/Error.js');
const cookieParser = require('cookie-parser');
const userRouter = require('./routers/userRouter.js');
const followRouter = require('./routers/followRouter.js');
const postsRouter = require('./routers/postsRouter.js');
const likesRouter = require('./routers/likesRouter.js');
const commentsRouter = require('./routers/commentsRouter.js');
const chatsRouter = require('./routers/chatsRouter.js');
const messagesRouter = require('./routers/messagesRouter.js');


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
app.use('/users', userRouter);
app.use('/follows', followRouter);
app.use('/posts', postsRouter);
app.use('/likes', likesRouter);
app.use('/comments', commentsRouter);
app.use('/chats', chatsRouter);
app.use('/messages', messagesRouter);



app.use(handleError);

app.get('*', (req, res) => {
  res.status(400).send("Invalid request");
})

module.exports = app;