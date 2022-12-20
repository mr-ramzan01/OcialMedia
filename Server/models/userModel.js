const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        full_name: {type: String, required: true},
        email: {type: String, required: true},
        username: {type: String, required: true},
        password: {type: String, required: true},
        forgotpasswordAcces: {type: String, required: false}
    },
    {
        versionKey: false,
        timestamps: true
    }
)

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;