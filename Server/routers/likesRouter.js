const express = require('express');
const { likeRequest, hasLiked, removeLikeRequest, getLikesOnPost } = require('../controllers/likesController');
const isAuthenticated = require('../middlewares/auth');

const likesRouter = express.Router();

likesRouter.get('/get/:id', isAuthenticated, getLikesOnPost);
likesRouter.get('/hasliked/:postId', isAuthenticated, hasLiked);
likesRouter.delete('/removelike/:deleteId', isAuthenticated, removeLikeRequest);
likesRouter.post('/createlike', isAuthenticated, likeRequest);

module.exports = likesRouter;