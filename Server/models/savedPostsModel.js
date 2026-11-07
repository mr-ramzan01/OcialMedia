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

savedPostSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

const SavedPostsModel = mongoose.model('savedPosts', savedPostSchema);

module.exports = SavedPostsModel;
