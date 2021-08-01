module.exports = (err, res, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    const error = new Error('Переданы некорректные данные.');
    error.statusCode = 400;
    next(error);
  } else if (err.message === 'NotValidId' || err.message === 'NotFoundId') {
    const error = new Error('Объект не найден.');
    error.statusCode = 404;
    next(error);
  } else if (err.name === 'MongoError' && err.code === 11000) {
    const error = new Error('Уже существующий email');
    error.statusCode = 409;
    next(error);
  } else {
    next(err);
  }
};
