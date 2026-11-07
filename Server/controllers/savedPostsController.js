const SavedPostsModel = require("../models/savedPostsModel");
const PostsModel = require("../models/postsModel");
const { parsePage, isValidObjectId } = require("../utils/helpers");

function serverError(res, error) {
  const status = error.statusCode || 500;
  if (status >= 500) console.error(error);
  return res.status(status).send({ success: false, message: error.message });
}

async function savePosts(req, res) {
  try {
    const { _id } = req.user;
    const { post_id } = req.body || {};

    if (!isValidObjectId(post_id)) {
      return res.status(400).send({ success: false, message: 'post_id is required' });
    }
    if (!(await PostsModel.exists({ _id: post_id }))) {
      return res.status(404).send({ success: false, message: 'Post not found' });
    }

    const existing = await SavedPostsModel.findOne({ user_id: _id, post_id });
    if (existing) {
      return res.status(200).send({ success: true, message: "Post already saved" });
    }

    await SavedPostsModel.create({ user_id: _id, post_id });

    return res.status(201).send({
      success: true,
      message: "Post saved successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).send({ success: true, message: "Post already saved" });
    }
    return serverError(res, error);
  }
}

async function unsavePosts(req, res) {
  try {
    const { _id } = req.user;
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).send({ success: false, message: 'Invalid params parameters' });
    }

    await SavedPostsModel.deleteOne({ user_id: _id, post_id: id });
    return res.status(200).send({ success: true, message: "Post removed from saved" });
  } catch (error) {
    return serverError(res, error);
  }
}

async function hasSaved(req, res) {
  try {
    const { _id } = req.user;
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).send({ success: false, message: 'Invalid params parameters' });
    }

    const savedPost = await SavedPostsModel.findOne({ post_id: id, user_id: _id });
    if (savedPost) {
      return res.status(200).send({ success: true, message: "Post is saved" });
    }
    return res.status(200).send({ success: false, message: "Post is not saved" });
  } catch (error) {
    return serverError(res, error);
  }
}

async function AllSavedPosts(req, res) {
  try {
    const { _id } = req.user;
    const { id } = req.params;
    const page = parsePage(req.query.page);
    const limit = 20;

    if (!isValidObjectId(id)) {
      return res.status(400).send({ success: false, message: 'Invalid params parameters' });
    }
    // Saved posts are private to their owner
    if (String(id) !== String(_id)) {
      return res.status(403).send({ success: false, message: 'Not allowed' });
    }

    const [totalLength, savedPost] = await Promise.all([
      SavedPostsModel.countDocuments({ user_id: id }),
      SavedPostsModel.find({ user_id: id })
        .populate("post_id")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    // Drop entries whose post has since been deleted
    const data = savedPost.filter((el) => el.post_id);

    return res.status(200).send({
      success: true,
      message: "SavedPost data",
      data,
      totalLength,
    });
  } catch (error) {
    return serverError(res, error);
  }
}

module.exports = { savePosts, unsavePosts, hasSaved, AllSavedPosts };
