const cloudinary = require('cloudinary');
const streamifier = require('streamifier');
const StoriesModel = require('../models/storiesModel');

async function uploadStory(req, res, next) {
    try {
        const { _id } = req.user;
        console.log(_id, 'id');
        // const user = await userModel.findOne({_id: _id});
        // if(user.image_public_id !== '') {
        //     await cloudinary.v2.uploader.destroy(user.image_public_id);
        // }

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
                console.log(result, 'result');
                await StoriesModel.create({ user_id: _id, image: result.secure_url, public_id: result.public_id});
                return res.send({
                    success: true,
                    message: 'Story posted successfully'
                });
            }
            else {
                res.send({
                    success: false,
                    message: 'Could not post story'
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

module.exports = {uploadStory};