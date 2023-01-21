const ChatsModel = require("../models/chatsModel");
const MessagesModel = require("../models/messagesModel");

async function sendMessage(req, res, next) {
    try {
        const { _id } = req.user;
        req.body.sender = _id;

        if(!req.body.message || !req.body.chat_id) {
            return res.status(400).send({
                success: false,
                message: 'Missing some data on body'
            })
        }

        let message = await MessagesModel.create(req.body);
        let messages = await MessagesModel.findOne({_id: message._id}).populate({path: 'sender', select: ['_id', 'image', 'username', 'full_name']}).populate('chat_id');

        await ChatsModel.findByIdAndUpdate(req.body.chat_id, {latestMessage : message._id});

        return res.status(200).send({
            success: true,
            message: "Message sent successfully",
            data: messages
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getAllMessages(req, res, next) {
    try {

        const {chatId} = req.params;

        const messagesCount = await MessagesModel.find({chat_id: chatId}).count();


        let messages = await MessagesModel.find({chat_id: chatId}).populate({path: 'sender', select: ['_id', 'image', 'username', 'full_name']});

        return res.status(200).send({
            success: true,
            message: "Messages data",
            data: messages,
            messagesLength: messagesCount
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}



module.exports = { sendMessage, getAllMessages };