const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходимо авторизоваться');
  }
  let payload;
  // Отрезаем у заголовка приставку Bearer
  const token = authorization.replace('Bearer ', '');
  // верифицируем токен
  try {
    payload = jwt.verify(token, 'my-secret-key');
  } catch (err) {
    throw new UnauthorizedError('Необходимо авторизоваться');
  }
  req.user = payload;
  next();
};
