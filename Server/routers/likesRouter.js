const express = require('express');
const { likeRequest, hasLiked, removeLikeRequest } = require('../controllers/likesController');
const isAuthenticated = require('../middlewares/auth');

const likesRouter = express.Router();

likesRouter.get('/hasliked/:postId', isAuthenticated, hasLiked);
likesRouter.delete('/removelike/:deleteId', isAuthenticated, removeLikeRequest);
likesRouter.post('/createlike', isAuthenticated, likeRequest);

module.exports = likesRouter;