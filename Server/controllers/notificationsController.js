const NofificationsModel = require("../models/notificationsModel");

async function getAllNotifications(req, res, next) {
    try {
        const {_id} = req.user;

        let notifications = await NofificationsModel.find({to: _id});

        if(!deletedNotifications) {
            return res.status(200).send({
                success: false,
                message: "NO notifications",
            })
        }
        return res.status(200).send({
            success: true,
            message: "Notifications data",
            data: notifications
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