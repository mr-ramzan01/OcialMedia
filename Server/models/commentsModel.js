const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
    post_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        required: true
    },
    comment_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    title: {
        type: String,
        required: true
    }
},{
    timestamps: true,
    versionKey: false
});

const LikesModel = mongoose.model('likes', likesSchema);

module.exports = LikesModel;