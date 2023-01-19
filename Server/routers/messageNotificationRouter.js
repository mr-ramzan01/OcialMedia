const express = require('express');
const { getAllMessagesNotification, sendMessagesNotification, deleteMessagesNotification } = require('../controllers/messageNotificationController');
const isAuthenticated = require('../middlewares/auth');

const messagesNotificationRouter = express.Router();

messagesNotificationRouter.get('/get/:user_id', isAuthenticated, getAllMessagesNotification);
messagesNotificationRouter.delete('/:user_id', isAuthenticated, deleteMessagesNotification);
messagesNotificationRouter.post('/send', isAuthenticated, sendMessagesNotification);


module.exports = messagesNotificationRouter;