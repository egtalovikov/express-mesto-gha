const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

const { JWT_SECRET = 'dev-key' } = process.env;

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AuthError('Необходима авторизация');
    }

    const token = extractBearerToken(authorization);
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
  } catch (err) {
    next(err);
  }

  next();
};
