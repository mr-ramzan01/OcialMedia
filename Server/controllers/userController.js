const ErrorHandler = require("../middlewares/ErrorHandler.js");
const userModel = require("../models/userModel.js");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();
const jwt_secret_key = process.env.JWT_SECRET_KEY;


async function LoginUser(req, res, next) {
    try {
        // Checking User email
        let existingUser = await userModel.findOne({ $or: [{email: req.body.emailorusername}, {username: req.body.emailorusername} ] });
        if(!existingUser) {
            return res.status(401).send({
                success: false,
                message: 'Invalid Credentials'
            })
        }

        const passwordMatches = await bcrypt.compare(req.body.password, existingUser.password);
        if(passwordMatches) {

            // Generating token
            const token = jwt.sign({
                email: existingUser.email,
                _id: existingUser._id,
            }, jwt_secret_key);
            
            const options = {
                expires: new Date(Date.now() + 30*24*60*60*1000),
                // maxAge: 500000000,
                httpOnly: true,
                // secure: true
            };
            res.status(200).cookie("ocialMedia_jwt", token, {...options}).send({
                success: true,
                message: 'Login Successfully',
            })
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
            success: false,
            message: error.message
        });
    }
}



async function SignUPUser(req, res, next) {
    try {
        // Checking User
        let user = await userModel.findOne({ email: req.body.email });
        if(user) {
            return res.status(403).send({
                success: false,
                message: 'User already exists'
            })
        }
        // Checking username
        let username = await userModel.findOne({ username: req.body.username})
        if(username) {
            return res.status(400).send({
                success: false,
                message: 'Username already taken'
            })
        }
        // Hashing Password
        const hashPassword = await bcrypt.hash(req.body.password, 10);

        // Creating User
        const newUser = await userModel.create({...req.body, password: hashPassword});

        // Generating token
        const token = jwt.sign({
            email: newUser.email,
            _id: newUser._id,
            password: newUser.password
        }, jwt_secret_key);

        const options = {
            expires: new Date(Date.now() + 30*24*60*60*1000),
            // maxAge: 500000000,
            httpOnly: true,
            // secure: true
        };
        res.status(200).cookie("ocialMedia_jwt", token, {...options}).send({
            success: true,
            message: 'Signup successfully',
        })
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function forgotPassword(req, res, next) {
    try {
        // Checking user, is it present with that email or not
        let user = await userModel.findOne({ email: req.body.email });
        if(user) {
            const forgotpasswordAcces = uuidv4();
            await userModel.findByIdAndUpdate(user._id, {$set: { forgotpasswordAcces}}, {new: true})
            return res.cookie("forgot_password_access", forgotpasswordAcces, {
                expires: new Date(Date.now() + 5*60*1000),
                httpOnly: true
            }).status(200).send({
                success: true,
                message: 'Authenticated user',
                full_name: user.full_name,
            })
        }
        return res.status(403).send({
            success: false,
            message: 'Invalid email'
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function setForgotPassword(req, res, next) {
    try {
        // Hashing Password
        const hashPassword = await bcrypt.hash(req.body.password, 10);

        // updating password 
        await userModel.findOneAndUpdate({forgotpasswordAcces: req.forgot_password_access}, {$set: {password: hashPassword }}, {new: true})
        return res.status(200).send({
            success: true,
            message: 'Password updated successfully'
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}



module.exports = { SignUPUser, LoginUser, forgotPassword, setForgotPassword };