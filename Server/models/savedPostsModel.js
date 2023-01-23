const mongoose = require('mongoose');

const savedPostSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users",
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "posts",
        required: true
    }

},{
    versionKey: false,
    timestamps: true
})


const SavedPostsModel = mongoose.model('savedPosts', savedPostSchema);

module.exports = SavedPostsModel;