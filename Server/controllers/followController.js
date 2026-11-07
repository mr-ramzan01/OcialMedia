const FollowModel = require("../models/followModel");
const NotificationsModel = require("../models/notificationsModel");
const userModel = require("../models/userModel");
const { sameId, isValidObjectId } = require("../utils/helpers");

const USER_FIELDS = ['_id', 'image', 'username', 'full_name'];

// Naming is historical (see followModel.js):
//   follower_Id  = the account being followed
//   following_Id = the account that follows (always the authenticated user for writes)

function serverError(res, error) {
    const status = error.statusCode || 500;
    if (status >= 500) console.error(error);
    return res.status(status).send({ success: false, message: error.message });
}

async function isFollowing(req, res) {
    try {
        const { followerID, followingID } = req.query;
        if (!isValidObjectId(followerID) || !isValidObjectId(followingID)) {
            return res.status(400).send({ success: false, message: 'Invalid query parameters' });
        }

        const follower = await FollowModel.findOne({ following_Id: followingID, follower_Id: followerID });
        if (!follower) {
            return res.status(200).send({ success: false, message: 'Not following' });
        }
        return res.status(200).send({ success: true, message: 'Following' });
    } catch (error) {
        return serverError(res, error);
    }
}


async function followRequest(req, res) {
    try {
        const { _id } = req.user;
        const { follower_Id } = req.body || {};
        const following_Id = _id;

        if (!isValidObjectId(follower_Id)) {
            return res.status(400).send({ success: false, message: 'Invalid request body' });
        }
        if (sameId(follower_Id, following_Id)) {
            return res.status(400).send({ success: false, message: 'You cannot follow yourself' });
        }
        if (!(await userModel.exists({ _id: follower_Id }))) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        const alreadyFollowing = await FollowModel.findOne({ follower_Id, following_Id });
        if (alreadyFollowing) {
            return res.status(200).send({ success: true, message: 'Already following' });
        }

        const follow = await FollowModel.create({ follower_Id, following_Id });

        await Promise.all([
            userModel.findByIdAndUpdate(following_Id, { $inc: { followingCount: 1 } }),
            userModel.findByIdAndUpdate(follower_Id, { $inc: { followerCount: 1 } }),
            NotificationsModel.create({ type: 'follow', from: following_Id, to: follower_Id, follow_id: follow._id }),
        ]);

        return res.status(201).send({ success: true, message: 'Successfully following' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).send({ success: true, message: 'Already following' });
        }
        return serverError(res, error);
    }
}


async function unFollowRequest(req, res) {
    try {
        const { _id } = req.user;
        const { follower_Id } = req.body || {};
        const following_Id = _id;

        if (!isValidObjectId(follower_Id)) {
            return res.status(400).send({ success: false, message: 'Invalid request body' });
        }

        const deleted = await FollowModel.findOneAndDelete({ follower_Id, following_Id });
        if (!deleted) {
            return res.status(200).send({ success: true, message: 'Not following' });
        }

        await Promise.all([
            userModel.findByIdAndUpdate(following_Id, { $inc: { followingCount: -1 } }),
            userModel.findByIdAndUpdate(follower_Id, { $inc: { followerCount: -1 } }),
            NotificationsModel.deleteOne({ type: 'follow', follow_id: deleted._id }),
        ]);

        return res.status(200).send({ success: true, message: 'Successfully Unfollow' });
    } catch (error) {
        return serverError(res, error);
    }
}


async function getFollowers(req, res) {
    try {
        const { userID } = req.query;
        if (!isValidObjectId(userID)) {
            return res.status(400).send({ success: false, message: 'Invalid query parameters' });
        }

        const followers = await FollowModel.find({ follower_Id: userID })
            .populate({ path: 'following_Id', select: USER_FIELDS })
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).send({ success: true, message: 'Followers data', data: followers });
    } catch (error) {
        return serverError(res, error);
    }
}


async function getFollowing(req, res) {
    try {
        const { userID } = req.query;
        if (!isValidObjectId(userID)) {
            return res.status(400).send({ success: false, message: 'Invalid query parameters' });
        }

        const following = await FollowModel.find({ following_Id: userID })
            .populate({ path: 'follower_Id', select: USER_FIELDS })
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).send({ success: true, message: 'Following data', data: following });
    } catch (error) {
        return serverError(res, error);
    }
}

module.exports = { isFollowing, followRequest, unFollowRequest, getFollowers, getFollowing }
