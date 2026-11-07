const ChatsModel = require("../models/chatsModel");
const userModel = require("../models/userModel");
const { isValidObjectId, sameId } = require("../utils/helpers");

const USER_FIELDS = ["_id", "image", "username", "full_name"];

function serverError(res, error) {
  const status = error.statusCode || 500;
  if (status >= 500) console.error(error);
  return res.status(status).send({ success: false, message: error.message });
}

async function accessChat(req, res) {
  try {
    const { _id } = req.user;
    const { userId } = req.body || {};

    if (!isValidObjectId(userId)) {
      return res.status(400).send({ success: false, message: 'UserId required' });
    }
    if (sameId(userId, _id)) {
      return res.status(400).send({ success: false, message: 'You cannot chat with yourself' });
    }
    if (!(await userModel.exists({ _id: userId }))) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }

    const existing = await ChatsModel.findOne({
      isGroupChat: false,
      users: { $all: [_id, userId] },
    })
      .populate({ path: "users", select: USER_FIELDS })
      .populate("latestMessage");

    if (existing) {
      return res.status(200).send({
        success: true,
        message: 'Chat already exists',
        data: existing
      });
    }

    const createdChat = await ChatsModel.create({
      chatName: "sender",
      isGroupChat: false,
      users: [_id, userId],
    });
    const fullChat = await ChatsModel.findById(createdChat._id).populate({ path: "users", select: USER_FIELDS });

    return res.status(201).send({
      success: true,
      message: "Chat created successfully",
      data: fullChat,
    });
  } catch (error) {
    return serverError(res, error);
  }
}


async function getAllChats(req, res) {
  try {
    const { _id } = req.user;

    const data = await ChatsModel.find({ users: _id })
      .populate({ path: "users", select: USER_FIELDS })
      .populate({ path: "latestMessage", populate: { path: 'sender', select: USER_FIELDS } })
      .sort({ updatedAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Chat data",
      data,
    });
  } catch (error) {
    return serverError(res, error);
  }
}

module.exports = { accessChat, getAllChats };
