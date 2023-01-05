const cloudinary = require('cloudinary');
const streamifier = require('streamifier');
const PostsModel = require('../models/postsModel');
const userModel = require('../models/userModel');

async function postOnCloudinary(req, res, next) {
    try {
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
                return res.send({
                    success: true,
                    message: 'post uploaded on cloudinary',
                    data: result
                });
            }
            else {
                res.send({
                    success: false,
                    message: 'post could not upload'
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


async function createPosts(req, res, next) {
    try {
        const {_id} = req.user;
        req.body.user_id = _id;
        await userModel.findByIdAndUpdate(_id, {$inc: {postsCount: +1}})
        await PostsModel.create(req.body);

        return res.status(201).send({
            success: true,
            message: 'Post created successfully',
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getExploreData(req, res, next) {
    try {

        let explore = await PostsModel.find();

        return res.status(201).send({
            success: true,
            message: 'Explore Data',
            data: explore
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getPosts(req, res, next) {
    try {
        const {_id} = req.user;
        const { username } = req.params;

        let user = await userModel.findOne({ username: username });

        const data = await PostsModel.find({user_id: user._id});

        return res.status(201).send({
            success: true,
            message: 'Post data',
            data: data
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}





module.exports = { createPosts, postOnCloudinary, getPosts, getExploreData };