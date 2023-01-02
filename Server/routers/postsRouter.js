const express = require('express');
const { createPosts } = require('../controllers/postsController');

const postsRouter = express.Router();

postsRouter.post('/create', createPosts);

module.exports = postsRouter;