const mongoose = require("mongoose");

const messagesNotificationSchema = new mongoose.Schema({
    message_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages",
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    to: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
},{
    timestamps: true,
    versionKey: false
});


const MessagesNotificationModel = mongoose.model('messagesNotifications', messagesNotificationSchema);

module.exports = MessagesNotificationModel;