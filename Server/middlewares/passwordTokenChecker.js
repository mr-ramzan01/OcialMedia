const userModel = require("../models/userModel");

async function passwordTokenCheck(req, res, next) {
    try {
        let {forgot_password_access} = req.cookies;
        if(!forgot_password_access) {
            return res.status(403).send({
                success: false,
                message: 'Somthing went wrong, Please reset your password again.'
            })
        }
        let user = await userModel.findOne({forgotpasswordAcces: forgot_password_access});
        if(!user) {
            return res.status(404).send({
                success: false,
                message: 'Invalid forgot token'
            })
        }
        req.forgot_password_access = forgot_password_access;
        next();
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = passwordTokenCheck;