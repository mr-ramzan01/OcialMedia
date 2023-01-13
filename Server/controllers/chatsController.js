const ChatsModel = require("../models/chatsModel");

async function accessChat(req, res, next) {
    try {
        // const { _id } = req.user;
        console.log(req.body);

        await ChatsModel.create(req.body);

        return res.status(200).send({
            success: true,
            message: "Chat created successfully"
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = {accessChat};