const ErrorHandler = require('./ErrorHandler.js');

module.exports = (err,req,res,next) => {
    // err.statusCode = err.statusCode || 500;
    // err.message = err.message || "Internal Server"
    console.log("inside");
    console.log(err.statusCode, 'err');
    // Mongodb cast Error
    if (err.name === "CastError"){
        console.log("here")
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message,404);
    }

    // Duplicate Key error
    if (err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 404);
    }

    // JWT error 
    if (err.name === 'JsonWebTokenError'){
        const message = 'Jwt token is Invalid. Please try again later';
        err = new ErrorHandler(message,404);
    }

    // JWT expire Error
    if (err.name === 'TokenExpiredError'){
        const message = `JWT token is expired. Try again`;
        err = new ErrorHandler(message,404);
    }

    return res.status(err.statusCode).send({
        error: err.message,
        success: false
    });
}