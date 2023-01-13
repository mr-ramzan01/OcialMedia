const express = require('express');
const { accessChat } = require('../controllers/chatsController');
const isAuthenticated = require('../middlewares/auth');

const chatsRouter = express.Router();

chatsRouter.post('/create', accessChat);

module.exports = chatsRouter;