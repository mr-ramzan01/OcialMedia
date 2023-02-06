const LikesModel = require("../models/likesModel");
const NofificationsModel = require("../models/notificationsModel");
const PostsModel = require("../models/postsModel");

async function getLikesOnPost(req, res) {
    try {
        let {id} = req.params;

        // If id is not specified
        if(!id) {
            return res.status(400).send({
                success: false,
                message: 'Invalid params parameters'
            })
        }

        // Finding all likes on the post
        let likes = await LikesModel.find({post_Id: id}).populate({path: 'like_by', select: ['_id', 'image', 'username', 'full_name']}).sort({createdAt: -1})
        
        return res.status(200).send({
            success: true,
            message: "Liked data on post",
            data: likes
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

async function likeRequest(req, res) {
    try {
        const {_id} = req.user;

        // Creating a new like
        let like = await LikesModel.create(req.body);

        // // Incrementing the no of likes on post
        let post = await PostsModel.findOneAndUpdate({_id: req.body.post_Id}, {$inc: {likeCount: +1}});
        
        // Creating a like notification
        if(_id !== post.user_id) {
            await NofificationsModel.create({type: 'like', from: _id, to: post.user_id, like_id: like._id  });
        }
        return res.status(201).send({
            success: true,
            message: "User liked successfully"
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function removeLikeRequest(req, res) {
    try {
        let {deleteId} = req.params;

        // If deleteId is not specified
        if(!deleteId) {
            return res.status(400).send({
                success: false,
                message: 'Invalid params parameters'
            })
        }

        // Finding the like data of deletedId
        let like = await LikesModel.findOne({_id: deleteId});

        // Decrementing the no of likes on post
        await PostsModel.findOneAndUpdate({_id: like.post_Id}, {$inc: {likeCount: -1}});

        // Deleting the like data
        await LikesModel.deleteOne({_id: deleteId });

        // Deleting a like notification
        await NofificationsModel.deleteOne({type: 'like', like_id: deleteId});

        return res.status(200).send({
            success: true,
            message: "User Unlike successfully"
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function hasLiked(req, res) {
    try {
        let { _id } = req.user;
        let {postId} = req.params;

        // If postId is not specified
        if(!postId) {
            return res.status(400).send({
                success: false,
                message: 'Invalid params parameters'
            })
        }

        // Finding the like
        let post = await LikesModel.findOne({ $and: [{post_Id: postId},{like_by: _id}]})

        // If user has liked on the post
        if(post) {
            return res.status(200).send({
                success: true,
                message: "User has liked",
                like_type: post.like_type,
                id: post._id
            })
        }

        // If user has not liked on post
        else {
            return res.status(200).send({
                success: false,
                message: "User has not liked"
            })
        }
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports =  { likeRequest, hasLiked, removeLikeRequest, getLikesOnPost };