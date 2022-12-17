const express = require('express');
const { postUser, getUser } = require('../controllers/userController.js');

const userRouter = express.Router();

userRouter.post('/signup', postUser);
userRouter.post('/login', getUser);

module.exports = userRouter;