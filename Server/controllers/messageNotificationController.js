const MessagesNotificationModel = require("../models/messageNotificationModel");

async function getAllMessagesNotification(req, res, next) {
    try {

        const {user_id} = req.params;

        let messagesNotification = await MessagesNotificationModel.find({to: user_id});

        return res.status(200).send({
            success: true,
            message: "Messages notification data",
            data: messagesNotification
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function sendMessagesNotification(req, res, next) {
    try {
        req.body.to = req.user._id;

        let presentAlready = await MessagesNotificationModel.findOne({message_id: req.body.message_id});

        if(presentAlready) {
            return res.status(200).send({
                success: false,
                message: "Messages notification already exists",
            })
        }

        let notification = await MessagesNotificationModel.create(req.body);
        // let messagesNotification = await MessagesNotificationModel.find({to: user_id});

        return res.status(200).send({
            success: true,
            message: "Messages notification added successfully",
            data: notification
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function deleteMessagesNotification(req, res, next) {
    try {
        const {user_id} = req.params;

        await MessagesNotificationModel.deleteMany({from: user_id, to: req.user._id});

        return res.status(200).send({
            success: true,
            message: "Messages notification deleted successfully",
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = { getAllMessagesNotification, sendMessagesNotification, deleteMessagesNotification };