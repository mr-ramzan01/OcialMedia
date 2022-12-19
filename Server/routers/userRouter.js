const express = require('express');
const { SignUPUser, LoginUser } = require('../controllers/userController.js');

const userRouter = express.Router();

userRouter.post('/signup', SignUPUser);
userRouter.post('/login', LoginUser);

module.exports = userRouter;