const express = require('express');
const { isFollowing, followRequest, unFollowRequest, getFollowers, getFollowing } = require('../controllers/followController');
const isAuthenticated = require('../middlewares/auth');

const followRouter = express.Router();

followRouter.get('/isfollowing', isAuthenticated, isFollowing);
followRouter.get('/getFollowers', isAuthenticated, getFollowers);
followRouter.get('/getFollowing', isAuthenticated, getFollowing);
followRouter.post('/followRequest', isAuthenticated, followRequest);
followRouter.delete('/unfollowRequest', isAuthenticated, unFollowRequest);

module.exports = followRouter;