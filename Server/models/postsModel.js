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
        required: true,
        trim: true
    },
    tags: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        default: ''
    },
    likeCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    }

},{
    versionKey: false,
    timestamps: true
})

postSchema.index({ user_id: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

const PostsModel = mongoose.model('posts', postSchema);

module.exports = PostsModel;
