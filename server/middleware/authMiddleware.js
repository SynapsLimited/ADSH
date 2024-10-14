const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');

const authMiddleware = async (req, res, next) => {
  const Authorization = req.headers.authorization; // Note the use of lowercase 'authorization'

  if (Authorization && Authorization.startsWith("Bearer")) {
    const token = Authorization.split(' ')[1]; // Get the token after "Bearer"
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(new HttpError("Unauthorized. Invalid token.", 403));
      }
      req.user = user; // Attach user info to the request
      next();
    });
  } else {
    return next(new HttpError("Unauthorized. No token provided.", 401));
  }
};

module.exports = authMiddleware;
