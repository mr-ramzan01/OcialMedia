const cloudinary = require('cloudinary');
const streamifier = require('streamifier');
const FollowModel = require('../models/followModel');
const StoriesModel = require('../models/storiesModel');

async function uploadStory(req, res, next) {
    try {
        const { _id } = req.user;
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.v2.uploader.upload_stream(
                  (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                  }
                );
              streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            if(result) {
                await StoriesModel.create({ user_id: _id, image: result.secure_url, public_id: result.public_id});
                return res.send({
                    success: true,
                    message: 'Story added successfully'
                });
            }
            else {
                res.send({
                    success: false,
                    message: 'Could not added story'
                })
            }
            
        }
        upload(req);
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getAllStories(req, res, next) {
    try {
        const { _id } = req.user;
        const following = await FollowModel.find({following_Id: _id});
        const stories = await StoriesModel.find({user_id: { $in: following.map(function(el) { return el.follower_Id})}}).populate({path: 'user_id', select: ['_id', 'image', 'username', 'full_name']});
        return res.send({
            success: true,
            message: 'following data',
            data: stories
        })
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = {uploadStory, getAllStories};