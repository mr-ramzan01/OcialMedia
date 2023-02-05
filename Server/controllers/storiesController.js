const cloudinary = require('cloudinary');
const streamifier = require('streamifier');
const FollowModel = require('../models/followModel');
const StoriesModel = require('../models/storiesModel');

async function uploadStory(req, res) {
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
    
        // Uploading story image on cloudinary through stream
        async function upload(req) {
            let result = await streamUpload(req);

            // If upload succeeded
            if(result) {
                await StoriesModel.create({ user_id: _id, image: result.secure_url, public_id: result.public_id});
                return res.send({
                    success: true,
                    message: 'Story added successfully'
                });
            }

            // If upload failed
            else {
                res.send({
                    success: false,
                    message: 'Could not added story'
                })
            }
            
        }
        upload(req);
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getAllStories(req, res) {
    try {
        const { _id } = req.user;

        // Finding all followings of user
        const following = await FollowModel.find({following_Id: _id});

        // Finding all stories which has crossed the limit of 24 hours
        const storiesToDelete = await StoriesModel.find({ $and: [ {user_id: { $in: following.map(function(el) { return el.follower_Id})}}, {createdAt: {$lte: Date.now()-86400000}}]}).populate({path: 'user_id', select: ['_id', 'image', 'username', 'full_name']});
        
        // Deleting the stories
        storiesToDelete.forEach(async (el) => {
            await cloudinary.v2.uploader.destroy(el.public_id);
            await StoriesModel.deleteOne({_id: el._id});
        })

        // Finding all stories
        const stories = await StoriesModel.find({user_id: { $in: following.map(function(el) { return el.follower_Id})}}).populate({path: 'user_id', select: ['_id', 'image', 'username', 'full_name']}).sort({createdAt: -1});
        
        return res.send({
            success: true,
            message: 'Stories data',
            data: stories
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getAllStoriesDate(req, res) {
    try {
        // const { _id } = req.user;
        // const following = await FollowModel.find({following_Id: _id});
        // const storiesToDelete = await StoriesModel.find({ $and: [ {user_id: { $in: following.map(function(el) { return el.follower_Id})}}, {createdAt: {$lte: Date.now()-86400000}}]}).populate({path: 'user_id', select: ['_id', 'image', 'username', 'full_name']}).sort({createdAt: -1});
        
        
        return res.send({
            success: true,
            message: 'following data',
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = {uploadStory, getAllStories, getAllStoriesDate};