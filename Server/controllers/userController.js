const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { google } = require('googleapis');
const { jwtDecode } = require('jwt-decode');
const userModel = require('../models/userModel.js');
const { uploadBuffer, destroy } = require('../utils/cloudinary');
const { escapeRegExp } = require('../utils/helpers');
const { clientUrl } = require('../config/origins');

const jwt_secret_key = process.env.JWT_SECRET_KEY;
const google_client_id = process.env.GOOGLE_CLIENT_ID;
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
const google_redirect_uri = process.env.GOOGLE_REDIRECT_URI || `${clientUrl}/google_Oauth`;

const TOKEN_TTL = '30d';

function signToken(user) {
    return jwt.sign(
        { email: user.email, username: user.username, _id: user._id },
        jwt_secret_key,
        { expiresIn: TOKEN_TTL }
    );
}

function fail(res, status, message) {
    return res.status(status).send({ success: false, message });
}

function serverError(res, error) {
    const status = error.statusCode || 500;
    if (status >= 500) console.error(error);
    return res.status(status).send({ success: false, message: error.message });
}


async function LoggedOutUser(req, res) {
    try {
        res.clearCookie('ocialMedia_token', { httpOnly: true });
        return res.status(200).send({
            success: true,
            message: 'user logged out successfully'
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function LoggedInUser(req, res) {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) return fail(res, 404, 'User not found');

        return res.status(200).send({
            success: true,
            message: 'User logged in',
            data: user
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function getGoogleOAuthTokens(code) {
    const oauth2Client = new google.auth.OAuth2(google_client_id, google_client_secret, google_redirect_uri);
    const { tokens } = await oauth2Client.getToken(code);
    return tokens.id_token;
}


async function googleOAuth(req, res) {
    try {
        const { code } = req.query;
        if (!code) return fail(res, 400, 'Missing authorization code');
        if (!google_client_id || !google_client_secret) {
            return fail(res, 503, 'Google sign-in is not configured on this server');
        }

        const id_token = await getGoogleOAuthTokens(code);
        const user = jwtDecode(id_token);

        // Account already registered with email and password
        const existingUser = await userModel.findOne({ email: user.email, authType: 'email-password' });
        if (existingUser) {
            return fail(res, 403, 'User already exists with email and password');
        }

        // Returning Google user
        const existingUserWithGoogle = await userModel.findOne({ email: user.email });
        if (existingUserWithGoogle) {
            return res.status(200).send({
                success: true,
                token: signToken(existingUserWithGoogle),
                message: 'Google account has already been signed up'
            })
        }

        // New Google user: pick a free username based on the email
        const base = user.email.split('@')[0].replace(/[^a-zA-Z0-9._-]/g, '') || 'user';
        let username = base;
        let suffix = 0;
        while (await userModel.exists({ username })) {
            suffix += 1;
            username = `${base}${suffix}`;
        }

        const newUser = await userModel.create({
            full_name: user.name || base,
            email: user.email,
            image: user.picture || '',
            authType: 'google',
            username
        });

        return res.status(201).send({
            success: true,
            token: signToken(newUser),
            message: 'Google account signed up successfully'
        })

    } catch (error) {
        return serverError(res, error);
    }
};


async function LoginUser(req, res) {
    try {
        const { emailorusername, password } = req.body || {};
        if (!emailorusername || !password) return fail(res, 400, 'Email/username and password are required');

        const identifier = String(emailorusername).trim();
        const existingUser = await userModel
            .findOne({ $or: [{ email: identifier.toLowerCase() }, { username: identifier }] })
            .select('+password');

        if (!existingUser || !existingUser.password) {
            return fail(res, 401, 'Invalid Credentials');
        }

        const passwordMatches = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatches) {
            return fail(res, 401, 'Invalid Credentials');
        }

        return res.status(200).send({
            success: true,
            token: signToken(existingUser),
            message: 'Login Successfully',
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function SignUPUser(req, res) {
    try {
        const { full_name, email, username, password } = req.body || {};
        if (!full_name || !email || !username || !password) {
            return fail(res, 400, 'full_name, email, username and password are required');
        }
        const normalizedEmail = String(email).trim().toLowerCase();
        const normalizedUsername = String(username).trim();

        if (!/^[a-zA-Z0-9._-]{3,30}$/.test(normalizedUsername)) {
            return fail(res, 400, 'Username must be 3-30 characters: letters, numbers, dots, underscores or hyphens');
        }

        // Existing google account
        const existingGoogle = await userModel.findOne({ email: normalizedEmail, authType: 'google' });
        if (existingGoogle) {
            return fail(res, 403, 'User has already signed up try to continue with google.');
        }

        // Existing email
        if (await userModel.exists({ email: normalizedEmail })) {
            return fail(res, 403, 'User already exists');
        }

        // Existing username
        if (await userModel.exists({ username: normalizedUsername })) {
            return fail(res, 400, 'Username already taken');
        }

        const hashPassword = await bcrypt.hash(String(password), 10);

        const newUser = await userModel.create({
            full_name: String(full_name).trim(),
            email: normalizedEmail,
            username: normalizedUsername,
            authType: 'email-password',
            password: hashPassword,
        });

        return res.status(201).send({
            success: true,
            token: signToken(newUser),
            message: 'Signup successfully',
        })
    } catch (error) {
        if (error.code === 11000) return fail(res, 409, 'User already exists');
        return serverError(res, error);
    }
}


async function forgotPassword(req, res) {
    try {
        const email = String((req.body && req.body.email) || '').trim().toLowerCase();
        if (!email) return fail(res, 400, 'Email is required');

        const user = await userModel.findOne({ email });
        if (!user) {
            return fail(res, 404, 'No account found with this email');
        }
        if (user.authType !== 'email-password') {
            return fail(res, 400, 'This account uses Google sign-in. Log in with Google instead.');
        }

        const token = jwt.sign(
            { email: user.email, username: user.username, _id: user._id, purpose: 'reset' },
            jwt_secret_key,
            { expiresIn: 300 }
        );

        return res.status(200).send({
            success: true,
            message: 'Authenticated user',
            token,
            full_name: user.full_name
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function setForgotPassword(req, res) {
    try {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
        const { password } = req.body || {};

        if (!token || !password) {
            return fail(res, 403, 'Something went wrong, Please reset your password again.');
        }

        let decoded;
        try {
            decoded = jwt.verify(token, jwt_secret_key);
        } catch (error) {
            return fail(res, 401, error.name === 'TokenExpiredError' ? 'jwt expired' : 'Something went wrong, Please reset your password again.');
        }

        const hashPassword = await bcrypt.hash(String(password), 10);
        const updated = await userModel.findByIdAndUpdate(decoded._id, { $set: { password: hashPassword } });
        if (!updated) return fail(res, 404, 'User not found');

        return res.status(200).send({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        return serverError(res, error);
    }
}


async function resetPassword(req, res) {
    try {
        const { _id } = req.user;
        const { old_password, new_password } = req.body || {};
        if (!old_password || !new_password) return fail(res, 400, 'Old and new password are required');

        const user = await userModel.findById(_id).select('+password');
        if (!user || !user.password) {
            return fail(res, 400, 'Password login is not enabled for this account');
        }

        const passwordMatches = await bcrypt.compare(String(old_password), user.password);
        if (!passwordMatches) {
            return fail(res, 401, 'Old password does not match');
        }

        const hashPassword = await bcrypt.hash(String(new_password), 10);
        await userModel.findByIdAndUpdate(_id, { $set: { password: hashPassword } });

        return res.status(200).send({
            success: true,
            message: 'Password updated successfully'
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function searchUser(req, res) {
    try {
        const q = String(req.query.q || '').trim();
        if (!q) {
            return res.send({ success: true, message: 'related users', data: [] });
        }

        const regex = new RegExp(escapeRegExp(q), 'i');
        const users = await userModel
            .find({ $or: [{ full_name: regex }, { username: regex }] })
            .select(['_id', 'image', 'username', 'full_name'])
            .limit(50);

        return res.send({
            success: true,
            message: 'related users',
            data: users
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function getUser(req, res) {
    try {
        const { username } = req.params;
        if (!username) return fail(res, 400, 'Invalid params parameters');

        const user = await userModel.findOne({ username });
        if (!user) return fail(res, 404, 'User not found');

        return res.send({
            success: true,
            message: 'User data',
            data: user
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function removeProfile(req, res) {
    try {
        const { _id } = req.user;
        const user = await userModel.findById(_id);
        if (!user) return fail(res, 404, 'User not found');

        await destroy(user.image_public_id);
        await userModel.findByIdAndUpdate(_id, { $set: { image: '', image_public_id: '' } });

        return res.send({
            success: true,
            message: 'Profile photo successfully removed'
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function uploadProfile(req, res) {
    try {
        const { _id } = req.user;
        if (!req.file) return fail(res, 400, 'No file uploaded');

        const user = await userModel.findById(_id);
        if (!user) return fail(res, 404, 'User not found');

        const result = await uploadBuffer(req.file.buffer, { folder: 'ocial_media/profiles' });

        // Remove the previous photo only after the new one succeeded
        await destroy(user.image_public_id);
        await userModel.findByIdAndUpdate(_id, { $set: { image: result.secure_url, image_public_id: result.public_id } });

        return res.send({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        return serverError(res, error);
    }
}


async function editUserProfile(req, res) {
    try {
        const { _id } = req.user;
        const body = req.body || {};

        const user = await userModel.findById(_id);
        if (!user) return fail(res, 404, 'User not found');

        // Only these fields can be edited from the profile form
        const update = {};
        for (const field of ['full_name', 'username', 'bio', 'mobile_no']) {
            if (body[field] !== undefined) update[field] = String(body[field]).trim();
        }
        if (body.email !== undefined && user.authType !== 'google') {
            update.email = String(body.email).trim().toLowerCase();
        }

        if (update.username && update.username !== user.username) {
            if (await userModel.exists({ username: update.username, _id: { $ne: _id } })) {
                return fail(res, 400, 'Username already taken');
            }
        }
        if (update.email && update.email !== user.email) {
            if (await userModel.exists({ email: update.email, _id: { $ne: _id } })) {
                return fail(res, 400, 'Email already in use');
            }
        }

        await userModel.findByIdAndUpdate(_id, { $set: update }, { runValidators: true });

        return res.status(200).send({
            success: true,
            message: 'Profile updated successfully'
        })
    } catch (error) {
        if (error.code === 11000) return fail(res, 400, 'Username or email already taken');
        return serverError(res, error);
    }
}


module.exports = { SignUPUser, LoginUser, forgotPassword, setForgotPassword, LoggedInUser, googleOAuth, LoggedOutUser, searchUser, getUser, resetPassword, removeProfile, uploadProfile, editUserProfile };
