const express = require('express');
const { accessChat, getAllChats } = require('../controllers/chatsController');
const isAuthenticated = require('../middlewares/auth');

const notificationsRouter = express.Router();

notificationsRouter.post('/create', isAuthenticated, accessChat);
notificationsRouter.get('/allchats', isAuthenticated, getAllChats);

module.exports = notificationsRouter;