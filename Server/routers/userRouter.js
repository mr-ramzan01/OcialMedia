const express = require('express');
const multer = require('multer');
const { SignUPUser, LoginUser, forgotPassword, setForgotPassword, LoggedInUser, googleOAuth, LoggedOutUser, searchUser, getUser, resetPassword, removeProfile, uploadProfile, editUserProfile } = require('../controllers/userController.js');
const isAuthenticated = require('../middlewares/auth.js');

const uploader = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }).single('profile');

const userRouter = express.Router();

userRouter.get('/loggedInUser', isAuthenticated, LoggedInUser);
userRouter.get('/loggedOutUser', isAuthenticated, LoggedOutUser);
userRouter.get('/google_Oauth', googleOAuth);
userRouter.get('/search', isAuthenticated, searchUser);
userRouter.post('/signup', SignUPUser);
userRouter.post('/login', LoginUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/forgot-password/set-new-password', setForgotPassword);
userRouter.patch('/reset-password', isAuthenticated, resetPassword);
userRouter.patch('/remove-profile-photo', isAuthenticated, removeProfile);
userRouter.patch('/upload-profile-photo', isAuthenticated, uploader, uploadProfile);
userRouter.patch('/update-user-profile', isAuthenticated, editUserProfile);
// Kept for older clients that still call the misspelled path
userRouter.patch('/udpate-user-profile', isAuthenticated, editUserProfile);
// Must stay last: matches any username
userRouter.get('/:username', isAuthenticated, getUser);

module.exports = userRouter;
