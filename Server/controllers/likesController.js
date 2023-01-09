const LikesModel = require("../models/LikesModel");
const PostsModel = require("../models/postsModel");

async function likeRequest(req, res, next) {
    try {
        let { _id } = req.user;
        console.log(req.body);

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

module.exports =  { likeRequest };