const FollowModel = require("../models/followModel");
const NofificationsModel = require("../models/notificationsModel");
const userModel = require("../models/userModel");

async function isFollowing(req, res) {
    try {
        const {followerID, followingID} = req.query;

        // If ids are not defined
        if(followerID===undefined || followingID===undefined) {
            return res.status(400).send({
                success: false,
                message: 'Invalid query parameters'
            })
        }

        // Finding if a user is following or not
        let follower = await FollowModel.findOne({$and: [{following_Id: followingID}, {follower_Id: followerID}]});
        
        // If not following
        if(!follower) {
            return res.status(200).send({
                success: false,
                message: 'Not following'
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Following'
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function followRequest(req, res) {
    try {
        const {follower_Id, following_Id} = req.body;

        // If ids are not defined
        if(follower_Id===undefined || following_Id===undefined) {
            return res.status(400).send({
                success: false,
                message: 'Invalid request body'
            })
        }

        // Creating a new follower
        let follow = await FollowModel.create(req.body);

        // Incrementing the no of followers and following of users
        await userModel.findOneAndUpdate({_id: following_Id}, {$inc: {followingCount: +1}});
        await userModel.findOneAndUpdate({_id: follower_Id}, {$inc: {followerCount: +1}})
        
        // Creating a notification for following
        await NofificationsModel.create({type: 'follow', from: following_Id, to: follower_Id, follow_id: follow._id})
        
        return res.status(201).send({
            success: true,
            message: 'Successfully following'
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function unFollowRequest(req, res) {
    try {
        const {follower_Id, following_Id} = req.body;

        // If ids are not defined
        if(follower_Id===undefined || following_Id===undefined) {
            return res.status(400).send({
                success: false,
                message: 'Invalid request body'
            })
        }

        // Deleting the follower
        await FollowModel.findOneAndDelete({follower_Id: follower_Id, following_Id: following_Id});

        // Incrementing the no of followers and following of users
        await userModel.findOneAndUpdate({_id: following_Id}, {$inc: {followingCount: -1}});
        await userModel.findOneAndUpdate({_id: follower_Id}, {$inc: {followerCount: -1}})

        return res.status(200).send({
            success: true,
            message: 'Successfully Unfollow'
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getFollowers(req, res) {
    try {
        
        const {userID} = req.query;

        // If user id is not defined
        if(userID===undefined) {
            return res.status(400).send({
                success: false,
                message: 'Invalid query parameters'
            })
        }

        // Finding all followers
        let followers = await FollowModel.find({follower_Id: userID}).populate({path: 'following_Id', select: ['_id', 'image', 'username', 'full_name']}).limit(50);

        return res.status(200).send({
            success: true,
            message: 'Followers data',
            data: followers
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


async function getFollowing(req, res) {
    try {
        
        const {userID} = req.query;

        // If user id is not defined
        if(userID===undefined) {
            return res.status(400).send({
                success: false,
                message: 'Invalid query parameters'
            })
        }

        // Finding all following 
        let followers = await FollowModel.find({following_Id: userID}).populate({path: 'follower_Id', select: ['_id', 'image', 'username', 'full_name']}).limit(50);

        return res.status(200).send({
            success: true,
            message: 'Followers data',
            data: followers
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = { isFollowing, followRequest, unFollowRequest, getFollowers, getFollowing }