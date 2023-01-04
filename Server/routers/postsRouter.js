const express = require('express');
const { createPosts, postOnCloudinary, getPosts } = require('../controllers/postsController');
var multer = require('multer');
const isAuthenticated = require('../middlewares/auth');
var uploader = multer();

const postsRouter = express.Router();

postsRouter.get('/:username', isAuthenticated, getPosts);
postsRouter.post('/upload-poston-cloudinary', isAuthenticated, uploader.single("posts"), postOnCloudinary );
postsRouter.post('/create', isAuthenticated, createPosts);

module.exports = postsRouter;