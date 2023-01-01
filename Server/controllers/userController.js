const ErrorHandler = require("../middlewares/ErrorHandler.js");
const userModel = require("../models/userModel.js");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { google } = require('googleapis');
const jwt_decode = require('jwt-decode');
dotenv.config();
const jwt_secret_key = process.env.JWT_SECRET_KEY;
const google_client_id = process.env.GOOGLE_CLIENT_ID;
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
const cloudinary = require('cloudinary');
const streamifier = require('streamifier')



async function LoggedOutUser(req, res, next) {
    try {
        res.cookie('ocialMedia_token', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        })
        return res.status(200).send({
            success: true,
            message: 'user logged out successfully'
        })
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function LoggedInUser(req, res, next) {
    try {
        let user = await userModel.findOne({_id: req.user._id});
    
        return res.status(200).send({
            success: true,
            message: 'User logged in',
            data: user
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getGoogleOAuthTokens(code) {
    const oauth2Client = new google.auth.OAuth2(
        google_client_id,
        google_client_secret,
      "http://localhost:3000/google_Oauth"
    );
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];
  
    oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
  
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return [
      oauth2Client.credentials.access_token,
      oauth2Client.credentials.id_token,
    ];
}
  
async function googleOAuth(req, res){
    try {
        const { code } = req.query;
        const [access_token, id_token] = await getGoogleOAuthTokens(code);
        const user = jwt_decode(id_token);
        const options = {
            expires: new Date(Date.now() + 30*24*60*60*1000),
            // maxAge: 500000000,
            httpOnly: true,
            // secure: true
        };

        // Checking User
        let existingUser = await userModel.findOne({ $and: [{ email: user.email},{authType: 'email-password'}] });
        if(existingUser) {
            return res.status(403).send({
                success: false,
                message: 'User already exists with email and password'
            })
        }

        // Checking if user has already signed up before
        let existingUserWithGoogle = await userModel.findOne({email: user.email})
        if(existingUserWithGoogle) {

            const token = jwt.sign({
                email: existingUserWithGoogle.email,
                username: existingUserWithGoogle.username,
                _id: existingUserWithGoogle._id,
            }, jwt_secret_key);

            return res.status(200).cookie("ocialMedia_token", token, {...options}).send({
                success: true,
                message: 'Google account has already been signed up' 
            })
        }
        // Creating User
        const newUser = await userModel.create({
            full_name: user.name,
            email: user.email,
            image: user.picture,
            authType: 'google',
            username: user.email.split('@')[0]
        });

        // Generating token
        const token = jwt.sign({
            email: newUser.email,
            username: newUser.username,
            _id: newUser._id,
        }, jwt_secret_key);

        
        return res.status(200).cookie("ocialMedia_token", token, {...options}).send({
            success: true,
            message: 'Google account signed up successfully' 
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
};


async function LoginUser(req, res, next) {
    try {
        // Checking User email
        let existingUser = await userModel.findOne({ $or: [{email: req.body.emailorusername}, {username: req.body.emailorusername} ] }).select("+password");
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
                username: existingUser.username,
                _id: existingUser._id,
            }, jwt_secret_key);
            
            const options = {
                expires: new Date(Date.now() + 30*24*60*60*1000),
                // maxAge: 500000000,
                httpOnly: true,
                // secure: true
            };
            res.status(200).cookie("ocialMedia_token", token, {...options}).send({
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

        let existingUser = await userModel.findOne({ $and: [{ email: req.body.email},{authType: 'google'}] });
        if(existingUser) {
            return res.status(403).send({
                success: false,
                message: 'User has already signed up try to continue with google.'
            })
        }

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
            username: newUser.username,
            _id: newUser._id,
        }, jwt_secret_key);

        const options = {
            expires: new Date(Date.now() + 30*24*60*60*1000),
            // maxAge: 500000000,
            httpOnly: true,
            // secure: true
        };
        res.status(200).cookie("ocialMedia_token", token, {...options}).send({
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
        let user = await userModel.findOne({ $and: [{ email: req.body.email},{authType: 'email-password'}] });
        if(user) {
            const forgotpasswordAcces = uuidv4();
            await userModel.findByIdAndUpdate(user._id, {$set: { forgotpasswordAcces}}, {new: true})
            return res.cookie("forgot_password_access", forgotpasswordAcces, {
                expires: new Date(Date.now() + 5*60*1000), // 5 minutes
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


async function resetPassword(req, res, next) {
    try {
        const { _id, email } = req.user;
        const { old_password, new_password } = req.body;

        const user = await userModel.findOne({ _id: _id }).select("+password");

        const passwordMatches = await bcrypt.compare(old_password, user.password);

        if(passwordMatches) {
            // Hashing Password
            const hashPassword = await bcrypt.hash(new_password, 10);

            // updating password 
            await userModel.findOneAndUpdate({email: email}, {$set: {password: hashPassword }}, {new: true})
            return res.status(200).send({
                success: true,
                message: 'Password updated successfully'
            })
        }
        else {
            return res.status(401).send({
                success: false,
                message: 'Old password does not match'
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


async function searchUser(req, res, next) {
    try {
        const {q} = req.query;
        let users = await userModel.find({$or: [{full_name: {$regex: new RegExp(q, 'i')}},{username: {$regex: new RegExp(q, 'i')}}]}).limit(50);
        res.send({
            success: true,
            message: 'related users',
            data: users
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getUser(req, res, next) {
    try {
        let {username} = req.params;

        let  user = await userModel.findOne({ username: username });
        if(!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }
        return res.send({
            success: true,
            message: 'User data',
            data: user
        })
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function removeProfile(req, res, next) {
    try {
        const {_id} = req.user;
        const user = await userModel.findOne({_id: _id});
        await cloudinary.v2.uploader.destroy(user.image_public_id);

        await userModel.findByIdAndUpdate(_id, {image: ''});
        return res.send({
            success: true,
            message: 'Profile photo successfully removed'
        })
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function uploadProfile(req, res, next) {
    try {
        const { _id } = req.user;
        const user = await userModel.findOne({_id: _id});
        if(user.image_public_id !== '') {
            await cloudinary.v2.uploader.destroy(user.image_public_id);
        }

        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.v2.uploader.upload_stream(
                  (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                  }
                );
    
              streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            if(result) {
                await userModel.findByIdAndUpdate(_id, {image: result.secure_url, $set: { image_public_id: result.public_id}});
                return res.send({
                    success: true,
                    message: 'Profile updated successfully'
                });
            }
            else {
                res.send({
                    success: false,
                    message: 'Could not upload'
                })
            }
            
        }
        upload(req);
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

async function editUserProfile(req, res, next) {
    try {
        let { _id } = req.user;
        let user = await userModel.findById(_id);

        if(user.username !== req.body.username) {
            let existingUsername = await userModel.findOne({username: req.body.username});
            if(existingUsername) {
                return res.status(400).send({
                    success: false,
                    message: 'Username already taken'
                })
            }
            else {
                await userModel.findByIdAndUpdate(_id, req.body);
            }
        }
        else {
            await userModel.findByIdAndUpdate(_id, req.body);
        }
        return res.status(200).send({
            success: true,
            message: "Profile updated successfully"
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


module.exports = { SignUPUser, LoginUser, forgotPassword, setForgotPassword, LoggedInUser, googleOAuth, LoggedOutUser, searchUser, getUser, resetPassword, removeProfile, uploadProfile, editUserProfile };