const FollowModel = require('../models/followModel');
const StoriesModel = require('../models/storiesModel');
const { uploadBuffer, destroy } = require('../utils/cloudinary');

const USER_FIELDS = ['_id', 'image', 'username', 'full_name'];
const STORY_TTL_MS = 24 * 60 * 60 * 1000;

function serverError(res, error) {
    const status = error.statusCode || 500;
    if (status >= 500) console.error(error);
    return res.status(status).send({ success: false, message: error.message });
}

async function uploadStory(req, res) {
    try {
        const { _id } = req.user;
        if (!req.file) {
            return res.status(400).send({ success: false, message: 'No file uploaded' });
        }

        const result = await uploadBuffer(req.file.buffer, { folder: 'ocial_media/stories' });
        await StoriesModel.create({ user_id: _id, image: result.secure_url, public_id: result.public_id });

        return res.status(201).send({
            success: true,
            message: 'Story added successfully'
        });
    } catch (error) {
        return serverError(res, error);
    }
}


async function getAllStories(req, res) {
    try {
        const { _id } = req.user;

        // Everyone the current user follows, plus the user themself
        const following = await FollowModel.find({ following_Id: _id }).select('follower_Id');
        const authors = [_id, ...following.map((el) => el.follower_Id)];

        // Purge stories older than 24 hours (remote asset first, then the record)
        const expired = await StoriesModel.find({ user_id: { $in: authors }, createdAt: { $lte: new Date(Date.now() - STORY_TTL_MS) } });
        await Promise.all(expired.map(async (el) => {
            await destroy(el.public_id);
            await StoriesModel.deleteOne({ _id: el._id });
        }));

        const stories = await StoriesModel.find({ user_id: { $in: authors } })
            .populate({ path: 'user_id', select: USER_FIELDS })
            .sort({ createdAt: -1 });

        return res.send({
            success: true,
            message: 'Stories data',
            data: stories
        })
    } catch (error) {
        return serverError(res, error);
    }
}


async function getAllStoriesDate(req, res) {
    return res.send({
        success: true,
        message: 'following data',
    })
}

module.exports = { uploadStory, getAllStories, getAllStoriesDate };
