const mongoose = require("mongoose");

const nofificationsSchema = new mongoose.Schema({
    type: {
        type: String,
        emun: ['like', 'follow', 'comment'],
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    comment_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments"
    },
    follow_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "follows"
    },
    like_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "likes"
    },
    seen: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    versionKey: false
});


const NofificationsModel = mongoose.model('nofifications', nofificationsSchema);

module.exports = NofificationsModel;