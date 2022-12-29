const express = require('express');
const { SignUPUser, LoginUser, forgotPassword, setForgotPassword, LoggedInUser, googleOAuth, LoggedOutUser, searchUser, getUser } = require('../controllers/userController.js');
const isAuthenticated = require('../middlewares/auth.js');
const passwordTokenCheck = require('../middlewares/passwordTokenChecker.js');

const userRouter = express.Router();

userRouter.get('/loggedInUser', isAuthenticated, LoggedInUser);
userRouter.get('/loggedOutUser', LoggedOutUser);
userRouter.get('/google_Oauth', googleOAuth);
userRouter.get('/search', searchUser);
userRouter.get('/:username', getUser);
userRouter.post('/signup', SignUPUser);
userRouter.post('/login', LoginUser);
userRouter.post('/forgot-password/set-new-password', passwordTokenCheck, setForgotPassword);
userRouter.post('/forgot-password', forgotPassword);

module.exports = userRouter;