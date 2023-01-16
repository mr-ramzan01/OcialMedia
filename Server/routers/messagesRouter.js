const express = require('express');
const { sendMessage, getAllMessages } = require('../controllers/messagesController');
const isAuthenticated = require('../middlewares/auth');

const messagesRouter = express.Router();

messagesRouter.post('/send', isAuthenticated, sendMessage);
messagesRouter.get('/get/:chatId', isAuthenticated, getAllMessages);

module.exports = messagesRouter;