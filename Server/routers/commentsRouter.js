const express = require('express');
const { CreateComment, getComments, getRecentPostsComments } = require('../controllers/commentsController');
const isAuthenticated = require('../middlewares/auth');

const commentsRouter = express.Router();

commentsRouter.post('/create', isAuthenticated, CreateComment);
commentsRouter.get('/get/:postId', isAuthenticated, getComments);
commentsRouter.get('/recent/get/:postId', isAuthenticated, getRecentPostsComments);

module.exports = commentsRouter;