const ChatsModel = require("../models/chatsModel");
const MessagesModel = require("../models/messagesModel");

async function sendMessage(req, res, next) {
    try {
        const { _id } = req.user;
        req.body.sender = _id;

        let message = await MessagesModel.create(req.body);

        await ChatsModel.findByIdAndUpdate(req.body.chat_id, {latestMessage : message._id});

        return res.status(200).send({
            success: true,
            message: "Message sent successfully"
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = { sendMessage };