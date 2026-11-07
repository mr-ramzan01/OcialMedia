const mongoose = require("mongoose");

// NOTE: naming is historical. follower_Id = the account being followed,
// following_Id = the account that follows. Kept for data compatibility.
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

followSchema.index({ follower_Id: 1, following_Id: 1 }, { unique: true });

const FollowModel = mongoose.model('follows', followSchema);

module.exports = FollowModel;
