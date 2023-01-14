const express = require('express');
const { accessChat, getAllChats } = require('../controllers/chatsController');
const isAuthenticated = require('../middlewares/auth');

const chatsRouter = express.Router();

chatsRouter.post('/create', isAuthenticated, accessChat);
chatsRouter.get('/allchats', isAuthenticated, getAllChats);

module.exports = chatsRouter;