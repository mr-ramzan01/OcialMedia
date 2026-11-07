const ChatsModel = require("../models/chatsModel");
const MessagesModel = require("../models/messagesModel");
const { isValidObjectId } = require("../utils/helpers");

const USER_FIELDS = ['_id', 'image', 'username', 'full_name'];

function serverError(res, error) {
    const status = error.statusCode || 500;
    if (status >= 500) console.error(error);
    return res.status(status).send({ success: false, message: error.message });
}

async function sendMessage(req, res) {
    try {
        const { _id } = req.user;
        const { message, chat_id } = req.body || {};

        if (!message || !String(message).trim() || !isValidObjectId(chat_id)) {
            return res.status(400).send({ success: false, message: 'Missing some data on body' });
        }

        // Only members of the chat can post into it
        const chat = await ChatsModel.findOne({ _id: chat_id, users: _id });
        if (!chat) {
            return res.status(403).send({ success: false, message: 'You are not part of this chat' });
        }

        const created = await MessagesModel.create({ message: String(message).trim(), chat_id, sender: _id });
        const populated = await MessagesModel.findById(created._id)
            .populate({ path: 'sender', select: USER_FIELDS })
            .populate('chat_id');

        await ChatsModel.findByIdAndUpdate(chat_id, { latestMessage: created._id });

        return res.status(201).send({
            success: true,
            message: "Message sent successfully",
            data: populated
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function getAllMessages(req, res) {
    try {
        const { _id } = req.user;
        const { chatId } = req.params;
        if (!isValidObjectId(chatId)) {
            return res.status(400).send({ success: false, message: 'Invalid params parameters' });
        }

        const chat = await ChatsModel.findOne({ _id: chatId, users: _id });
        if (!chat) {
            return res.status(403).send({ success: false, message: 'You are not part of this chat' });
        }

        const [messagesCount, messages] = await Promise.all([
            MessagesModel.countDocuments({ chat_id: chatId }),
            MessagesModel.find({ chat_id: chatId })
                .populate({ path: 'sender', select: USER_FIELDS })
                .sort({ createdAt: 1 }),
        ]);

        return res.status(200).send({
            success: true,
            message: "Messages data",
            data: messages,
            messagesLength: messagesCount
        })
    } catch (error) {
        return serverError(res, error);
    }
}

module.exports = { sendMessage, getAllMessages };
