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
    like_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "likes"
    }
},{
    timestamps: true,
    versionKey: false
});


const NofificationsModel = mongoose.model('nofifications', nofificationsSchema);

module.exports = NofificationsModel;