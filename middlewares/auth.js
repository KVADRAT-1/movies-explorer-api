const jwt = require('jsonwebtoken'); // Для создания токенов

const { NODE_ENV, JWT_SECRET } = process.env;
console.log(process.env.DB_PASS);
console.log(process.env.NODE_ENV === 'production');
console.log(process.env.JWT_SECRET);

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new Error('Необходима авторизация');
    err.statusCode = 401;
    next(err);
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'qwerty');
    } catch (e) {
      const err = new Error('Необходима авторизация');
      err.statusCode = 401;
      next(err);
    }
    req.user = payload;
    next();
  }
};
