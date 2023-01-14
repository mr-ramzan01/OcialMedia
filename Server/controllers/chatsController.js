const { populate } = require("../models/chatsModel");
const ChatsModel = require("../models/chatsModel");

async function accessChat(req, res, next) {
  try {
    const { _id } = req.user;
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId param not sent with request");
      return res.status(400).send({
        success: false,
        message: 'UserId required'
      })
    }

    var isChat = await ChatsModel.find({
      isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: _id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
    })
      .populate({
        path: "users",
        select: ["_id", "image", "username", "full_name"],
      })
      .populate("latestMessage");

    // isChat = await User.populate(isChat, {
    //   path: "latestMessage.sender",
    //   select: ['_id', 'image', 'username', 'full_name'],
    // });

    if (isChat.length > 0) {
      return res.status(200).send({
        success: false,
        message: 'Chat has already created',
        data: isChat[0]
      });
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      try {
        const createdChat = await ChatsModel.create(chatData);
        const FullChat = await ChatsModel.findOne({ _id: createdChat._id }).populate({path: "users", select: ['_id', 'image', 'username', 'full_name']});
        return res.status(200).send({
          success: true,
          message: "Chat created successfully",
          data: FullChat,
        });
      } catch (error) {
        return res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    }

    await ChatsModel.create(req.body);

    return res.status(200).send({
      success: true,
      message: "Chat created successfully",
    });
  } catch (error) {
    // return next(new ErrorHandler(error, 500));
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

async function getAllChats(req, res, next) {
  try {
    const { _id } = req.user;

    const data = await ChatsModel.find({ users: { $elemMatch: { $eq: _id } } })
      .populate({
        path: "users",
        select: ["_id", "image", "username", "full_name"],
      })
      .populate({path: "latestMessage", populate: {path: 'sender', select: ['_id', 'image', 'username', 'full_name'] }})
      .sort({updatedAt: -1})

    return res.status(200).send({
      success: true,
      message: "Chat data",
      data: data,
    });
  } catch (error) {
    // return next(new ErrorHandler(error, 500));
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { accessChat, getAllChats };
