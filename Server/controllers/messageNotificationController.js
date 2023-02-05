const MessagesNotificationModel = require("../models/messageNotificationModel");

async function getAllMessagesNotification(req, res) {
    try {

        const {user_id} = req.params;

        // If user_id is not specified
        if(!user_id) {
            return res.status(400).send({
                success: false,
                message: 'Invalid params parameters'
            })
        }

        // Finding all the messages notifications
        let messagesNotification = await MessagesNotificationModel.find({to: user_id});

        return res.status(200).send({
            success: true,
            message: "Messages notification data",
            data: messagesNotification
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function sendMessagesNotification(req, res) {
    try {
        req.body.to = req.user._id;

        // Finding if message notification is already present
        let presentAlready = await MessagesNotificationModel.findOne({message_id: req.body.message_id});

        // If already present
        if(presentAlready) {
            return res.status(200).send({
                success: false,
                message: "Messages notification already exists",
            })
        }

        // Creating a message notification
        let notification = await MessagesNotificationModel.create(req.body);

        return res.status(200).send({
            success: true,
            message: "Messages notification added successfully",
            data: notification
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function deleteMessagesNotification(req, res) {
    try {
        const {user_id} = req.params;

        // If user_id is not specified
        if(!user_id) {
            return res.status(400).send({
                success: false,
                message: 'Invalid params parameters'
            })
        }

        // Deleting all the messages notificaions
        let deletedNotifications = await MessagesNotificationModel.deleteMany({from: user_id, to: req.user._id});

        // if not messages to delete
        if(!deletedNotifications) {
            return res.status(200).send({
                success: false,
                message: "NO notifications to delete",
            })
        }
        return res.status(200).send({
            success: true,
            message: "Messages notification deleted successfully",
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = { getAllMessagesNotification, sendMessagesNotification, deleteMessagesNotification };