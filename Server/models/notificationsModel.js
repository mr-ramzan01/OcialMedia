const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['like', 'follow', 'comment'],
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

notificationsSchema.index({ to: 1, createdAt: -1 });

// Collection name is kept as "nofifications" so existing production data keeps working.
const NotificationsModel = mongoose.model('nofifications', notificationsSchema);

module.exports = NotificationsModel;
