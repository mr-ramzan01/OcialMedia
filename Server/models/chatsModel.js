const mongoose = require("mongoose");

const chatsSchema = new mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: { 
        type: Boolean,
        default: false
    },
    users: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "users",
            required: true,
        },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
    groupAdmin: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
},{
    timestamps: true,
    versionKey: false
});


chatsSchema.path('users').validate((val) => {
    console.log(val.length);
    if(val.length < 2) {
        console.log('herer')
        throw new Error('Provide atleast two users');
    }
})

const ChatsModel = mongoose.model('chats', chatsSchema);

module.exports = ChatsModel;