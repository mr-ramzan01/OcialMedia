const NotificationsModel = require("../models/notificationsModel");
const { parsePage } = require("../utils/helpers");

const USER_FIELDS = ['_id', 'image', 'username', 'full_name'];

function serverError(res, error) {
    const status = error.statusCode || 500;
    if (status >= 500) console.error(error);
    return res.status(status).send({ success: false, message: error.message });
}

async function getAllNotifications(req, res) {
    try {
        const { _id } = req.user;
        const page = parsePage(req.query.page);
        const limit = 20;
        const filter = { to: _id, from: { $ne: _id } };

        const [totalLength, notifications] = await Promise.all([
            NotificationsModel.countDocuments(filter),
            NotificationsModel.find(filter)
                .populate({ path: "comment_id", select: ['post_Id'], populate: { path: 'post_Id', select: ['_id', 'post_images', 'commentCount'] } })
                .populate({ path: "like_id", select: ['post_Id'], populate: { path: 'post_Id', select: ['_id', 'post_images', 'likeCount'] } })
                .populate("follow_id")
                .populate({ path: 'from', select: USER_FIELDS })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
        ]);

        // Skip notifications whose source (post / comment / like) no longer exists
        const data = notifications.filter((n) => {
            if (n.type === 'like') return n.like_id && n.like_id.post_Id;
            if (n.type === 'comment') return n.comment_id && n.comment_id.post_Id;
            return Boolean(n.from);
        });

        return res.status(200).send({
            success: true,
            message: "Notifications data",
            data,
            totalLength
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function hasNotifications(req, res) {
    try {
        const { _id } = req.user;
        const unseen = await NotificationsModel.exists({ to: _id, seen: false, from: { $ne: _id } });

        if (!unseen) {
            return res.status(200).send({ success: false, message: "NO notifications" });
        }
        return res.status(200).send({ success: true, message: "Has Notifications" });
    } catch (error) {
        return serverError(res, error);
    }
}


async function hasSeenNotifications(req, res) {
    try {
        const { _id } = req.user;
        await NotificationsModel.updateMany({ to: _id, seen: false }, { $set: { seen: true } });

        return res.status(200).send({
            success: true,
            message: "User has seen notifications successfully"
        })
    } catch (error) {
        return serverError(res, error);
    }
}

module.exports = { getAllNotifications, hasNotifications, hasSeenNotifications };
