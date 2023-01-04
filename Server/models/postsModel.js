const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users",
        required: true
    },
    post_images: [
        {
            url: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            }
        }
    ],
    caption: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        default: ''
    }

},{
    versionKey: false,
    timestamps: true
})


const PostsModel = mongoose.model('posts', postSchema);

module.exports = PostsModel;