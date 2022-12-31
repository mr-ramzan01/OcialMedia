const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        full_name: {type: String, required: true},
        email: {type: String, required: true},
        image: {type: String, default: ''},
        authType: {type: String, required: true, enum: ['email-password', 'google'] },
        username: {type: String, required: true},
        password: {type: String, select: false},
        postsCount: {type: Number, default: 0},
        followingCount: {type: Number, default: 0},
        followerCount: {type: Number, default: 0},
        isPrivate: {type: Boolean, default: false},
        forgotpasswordAcces: {type: String, required: false}, 
        image_public_id: {type: String, required: false},
        bio: {type: String, default: ""},
        mobile_no: {type: String, default: "", minLength: [10, "Mobile no. should be 10 digits only"], maxLength: [10, "Mobile no. should be 10 digits only"]}
    },
    {
        versionKey: false,
        timestamps: true
    }
)

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;