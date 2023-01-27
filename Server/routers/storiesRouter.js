const express = require('express');
var multer = require('multer');
const { uploadStory, getAllStories } = require('../controllers/storiesController');
const isAuthenticated = require('../middlewares/auth');
var uploader = multer().single('story')

const storiesRouter = express.Router();
storiesRouter.post('/upload', isAuthenticated, uploader, uploadStory);
storiesRouter.get('/get', isAuthenticated, getAllStories);

module.exports = storiesRouter;