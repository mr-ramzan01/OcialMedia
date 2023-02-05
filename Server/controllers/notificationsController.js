const NofificationsModel = require("../models/notificationsModel");

async function getAllNotifications(req, res) {
    try {
        const {_id} = req.user;
        const {page} = req.query;

        // If page is not specified
        if(!page) {
            return res.status(400).send({
                success: false,
                message: 'Invalid query parameters'
            })
        }

        // Finding total no of notifications
        let totalLength = await NofificationsModel.find({to: _id, from: {$ne: _id}}).count();

        // Finding notifications
        let notifications = await NofificationsModel.find({to: _id, from: {$ne: _id}}).populate({path: "comment_id", select: ['post_Id'], populate: {path: 'post_Id', select: ['_id', 'post_images', 'commentCount']}}).populate({path: "like_id", select: ['post_Id'], populate: {path: 'post_Id', select: ['_id', 'post_images', 'likeCount']}}).populate("follow_id").populate({path: 'from', select: ['_id', 'image', 'username', 'full_name']}).sort({createdAt: -1}).skip((page-1)*20).limit(20);

        // If no notifications are there
        if(!notifications) {
            return res.status(200).send({
                success: false,
                message: "NO notifications",
            })
        }
        return res.status(200).send({
            success: true,
            message: "Notifications data",
            data: notifications,
            totalLength
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function hasNotifications(req, res) {
    try {
        const {_id} = req.user;

        // Finding notification for user 
        let notifications = await NofificationsModel.findOne({$and: [{to: _id}, {seen: false}, {from: {$ne: _id}}]})

        // If no notification for user
        if(!notifications) {
            return res.status(200).send({
                success: false,
                message: "NO notifications",
            })
        }
        return res.status(200).send({
            success: true,
            message: "Has Notifications",
            data: notifications,
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function hasSeenNotifications(req, res) {
    try {
        const {_id} = req.user;

        // If user has seen notifications then updating it to seen true
        await NofificationsModel.updateMany({$and: [{to: _id}, {seen: false}, {from: {$ne: _id}}]}, {$set: {seen: true}})

        return res.status(200).send({
            success: true,
            message: "User has seen notifications successfully"
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = { getAllNotifications, hasNotifications, hasSeenNotifications };