const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
    post_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        required: true
    },
    like_type: {
        type: String, 
        enum: ['funny', 'love', 'angry', 'cry'],
        required: true
    },
    like_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
},{
    timestamps: true,
    versionKey: false
});

const LikesModel = mongoose.model('likes', likesSchema);

module.exports = LikesModel;