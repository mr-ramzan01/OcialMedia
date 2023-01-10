const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
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

const CommentsModel = mongoose.model('comments', commentsSchema);

module.exports = CommentsModel;