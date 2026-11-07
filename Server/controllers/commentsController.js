const CommentsModel = require("../models/commentsModel");
const NotificationsModel = require("../models/notificationsModel");
const PostsModel = require("../models/postsModel");
const { sameId, isValidObjectId } = require("../utils/helpers");

const USER_FIELDS = ['_id', 'image', 'username', 'full_name'];

function serverError(res, error) {
    const status = error.statusCode || 500;
    if (status >= 500) console.error(error);
    return res.status(status).send({ success: false, message: error.message });
}

async function CreateComment(req, res) {
    try {
        const { _id } = req.user;
        const { post_Id, title } = req.body || {};

        if (!isValidObjectId(post_Id) || !title || !String(title).trim()) {
            return res.status(400).send({ success: false, message: 'post_Id and title are required' });
        }

        const post = await PostsModel.findById(post_Id);
        if (!post) {
            return res.status(404).send({ success: false, message: 'Post not found' });
        }

        const comment = await CommentsModel.create({ post_Id, title: String(title).trim(), comment_by: _id });
        await PostsModel.findByIdAndUpdate(post_Id, { $inc: { commentCount: 1 } });

        if (!sameId(_id, post.user_id)) {
            await NotificationsModel.create({ type: 'comment', from: _id, to: post.user_id, comment_id: comment._id });
        }

        const populated = await CommentsModel.findById(comment._id).populate({ path: 'comment_by', select: USER_FIELDS });

        return res.status(201).send({
            success: true,
            message: "Comment created successfully",
            data: populated
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function getComments(req, res) {
    try {
        const { postId } = req.params;
        if (!isValidObjectId(postId)) {
            return res.status(400).send({ success: false, message: 'Invalid params parameters' });
        }

        const comments = await CommentsModel.find({ post_Id: postId })
            .populate({ path: 'comment_by', select: USER_FIELDS })
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            message: "Comments data",
            data: comments
        })
    } catch (error) {
        return serverError(res, error);
    }
}

async function getRecentPostsComments(req, res) {
    try {
        const { postId } = req.params;
        if (!isValidObjectId(postId)) {
            return res.status(400).send({ success: false, message: 'Invalid params parameters' });
        }

        const [totalComments, comments] = await Promise.all([
            CommentsModel.countDocuments({ post_Id: postId }),
            CommentsModel.find({ post_Id: postId })
                .populate({ path: 'comment_by', select: USER_FIELDS })
                .sort({ createdAt: -1 })
                .limit(1),
        ]);

        return res.status(200).send({
            success: true,
            message: "Comments data",
            data: comments,
            totalComments
        })
    } catch (error) {
        return serverError(res, error);
    }
}

module.exports = { CreateComment, getComments, getRecentPostsComments };
