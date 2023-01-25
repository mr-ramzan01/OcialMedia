const express = require('express');
const { SignUPUser, LoginUser, forgotPassword, setForgotPassword, LoggedInUser, googleOAuth, LoggedOutUser, searchUser, getUser, resetPassword, removeProfile, uploadProfile, editUserProfile } = require('../controllers/userController.js');
const isAuthenticated = require('../middlewares/auth.js');
const passwordTokenCheck = require('../middlewares/passwordTokenChecker.js');
var multer = require('multer')
var uploader = multer().single('profile')

const userRouter = express.Router();

userRouter.get('/loggedInUser', isAuthenticated, LoggedInUser);
userRouter.get('/loggedOutUser', isAuthenticated, LoggedOutUser);
userRouter.get('/google_Oauth', googleOAuth);
userRouter.get('/search', isAuthenticated, searchUser);
userRouter.get('/:username', isAuthenticated, getUser);
userRouter.post('/signup', SignUPUser);
userRouter.post('/login', LoginUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/forgot-password/set-new-password/:token', passwordTokenCheck, setForgotPassword);
userRouter.patch('/reset-password', isAuthenticated, resetPassword);
userRouter.patch('/remove-profile-photo/', isAuthenticated, removeProfile);
userRouter.patch('/upload-profile-photo', isAuthenticated, uploader, uploadProfile);
userRouter.patch('/udpate-user-profile', isAuthenticated, editUserProfile);

module.exports = userRouter;