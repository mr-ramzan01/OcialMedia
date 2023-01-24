const NofificationsModel = require("../models/notificationsModel");

async function getAllNotifications(req, res, next) {
    try {
        const {_id} = req.user;

        let totalLength = await NofificationsModel.find({to: _id}).count();
        let notifications = await NofificationsModel.find({to: _id}).populate({path: "comment_id", select: ['post_Id'], populate: {path: 'post_Id', select: ['_id', 'post_images', 'commentCount']}}).populate({path: "like_id", select: ['post_Id'], populate: {path: 'post_Id', select: ['_id', 'post_images', 'likeCount']}}).populate("follow_id").populate({path: 'from', select: ['_id', 'image', 'username', 'full_name']}).sort({createdAt: -1});

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
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = { getAllNotifications };