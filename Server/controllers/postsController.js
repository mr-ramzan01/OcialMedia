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
        const {page} = req.query;
        let totalData = await PostsModel.find().count();
        let explore = await PostsModel.find().sort({ createdAt: -1}).skip((page-1)*24).limit(24);

        return res.status(201).send({
            success: true,
            message: 'Explore Data',
            data: explore,
            totalData: totalData
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
        const { username } = req.params;
        const { page } = req.query;

        let user = await userModel.findOne({ username: username });

        const totalPosts = await PostsModel.find({user_id: user._id}).count();

        const data = await PostsModel.find({user_id: user._id}).sort({ createdAt: -1}).skip((page-1)*24).limit(24);

        return res.status(200).send({
            success: true,
            message: 'Post data',
            data: data,
            totalPosts
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getSinglePost(req, res, next) {
    try {
        const {id} = req.params;

        const data = await PostsModel.findOne({_id: id}).populate({path: 'user_id', select: ['_id', 'image', 'username', 'full_name']});

        return res.status(200).send({
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


async function getRecentPosts(req, res, next) {
    try {
        const {page} = req.query;
        let totalData = await PostsModel.find().count();
        let recentPosts = await PostsModel.find().populate({path: 'user_id', select: ['id', 'image', 'full_name', 'username']}).sort({ createdAt: -1}).skip((page-1)*10).limit(10);

        return res.status(200).send({
            success: true,
            message: 'Recent posts',
            data: recentPosts,
            totalData: totalData
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}





module.exports = { createPosts, postOnCloudinary, getPosts, getExploreData, getSinglePost, getRecentPosts };