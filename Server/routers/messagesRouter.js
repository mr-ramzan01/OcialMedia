const express = require('express');
const { sendMessage } = require('../controllers/messagesController');
const isAuthenticated = require('../middlewares/auth');

const messagesRouter = express.Router();

messagesRouter.post('/send', isAuthenticated, sendMessage);

module.exports = messagesRouter;