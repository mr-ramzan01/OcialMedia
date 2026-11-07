const jwt = require('jsonwebtoken');

const jwt_secret_key = process.env.JWT_SECRET_KEY;

function isAuthenticated(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({
      success: false,
      message: 'Invalid authorization header',
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token || token === 'undefined' || token === 'null') {
    return res.status(401).send({
      success: false,
      message: 'User is not valid',
    });
  }

  try {
    req.user = jwt.verify(token, jwt_secret_key);
    return next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: 'Invalid token provided',
    });
  }
}

module.exports = isAuthenticated;
