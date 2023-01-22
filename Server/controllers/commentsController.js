const CommentsModel = require("../models/commentsModel");

async function CreateComment(req, res, next) {
    try {
        const { _id } = req.user;
        req.body.comment_by = _id;

        await CommentsModel.create(req.body);

        return res.status(200).send({
            success: true,
            message: "Comment created successfully"
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getComments(req, res, next) {
    try {
        const { postId } = req.params;

        let comments = await CommentsModel.find({post_Id: postId}).populate({path: 'comment_by', select: ['_id', 'image', 'username', 'full_name']}).sort({createdAt: -1});

        return res.status(200).send({
            success: true,
            message: "Comments data",
            data: comments
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

async function getRecentPostsComments(req, res, next) {
    try {
        const { postId } = req.params;

        let totalComments = await CommentsModel.find({post_Id: postId}).count();
        let comments = await CommentsModel.find({post_Id: postId}).populate({path: 'comment_by', select: ['_id', 'image', 'username', 'full_name']}).sort({createdAt: -1}).limit(1);

        return res.status(200).send({
            success: true,
            message: "Comments data",
            data: comments,
            totalComments
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = { CreateComment, getComments, getRecentPostsComments };