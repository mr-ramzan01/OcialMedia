const FollowModel = require("../models/followModel");
const userModel = require("../models/userModel");

async function isFollowing(req, res, next) {
    try {
        const {followerID, followingID} = req.query;

        if(followerID===undefined || followingID===undefined) {
            return res.status(400).send({
                success: false,
                message: 'Invalid query parameters'
            })
        }
        let follower = await FollowModel.findOne({$and: [{following_Id: followingID}, {follower_Id: followerID}]});
        if(!follower) {
            return res.status(404).send({
                success: false,
                message: 'Not following'
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Following'
        })
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function followRequest(req, res, next) {
    try {
        const {follower_Id, following_Id} = req.body;

        if(follower_Id===undefined || following_Id===undefined) {
            return res.status(400).send({
                success: false,
                message: 'Invalid query parameters'
            })
        }

        await userModel.findOneAndUpdate({_id: following_Id}, {$inc: {followingCount: +1}});
        await userModel.findOneAndUpdate({_id: follower_Id}, {$inc: {followerCount: +1}})
        await FollowModel.create(req.body);

        return res.status(201).send({
            success: true,
            message: 'Successfully following'
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function unFollowRequest(req, res, next) {
    try {
        const {follower_Id, following_Id} = req.body;

        if(follower_Id===undefined || following_Id===undefined) {
            return res.status(400).send({
                success: false,
                message: 'Invalid query parameters'
            })
        }

        await userModel.findOneAndUpdate({_id: following_Id}, {$inc: {followingCount: -1}});
        await userModel.findOneAndUpdate({_id: follower_Id}, {$inc: {followerCount: -1}})
        await FollowModel.findOneAndDelete({follower_Id: follower_Id});

        return res.status(200).send({
            success: true,
            message: 'Successfully Unfollow'
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getFollowers(req, res, next) {
    try {
        
        const {userID} = req.query;

        if(userID===undefined) {
            return res.status(400).send({
                success: false,
                message: 'Invalid query parameters'
            })
        }
        let followers = await FollowModel.find({follower_Id: userID}).populate({path: 'following_Id', select: ['_id', 'image', 'username', 'full_name']}).limit(50);

        return res.status(200).send({
            success: true,
            message: 'Followers data',
            data: followers
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getFollowing(req, res, next) {
    try {
        
        const {userID} = req.query;

        if(userID===undefined) {
            return res.status(400).send({
                success: false,
                message: 'Invalid query parameters'
            })
        }
        let followers = await FollowModel.find({following_Id: userID}).populate({path: 'follower_Id', select: ['_id', 'image', 'username', 'full_name']}).limit(50);

        return res.status(200).send({
            success: true,
            message: 'Followers data',
            data: followers
        })
        
    } catch (error) {
        // return next(new ErrorHandler(error, 500));
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = { isFollowing, followRequest, unFollowRequest, getFollowers, getFollowing }