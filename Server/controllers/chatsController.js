const ChatsModel = require("../models/chatsModel");

async function accessChat(req, res) {
  try {
    const { _id } = req.user;
    const { userId } = req.body;

    // User id is not there
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: 'UserId required'
      })
    }

    // User id is there finding chat
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

    // If chat is already created
    if (isChat.length > 0) {
      return res.status(200).send({
        success: false,
        message: 'Chat has already created',
        data: isChat[0]
      });

    // Creating a new chat  
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      try {
        const createdChat = await ChatsModel.create(chatData);
        const FullChat = await ChatsModel.findOne({ _id: createdChat._id }).populate({path: "users", select: ['_id', 'image', 'username', 'full_name']});
        return res.status(201).send({
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

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}


async function getAllChats(req, res) {
  try {
    const { _id } = req.user;

    // Finding all chats
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
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { accessChat, getAllChats };
