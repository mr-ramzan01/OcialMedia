const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
    message: {
        type: String,
        trim: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    chat_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats"
    }
},{
    timestamps: true,
    versionKey: false
});


const MessagesModel = mongoose.model('messages', messagesSchema);

module.exports = MessagesModel;