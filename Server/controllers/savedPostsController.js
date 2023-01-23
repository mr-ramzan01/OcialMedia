const SavedPostsModel = require("../models/savedPostsModel");

async function savePosts(req, res, next) {
    try {
      const { _id } = req.user;
  
      req.body.user_id = _id;

      await SavedPostsModel.create(req.body);
  
      return res.status(201).send({
        success: true,
        message: "Post saved successfully",
      });
    } catch (error) {
      // return next(new ErrorHandler(error, 500));
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }

async function hasSaved(req, res, next) {
    try {
      const { _id } = req.user;
      const { id } = req.params;

      let savedPost = await SavedPostsModel.findOne({post_id: id, user_id: _id});
      if(savedPost) {
        return res.status(200).send({
            success: true,
            message: "Post is saved",
          });
      }
      else {
        return res.status(200).send({
            success: false,
            message: "Post is not saved",
          });
      }
  
      
    } catch (error) {
      // return next(new ErrorHandler(error, 500));
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }

async function AllSavedPosts(req, res, next) {
    try {
      const {page} = req.query;
      const {id} = req.params;

      const totalLength = await SavedPostsModel.find({user_id: id}).count();
      let savedPost = await SavedPostsModel.find({user_id: id}).populate('post_id').sort({ createdAt: -1}).skip((page-1)*20).limit(20);
      if(savedPost) {
        return res.status(200).send({
            success: true,
            message: "SavedPost data",
            data: savedPost,
            totalLength
          });
      }
      else {
        return res.status(200).send({
            success: false,
            message: "No Saved Post",
          });
      }
  
      
    } catch (error) {
      // return next(new ErrorHandler(error, 500));
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
  
  module.exports = { savePosts, hasSaved, AllSavedPosts };