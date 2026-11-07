const MessagesNotificationModel = require("../models/messageNotificationModel");
const { isValidObjectId, sameId } = require("../utils/helpers");

function serverError(res, error) {
    const status = error.statusCode || 500;
    if (status >= 500) console.error(error);
    return res.status(status).send({ success: false, message: error.message });
}

async function getAllMessagesNotification(req, res) {
    try {
        const { _id } = req.user;
        const { user_id } = req.params;
        if (!isValidObjectId(user_id)) {
            return res.status(400).send({ success: false, message: 'Invalid params parameters' });
        }
        if (!sameId(user_id, _id)) {
            return res.status(403).send({ success: false, message: 'Not allowed' });
        }

        const messagesNotification = await MessagesNotificationModel.find({ to: _id }).sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            message: "Messages notification data",
            data: messagesNotification
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function sendMessagesNotification(req, res) {
    try {
        const { _id } = req.user;
        const { message_id, from } = req.body || {};
        if (!isValidObjectId(message_id) || !isValidObjectId(from)) {
            return res.status(400).send({ success: false, message: 'message_id and from are required' });
        }

        const presentAlready = await MessagesNotificationModel.findOne({ message_id, to: _id });
        if (presentAlready) {
            return res.status(200).send({
                success: false,
                message: "Messages notification already exists",
            })
        }

        const notification = await MessagesNotificationModel.create({ message_id, from, to: _id });

        return res.status(201).send({
            success: true,
            message: "Messages notification added successfully",
            data: notification
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function deleteMessagesNotification(req, res) {
    try {
        const { _id } = req.user;
        const { user_id } = req.params;
        if (!isValidObjectId(user_id)) {
            return res.status(400).send({ success: false, message: 'Invalid params parameters' });
        }

        await MessagesNotificationModel.deleteMany({ from: user_id, to: _id });

        return res.status(200).send({
            success: true,
            message: "Messages notification deleted successfully",
        })
    } catch (error) {
        return serverError(res, error);
    }
}

module.exports = { getAllMessagesNotification, sendMessagesNotification, deleteMessagesNotification };
