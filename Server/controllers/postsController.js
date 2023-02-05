const cloudinary = require('cloudinary');
const streamifier = require('streamifier');
const PostsModel = require('../models/postsModel');
const userModel = require('../models/userModel');

async function postOnCloudinary(req, res) {
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

        // uploading image on cloudinary through stream
        async function upload(req) {
            let result = await streamUpload(req);

            // For successfully upload
            if(result) {
                return res.send({
                    success: true,
                    message: 'post uploaded on cloudinary',
                    data: result
                });
            }

            // Error while uploading
            else {
                res.send({
                    success: false,
                    message: 'post could not upload'
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


async function createPosts(req, res) {
    try {
        const {_id} = req.user;
        req.body.user_id = _id;

        // Creating post
        await PostsModel.create(req.body);

        // Incrementing the no of post on user
        await userModel.findByIdAndUpdate(_id, {$inc: {postsCount: +1}})

        return res.status(201).send({
            success: true,
            message: 'Post created successfully',
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getExploreData(req, res) {
    try {
        const {page} = req.query;

        // If page is not specified
        if(!page) {
            return res.status(400).send({
                success: false,
                message: 'Invalid query parameters'
            })
        }

        // Finding total no of posts
        let totalData = await PostsModel.find().count();

        // Finding all posts with page number
        let explore = await PostsModel.find().sort({ createdAt: -1}).skip((page-1)*24).limit(24);

        return res.status(200).send({
            success: true,
            message: 'Explore Data',
            data: explore,
            totalData: totalData
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getPosts(req, res) {
    try {
        const { username } = req.params;
        const { page } = req.query;

        // If page is not specified
        if(!page) {
            return res.status(400).send({
                success: false,
                message: 'Invalid query parameters'
            })
        }

        // Finding user details
        let user = await userModel.findOne({ username: username });

        // Finding total no of posts of particular user
        const totalPosts = await PostsModel.find({user_id: user._id}).count();

        // Finding all posts of user
        const data = await PostsModel.find({user_id: user._id}).sort({ createdAt: -1}).skip((page-1)*24).limit(24);

        return res.status(200).send({
            success: true,
            message: 'Post data',
            data: data,
            totalPosts
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getSinglePost(req, res) {
    try {
        const {id} = req.params;

        // If id is not specified
        if(!id) {
            return res.status(400).send({
                success: false,
                message: 'Invalid params parameters'
            })
        }

        // Finding all details of particular post
        const data = await PostsModel.findOne({_id: id}).populate({path: 'user_id', select: ['_id', 'image', 'username', 'full_name']});

        return res.status(200).send({
            success: true,
            message: 'Post data',
            data: data
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getRecentPosts(req, res) {
    try {
        const {page} = req.query;

        // If page is not specified
        if(!page) {
            return res.status(400).send({
                success: false,
                message: 'Invalid query parameters'
            })
        }

        // Finding total no of posts
        let totalData = await PostsModel.find().count();

        // Finding all posts 
        let recentPosts = await PostsModel.find().populate({path: 'user_id', select: ['id', 'image', 'full_name', 'username']}).sort({ createdAt: -1}).skip((page-1)*10).limit(10);

        return res.status(200).send({
            success: true,
            message: 'Recent posts',
            data: recentPosts,
            totalData: totalData
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}





module.exports = { createPosts, postOnCloudinary, getPosts, getExploreData, getSinglePost, getRecentPosts };