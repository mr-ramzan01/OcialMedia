const jwt = require("jsonwebtoken")
require('dotenv').config();

const jwt_secret_key = process.env.JWT_SECRET_KEY;

function isAuthenticated (req, res, next) {
    try {
        let {ocialMedia_token} = req.cookies;
        if(!ocialMedia_token) {
            return res.status(403).send({
                success: false,
                meassage: 'User is not valid'
            })
        }
        let decodeData = jwt.verify(ocialMedia_token, jwt_secret_key);
        req._id = decodeData._id;
        next();
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = isAuthenticated;


