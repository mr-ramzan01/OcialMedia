const jwt = require("jsonwebtoken")
require('dotenv').config();

const jwt_secret_key = process.env.JWT_SECRET_KEY;

function isAuthenticated (req, res, next) {
    try {
        const authHeader = req.headers['authorization'];

        if(authHeader) {
            const ocialMedia_token = authHeader.split(' ')[1];
            // If token is not available
            if(!ocialMedia_token) {
                return res.status(401).send({
                    success: false,
                    meassage: 'User is not valid'
                })
            }
            try {
                
                // Verifying token
                jwt.verify(ocialMedia_token, jwt_secret_key);
                const user = jwt.decode(ocialMedia_token);
                req.user = user;
                next();
            } catch (error) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid token provided'
                })
            }
        }
        else {
            return res.status(400).send({
                success: false,
                message: 'Invalid authorization header'
            })
        }

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = isAuthenticated;


