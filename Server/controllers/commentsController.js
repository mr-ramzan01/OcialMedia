const CommentsModel = require("../models/commentsModel");
const NofificationsModel = require("../models/notificationsModel");
const PostsModel = require("../models/postsModel");

async function CreateComment(req, res) {
    try {
        const { _id } = req.user;
        req.body.comment_by = _id;

        // Create a new comment
        let comment = await CommentsModel.create(req.body);

        // Finding the comment
        let comments = await CommentsModel.findOne({ _id: comment._id}).populate({path: 'post_Id', select: ['user_id']});
        
        // Increment the no of comments in post
        await PostsModel.findOneAndUpdate({_id: req.body.post_Id}, {$inc: {commentCount: +1}});

        // Creating the comment notification on post
        if(_id !== comments.post_Id.user_id) {
            await NofificationsModel.create({type: 'comment', from: _id, to: comments.post_Id.user_id, comment_id: comments._id});
        }
        return res.status(200).send({
            success: true,
            message: "Comment created successfully"
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getComments(req, res) {
    try {
        const { postId } = req.params;

        // If post id is not specified
        if(!postId) {
            return res.status(400).send({
                success: false,
                message: 'Invalid params parameters'
            })
        }
        // Finding all comments
        let comments = await CommentsModel.find({post_Id: postId}).populate({path: 'comment_by', select: ['_id', 'image', 'username', 'full_name']}).sort({createdAt: -1});
        
        return res.status(200).send({
            success: true,
            message: "Comments data",
            data: comments
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

async function getRecentPostsComments(req, res) {
    try {
        const { postId } = req.params;

        // If post id is not specified
        if(!postId) {
            return res.status(400).send({
                success: false,
                message: 'Invalid params parameters'
            })
        }
        // Getting total no of comments on post 
        let totalComments = await CommentsModel.find({post_Id: postId}).count();

        // Finding a comment on post
        let comments = await CommentsModel.find({post_Id: postId}).populate({path: 'comment_by', select: ['_id', 'image', 'username', 'full_name']}).sort({createdAt: -1}).limit(1);

        return res.status(200).send({
            success: true,
            message: "Comments data",
            data: comments,
            totalComments
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = { CreateComment, getComments, getRecentPostsComments };