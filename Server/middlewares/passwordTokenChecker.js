const jwt = require("jsonwebtoken")
require('dotenv').config();

const jwt_secret_key = process.env.JWT_SECRET_KEY;

async function passwordTokenCheck(req, res, next) {
    try {
        const {token} = req.params;
        console.log(token, 'token');
        if(!token) {
            return res.send({
                success: false,
                message: 'please provide a token'
            })
        }
        let verify = jwt.verify(token, jwt_secret_key);
        if(verify?._id) {
            req.body._id = verify._id;
            next();
        }
        return res.status(403).send({
            success: false,
            message: 'Something went wrong, Please reset your password again here.'
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = passwordTokenCheck;