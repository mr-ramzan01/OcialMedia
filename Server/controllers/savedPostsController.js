const SavedPostsModel = require("../models/savedPostsModel");

async function savePosts(req, res) {
  try {
    const { _id } = req.user;
    req.body.user_id = _id;

    // Creating a new SavedPost
    await SavedPostsModel.create(req.body);

    return res.status(201).send({
      success: true,
      message: "Post saved successfully",
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

async function hasSaved(req, res) {
  try {
    const { _id } = req.user;
    const { id } = req.params;

    // If id is not specified
    if(!id) {
      return res.status(400).send({
        success: false,
        message: 'Invalid params parameters'
      })
    }

    // Finding saved post
    let savedPost = await SavedPostsModel.findOne({
      post_id: id,
      user_id: _id,
    });

    // If saved already
    if (savedPost) {
      return res.status(200).send({
        success: true,
        message: "Post is saved",
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "Post is not saved",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

async function AllSavedPosts(req, res) {
  try {
    const { page } = req.query;
    const { id } = req.params;

    // If id is not specified
    if(!id) {
      return res.status(400).send({
        success: false,
        message: 'Invalid params parameters'
      })
    }

    // Finding total length of saved posts of a user
    const totalLength = await SavedPostsModel.find({ user_id: id }).count();
    let savedPost = await SavedPostsModel.find({ user_id: id })
      .populate("post_id")
      .sort({ createdAt: -1 })
      .skip((page - 1) * 20)
      .limit(20);

    // If user has saved posts  
    if (savedPost) {
      return res.status(200).send({
        success: true,
        message: "SavedPost data",
        data: savedPost,
        totalLength,
      });

    // If user has not any saved post  
    } else {
      return res.status(200).send({
        success: false,
        message: "No Saved Post",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { savePosts, hasSaved, AllSavedPosts };
