const LikesModel = require("../models/LikesModel");
const PostsModel = require("../models/postsModel");

async function likeRequest(req, res, next) {
    try {

        await PostsModel.findOneAndUpdate({_id: req.body.post_Id}, {$inc: {likeCount: +1}});
        await LikesModel.create(req.body);
        return res.status(200).send({
            success: true,
            message: "User liked successfully"
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function removeLikeRequest(req, res, next) {
    try {
        let {deleteId} = req.params;

        let like = await LikesModel.findOne({_id: deleteId});
        await PostsModel.findOneAndUpdate({_id: like.post_Id}, {$inc: {likeCount: -1}});
        await LikesModel.deleteOne({_id: deleteId });
        return res.status(200).send({
            success: true,
            message: "User Unlike successfully"
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function hasLiked(req, res, next) {
    try {
        let { _id } = req.user;
        let {postId} = req.params;

        let post = await LikesModel.findOne({ $and: [{post_Id: postId},{like_by: _id}]})
        if(post) {
            return res.status(200).send({
                success: true,
                message: "User has liked",
                like_type: post.like_type,
                id: post._id
            })
        }
        else {
            return res.status(404).send({
                success: false,
                message: "User has not liked"
            })
        }
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports =  { likeRequest, hasLiked, removeLikeRequest };