const express = require('express');
var multer = require('multer');
const { uploadStory } = require('../controllers/storiesController');
const isAuthenticated = require('../middlewares/auth');
var uploader = multer().single('story')

const storiesRouter = express.Router();
storiesRouter.post('/upload', isAuthenticated, uploader, uploadStory);

module.exports = storiesRouter;