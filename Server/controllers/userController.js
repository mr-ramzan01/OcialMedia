const ErrorHandler = require("../middlewares/ErrorHandler.js");
const userModel = require("../models/userModel.js");
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();
const jwt_secret_key = process.env.JWT_SECRET_KEY;


async function getUser(req, res, next) {
    try {
        // Checking User email
        let user = await userModel.findOne({ email: req.body.email });
        if(!user) {
            return res.status(401).send({
                success: false,
                message: 'Invalid Credentials'
            })
        }
        // Hashing Password
        const passwordMatches = await bcrypt.compare(req.body.password, user.password);

        if(passwordMatches) {
            // Hashing password
            const hashPassword = await bcrypt.hash(req.body.password, 10);

            // Creating payload for token
            const payload = {};
            payload.email = user.email;
            payload.id = user._id;
            payload.password = hashPassword;

            // Generating token
            const token = jwt.sign(payload, jwt_secret_key);

            return res.send({
                success: true,
                message: 'Login Successfully',
                token: token
            });
        }
        else {
            return res.status(401).send({
                success: false,
                message: 'Invalid Credentials'
            })
        }
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            status: "Error",
            message: error.message
        });
    }
}
async function postUser(req, res, next) {
    try {
        // Checking User
        let user = await userModel.findOne({ email: req.body.email });
        if(user) {
            return res.status(403).send({
                success: false,
                message: 'User already exists'
            })
        }
        // Hashing Password
        const hashPassword = await bcrypt.hash(req.body.password, 10);

        // Creating User
        const newUser = await userModel.create({...req.body, password: hashPassword});
        const payload = {};
        payload.email = newUser.email;
        payload.id = newUser._id;
        payload.password = hashPassword;

        // Generating token
        const token = jwt.sign(payload, jwt_secret_key);
        return res.send({
            success: true,
            message: 'User created successfully',
            token: token
        });
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            status: "Error",
            message: error.message
        });
    }
}

module.exports = { postUser, getUser };