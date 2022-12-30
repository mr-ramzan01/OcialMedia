const express = require('express');
const { isFollowing, followRequest, unFollowRequest, getFollowers, getFollowing } = require('../controllers/followController');

const followRouter = express.Router();

followRouter.get('/isfollowing', isFollowing);
followRouter.get('/getFollowers', getFollowers);
followRouter.get('/getFollowing', getFollowing);
followRouter.post('/followRequest', followRequest);
followRouter.delete('/unfollowRequest', unFollowRequest);

module.exports = followRouter;