const express = require('express');
const { CreateComment, getComments } = require('../controllers/commentsController');
const isAuthenticated = require('../middlewares/auth');

const commentsRouter = express.Router();

commentsRouter.post('/create', isAuthenticated, CreateComment);
commentsRouter.get('/get/:postId', isAuthenticated, getComments);

module.exports = commentsRouter;