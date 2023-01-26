const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
    message: {
        type: String,
        trim: true,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    chat_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
        required: true
    }
},{
    timestamps: true,
    versionKey: false
});


const MessagesModel = mongoose.model('messages', messagesSchema);

module.exports = MessagesModel;