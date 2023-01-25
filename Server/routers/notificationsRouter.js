const express = require('express');
const { getAllNotifications, hasNotifications, hasSeenNotifications } = require('../controllers/notificationsController');
const isAuthenticated = require('../middlewares/auth');

const notificationsRouter = express.Router();

notificationsRouter.get('/get/all', isAuthenticated, getAllNotifications);
notificationsRouter.get('/has', isAuthenticated, hasNotifications);
notificationsRouter.patch('/has/seen', isAuthenticated, hasSeenNotifications);

module.exports = notificationsRouter;