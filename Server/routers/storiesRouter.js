const express = require('express');
const multer = require('multer');
const { uploadStory, getAllStories, getAllStoriesDate } = require('../controllers/storiesController');
const isAuthenticated = require('../middlewares/auth');

const uploader = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }).single('story');

const storiesRouter = express.Router();
storiesRouter.post('/upload', isAuthenticated, uploader, uploadStory);
storiesRouter.get('/get', isAuthenticated, getAllStories);
storiesRouter.get('/get/date', isAuthenticated, getAllStoriesDate);

module.exports = storiesRouter;
