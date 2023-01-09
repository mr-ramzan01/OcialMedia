const express = require('express');
const { createPosts, postOnCloudinary, getPosts, getExploreData, getSinglePost } = require('../controllers/postsController');
var multer = require('multer');
const isAuthenticated = require('../middlewares/auth');
var uploader = multer();

const postsRouter = express.Router();

postsRouter.get('/:username', isAuthenticated, getPosts);
postsRouter.get('/explore/data', isAuthenticated, getExploreData);
postsRouter.get('/single/:id', isAuthenticated, getSinglePost);
postsRouter.post('/upload-poston-cloudinary', isAuthenticated, uploader.single("posts"), postOnCloudinary );
postsRouter.post('/create', isAuthenticated, createPosts);

module.exports = postsRouter;