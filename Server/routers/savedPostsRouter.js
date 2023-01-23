const express = require('express');
const { savePosts, hasSaved, AllSavedPosts } = require('../controllers/savedPostsController');
const isAuthenticated = require('../middlewares/auth');

const savedPostsRouter = express.Router();

savedPostsRouter.post('/save', isAuthenticated, savePosts);
savedPostsRouter.get('/issaved/:id', isAuthenticated, hasSaved);
savedPostsRouter.get('/get/all/:id', isAuthenticated, AllSavedPosts);

module.exports = savedPostsRouter;