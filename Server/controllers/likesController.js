const LikesModel = require("../models/likesModel");
const NotificationsModel = require("../models/notificationsModel");
const PostsModel = require("../models/postsModel");
const { sameId, isValidObjectId } = require("../utils/helpers");

const USER_FIELDS = ['_id', 'image', 'username', 'full_name'];

function serverError(res, error) {
    const status = error.statusCode || 500;
    if (status >= 500) console.error(error);
    return res.status(status).send({ success: false, message: error.message });
}

async function getLikesOnPost(req, res) {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).send({ success: false, message: 'Invalid params parameters' });
        }

        const likes = await LikesModel.find({ post_Id: id })
            .populate({ path: 'like_by', select: USER_FIELDS })
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            message: "Liked data on post",
            data: likes
        })
    } catch (error) {
        return serverError(res, error);
    }
}

async function likeRequest(req, res) {
    try {
        const { _id } = req.user;
        const { post_Id, like_type } = req.body || {};

        if (!isValidObjectId(post_Id) || !like_type) {
            return res.status(400).send({ success: false, message: 'post_Id and like_type are required' });
        }

        const post = await PostsModel.findById(post_Id);
        if (!post) {
            return res.status(404).send({ success: false, message: 'Post not found' });
        }

        // One reaction per user per post: update the type if it already exists
        const existing = await LikesModel.findOne({ post_Id, like_by: _id });
        if (existing) {
            existing.like_type = like_type;
            await existing.save();
            return res.status(200).send({ success: true, message: "Reaction updated", id: existing._id });
        }

        const like = await LikesModel.create({ post_Id, like_type, like_by: _id });
        await PostsModel.findByIdAndUpdate(post_Id, { $inc: { likeCount: 1 } });

        if (!sameId(_id, post.user_id)) {
            await NotificationsModel.create({ type: 'like', from: _id, to: post.user_id, like_id: like._id });
        }

        return res.status(201).send({
            success: true,
            message: "User liked successfully",
            id: like._id
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function removeLikeRequest(req, res) {
    try {
        const { _id } = req.user;
        const { deleteId } = req.params;
        if (!isValidObjectId(deleteId)) {
            return res.status(400).send({ success: false, message: 'Invalid params parameters' });
        }

        const like = await LikesModel.findById(deleteId);
        if (!like) {
            return res.status(404).send({ success: false, message: 'Like not found' });
        }
        if (!sameId(like.like_by, _id)) {
            return res.status(403).send({ success: false, message: 'You can only remove your own reaction' });
        }

        await LikesModel.deleteOne({ _id: deleteId });
        await PostsModel.findByIdAndUpdate(like.post_Id, { $inc: { likeCount: -1 } });
        await NotificationsModel.deleteOne({ type: 'like', like_id: deleteId });

        return res.status(200).send({
            success: true,
            message: "User Unlike successfully"
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function hasLiked(req, res) {
    try {
        const { _id } = req.user;
        const { postId } = req.params;
        if (!isValidObjectId(postId)) {
            return res.status(400).send({ success: false, message: 'Invalid params parameters' });
        }

        const like = await LikesModel.findOne({ post_Id: postId, like_by: _id });

        if (like) {
            return res.status(200).send({
                success: true,
                message: "User has liked",
                like_type: like.like_type,
                id: like._id
            })
        }
        return res.status(200).send({
            success: false,
            message: "User has not liked"
        })
    } catch (error) {
        return serverError(res, error);
    }
}

module.exports = { likeRequest, hasLiked, removeLikeRequest, getLikesOnPost };
