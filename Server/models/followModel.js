const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
    follower_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    following_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
},{
    timestamps: true,
    versionKey: false
});

const FollowModel = mongoose.model('follows', followSchema);

module.exports = FollowModel;