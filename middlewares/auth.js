const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_ERROR_CODE } = require('../utils/constants');

const checkToken = (token) => {
  if (!token) {
    return false;
  }

  if (!jwt.verify(token, 'secret-token-key')) {
    return false;
  }

  return { _id: jwt.decode(token)._id };
};

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization;
  const checkResult = checkToken(token);

  if (checkResult) {
    req.user = checkResult;
    return next();
  }

  return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'Неправильные почта или пароль' });
};

module.exports = { checkAuth };
