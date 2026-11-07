const ErrorHandler = require('./ErrorHandler.js');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let error = err;

  // Mongodb cast Error
  if (err.name === 'CastError') {
    error = new ErrorHandler(`Resource not found. Invalid ${err.path}`, 404);
  }

  // Duplicate Key error
  if (err.code === 11000) {
    error = new ErrorHandler(`Duplicate ${Object.keys(err.keyValue || {})} Entered`, 409);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ErrorHandler('Jwt token is Invalid. Please try again later', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new ErrorHandler('JWT token is expired. Try again', 401);
  }

  // Multer / body parser errors carry their own status
  const statusCode = error.statusCode || error.status || 500;
  if (statusCode >= 500) console.error(err);

  return res.status(statusCode).send({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};
