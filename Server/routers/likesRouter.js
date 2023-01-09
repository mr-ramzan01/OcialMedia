const express = require('express');
const { likeRequest } = require('../controllers/likesController');
const isAuthenticated = require('../middlewares/auth');

const likesRouter = express.Router();

likesRouter.post('/createlike', isAuthenticated, likeRequest);

module.exports = likesRouter;