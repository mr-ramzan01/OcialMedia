const userModel = require("../models/userModel.js");
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


async function LoggedOutUser(req, res) {
    try {

        // Deleting cookies from browser
        res.cookie('ocialMedia_token', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        })
        return res.status(200).send({
            success: true,
            message: 'user logged out successfully'
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function LoggedInUser(req, res) {
    try {

        // Finding user data
        let user = await userModel.findOne({_id: req.user._id});
    
        return res.status(200).send({
            success: true,
            message: 'User logged in',
            data: user
        })
        
    } catch (error) {
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
            httpOnly: true,
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


async function LoginUser(req, res) {
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
                httpOnly: true,
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
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function SignUPUser(req, res) {
    try {

        // Finding existing user with google auth
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
            httpOnly: true,
        };
        res.status(200).cookie("ocialMedia_token", token, {...options}).send({
            success: true,
            message: 'Signup successfully',
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function forgotPassword(req, res) {
    try {
        // Checking user, is it present with that email or not
        let user = await userModel.findOne({ $and: [{ email: req.body.email},{authType: 'email-password'}] });
        if(user) {
            const token = jwt.sign({
                email: user.email,
                username: user.username,
                _id: user._id,
            }, jwt_secret_key, {
                expiresIn: 300
            });
            
            return res.status(200).send({
                success: true,
                message: 'Authenticated user',
                token: token
            })
        }
        return res.status(403).send({
            success: false,
            message: 'Invalid email'
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function setForgotPassword(req, res) {
    try {
        const passwordHeader = req.headers.authorization;

        if (passwordHeader) {

            // Getting token
            const token = passwordHeader.split(" ")[1];
            if(token) {
                const decoded = jwt.verify(token, jwt_secret_key);
                if(decoded) {
                    // Hashing Password
                    const hashPassword = await bcrypt.hash(req.body.password, 10);

                    // updating password
                    await userModel.findOneAndUpdate(
                        { _id: decoded._id },
                        { $set: { password: hashPassword } },
                        { new: true }
                    );
                    return res.status(200).send({
                        success: true,
                        message: "Password updated successfully",
                    });
                }
                
            }
        }
        return res.status(403).send({
            success: false,
            message: "Something went wrong, Please reset your password again.",
        });
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function resetPassword(req, res) {
    try {
        const { _id, email } = req.user;
        const { old_password, new_password } = req.body;

        // Finding user
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
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function searchUser(req, res) {
    try {
        const {q} = req.query;

        // Finding all users
        let users = await userModel.find({$or: [{full_name: {$regex: new RegExp(q, 'i')}},{username: {$regex: new RegExp(q, 'i')}}]}).limit(50);
        
        res.send({
            success: true,
            message: 'related users',
            data: users
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getUser(req, res) {
    try {
        let {username} = req.params;

        // If q is not specified
        if(!username) {
            return res.status(400).send({
                success: false,
                message: 'Invalid params parameters'
            })
        }

        // Finding user
        let  user = await userModel.findOne({ username: username });

        // If user not found
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
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function removeProfile(req, res) {
    try {
        const {_id} = req.user;

        // Finding user
        const user = await userModel.findOne({_id: _id});

        // Deleting profile from cloudinary
        await cloudinary.v2.uploader.destroy(user.image_public_id);

        // Updating user data
        await userModel.findByIdAndUpdate(_id, {image: ''});
        
        return res.send({
            success: true,
            message: 'Profile photo successfully removed'
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function uploadProfile(req, res) {
    try {
        const { _id } = req.user;

        // Finding user
        const user = await userModel.findOne({_id: _id});

        // Deleting profile from cloudinary
        if(user.image_public_id !== '') {
            await cloudinary.v2.uploader.destroy(user.image_public_id);
        }

        // Uploading image on cloudinary
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

            // If uploaded success
            if(result) {

                // Updating user data
                await userModel.findByIdAndUpdate(_id, {image: result.secure_url, $set: { image_public_id: result.public_id}});
                return res.send({
                    success: true,
                    message: 'Profile updated successfully'
                });
            }

            // If uploaded failed
            else {
                res.send({
                    success: false,
                    message: 'Could not upload'
                })
            }
            
        }
        upload(req);
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

async function editUserProfile(req, res) {
    try {
        let { _id } = req.user;

        // Finding user
        let user = await userModel.findById(_id);

        // If usernames are different
        if(user.username !== req.body.username) {

            // Checking if username already exists
            let existingUsername = await userModel.findOne({username: req.body.username});

            if(existingUsername) {
                return res.status(400).send({
                    success: false,
                    message: 'Username already taken'
                })
            }
            else {

                // Updating user data
                await userModel.findByIdAndUpdate(_id, req.body);
            }
        }
        else {

            // Updating user data
            await userModel.findByIdAndUpdate(_id, req.body);
        }
        return res.status(200).send({
            success: true,
            message: "Profile updated successfully"
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


module.exports = { SignUPUser, LoginUser, forgotPassword, setForgotPassword, LoggedInUser, googleOAuth, LoggedOutUser, searchUser, getUser, resetPassword, removeProfile, uploadProfile, editUserProfile };