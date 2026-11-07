const express = require('express');
const multer = require('multer');
const { createPosts, postOnCloudinary, getPosts, getExploreData, getSinglePost, getRecentPosts, deletePost } = require('../controllers/postsController');
const isAuthenticated = require('../middlewares/auth');

const uploader = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const postsRouter = express.Router();

// Static paths must be registered before the "/:username" catch-all
postsRouter.get('/explore/data', isAuthenticated, getExploreData);
postsRouter.get('/recent/post', isAuthenticated, getRecentPosts);
postsRouter.get('/single/:id', isAuthenticated, getSinglePost);
postsRouter.get('/:username', isAuthenticated, getPosts);
postsRouter.post('/upload-poston-cloudinary', isAuthenticated, uploader.single("posts"), postOnCloudinary);
postsRouter.post('/create', isAuthenticated, createPosts);
postsRouter.delete('/:id', isAuthenticated, deletePost);

module.exports = postsRouter;
