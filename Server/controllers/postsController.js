async function createPosts(req, res, next) {
    try {
        
        // const {_id} = req.user;
        // console.log(_id);
        console.log('here');


        return res.status(200).send({
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


module.exports = { createPosts };