const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        full_name: {type: String, required: true},
        email: {type: String, required: true},
        image: {type: String, default: ''},
        authType: {type: String, required: true, enum: ['email-password', 'google'] },
        username: {type: String, required: true},
        password: {type: String, select: false},
        forgotpasswordAcces: {type: String, required: false}
    },
    {
        versionKey: false,
        timestamps: true
    }
)

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;