const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.log(authorization);
      throw new AuthError('Необходима авторизация');
    }

    const token = extractBearerToken(authorization);
    const payload = jwt.verify(token, '1d99b5b455e4421f02bb3487371377e2663fc20312965cc095766ba38d29536a');

    req.user = payload;
  } catch (err) {
    next(err);
  }

  next();
};
