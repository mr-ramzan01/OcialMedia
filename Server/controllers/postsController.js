const PostsModel = require('../models/postsModel');
const userModel = require('../models/userModel');
const { uploadBuffer, destroy } = require('../utils/cloudinary');
const LikesModel = require('../models/likesModel');
const CommentsModel = require('../models/commentsModel');
const SavedPostsModel = require('../models/savedPostsModel');
const NotificationsModel = require('../models/notificationsModel');
const { parsePage, isValidObjectId } = require('../utils/helpers');

const USER_FIELDS = ['_id', 'image', 'username', 'full_name'];

function serverError(res, error) {
    const status = error.statusCode || 500;
    if (status >= 500) console.error(error);
    return res.status(status).send({ success: false, message: error.message });
}

async function postOnCloudinary(req, res) {
    try {
        if (!req.file) {
            return res.status(400).send({ success: false, message: 'No file uploaded' });
        }
        const result = await uploadBuffer(req.file.buffer, { folder: 'ocial_media/posts' });
        return res.send({
            success: true,
            message: 'post uploaded on cloudinary',
            data: result
        });
    } catch (error) {
        return serverError(res, error);
    }
}


async function createPosts(req, res) {
    try {
        const { _id } = req.user;
        const { caption, location = '', tags = [], post_images = [] } = req.body || {};

        if (!caption || !String(caption).trim()) {
            return res.status(400).send({ success: false, message: 'Caption is required' });
        }
        if (!Array.isArray(post_images) || post_images.length === 0) {
            return res.status(400).send({ success: false, message: 'At least one image is required' });
        }

        const post = await PostsModel.create({
            user_id: _id,
            caption: String(caption).trim(),
            location: String(location || ''),
            tags: Array.isArray(tags) ? tags.map(String).filter(Boolean).slice(0, 5) : [],
            post_images: post_images.map((img) => ({ url: img.url, public_id: img.public_id })),
        });

        await userModel.findByIdAndUpdate(_id, { $inc: { postsCount: 1 } });

        return res.status(201).send({
            success: true,
            message: 'Post created successfully',
            data: post
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function getExploreData(req, res) {
    try {
        const page = parsePage(req.query.page);
        const limit = 24;

        const [totalData, explore] = await Promise.all([
            PostsModel.countDocuments(),
            PostsModel.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        ]);

        return res.status(200).send({
            success: true,
            message: 'Explore Data',
            data: explore,
            totalData
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function getPosts(req, res) {
    try {
        const { username } = req.params;
        const page = parsePage(req.query.page);
        const limit = 24;

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        const [totalPosts, data] = await Promise.all([
            PostsModel.countDocuments({ user_id: user._id }),
            PostsModel.find({ user_id: user._id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        ]);

        return res.status(200).send({
            success: true,
            message: 'Post data',
            data,
            totalPosts
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function getSinglePost(req, res) {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).send({ success: false, message: 'Invalid params parameters' });
        }

        const data = await PostsModel.findById(id).populate({ path: 'user_id', select: USER_FIELDS });
        if (!data) {
            return res.status(404).send({ success: false, message: 'Post not found' });
        }

        return res.status(200).send({
            success: true,
            message: 'Post data',
            data
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function getRecentPosts(req, res) {
    try {
        const page = parsePage(req.query.page);
        const limit = 10;

        const [totalData, recentPosts] = await Promise.all([
            PostsModel.countDocuments(),
            PostsModel.find()
                .populate({ path: 'user_id', select: USER_FIELDS })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
        ]);

        return res.status(200).send({
            success: true,
            message: 'Recent posts',
            data: recentPosts,
            totalData
        })
    } catch (error) {
        return serverError(res, error);
    }
}

async function deletePost(req, res) {
    try {
        const { _id } = req.user;
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).send({ success: false, message: 'Invalid params parameters' });
        }

        const post = await PostsModel.findById(id);
        if (!post) {
            return res.status(404).send({ success: false, message: 'Post not found' });
        }
        if (String(post.user_id) !== String(_id)) {
            return res.status(403).send({ success: false, message: 'You can only delete your own posts' });
        }

        // Remove the post and everything that points at it
        const [likes, comments] = await Promise.all([
            LikesModel.find({ post_Id: id }).select('_id'),
            CommentsModel.find({ post_Id: id }).select('_id'),
        ]);
        await Promise.all([
            PostsModel.deleteOne({ _id: id }),
            LikesModel.deleteMany({ post_Id: id }),
            CommentsModel.deleteMany({ post_Id: id }),
            SavedPostsModel.deleteMany({ post_id: id }),
            NotificationsModel.deleteMany({
                $or: [{ like_id: { $in: likes.map((l) => l._id) } }, { comment_id: { $in: comments.map((c) => c._id) } }],
            }),
            userModel.findByIdAndUpdate(_id, { $inc: { postsCount: -1 } }),
        ]);

        // Remote images last; failures here are logged, not fatal
        await Promise.all((post.post_images || []).map((img) => destroy(img.public_id)));

        return res.status(200).send({ success: true, message: 'Post deleted' });
    } catch (error) {
        return serverError(res, error);
    }
}

module.exports = { createPosts, postOnCloudinary, getPosts, getExploreData, getSinglePost, getRecentPosts, deletePost };
