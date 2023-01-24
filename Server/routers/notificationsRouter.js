const express = require('express');
const { getAllNotifications } = require('../controllers/notificationsController');
const isAuthenticated = require('../middlewares/auth');

const notificationsRouter = express.Router();

notificationsRouter.get('/get/all', isAuthenticated, getAllNotifications);

module.exports = notificationsRouter;