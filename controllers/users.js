const validator = require('validator');
const bcrypt = require('bcryptjs'); // Для хеширования пароля
const jwt = require('jsonwebtoken'); // Для создания токенов
const User = require('../models/user');
const errorProcessing = require('../middlewares/errorProcessing');

const { NODE_ENV, JWT_SECRET } = process.env;

const opts = { runValidators: true, new: true };

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // Хешируем пароль
    .then((hash) => User.emailProcessing({ req, hash, next }))
    .then((user) => {
      res.status(200).send({
        email: user.email,
        name: user.name,
        _id: user._id,
      });
    })
    .catch((err) => {
      errorProcessing(err, res, next);
    });
}; // создаёт пользователя

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'qwerty', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
}; // логин

module.exports.returnUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(new Error('NotFoundId'))
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      errorProcessing(err, res, next);
    });
}; // возвращает информацию о текущем пользователе

module.exports.updatesProfile = (req, res, next) => {
  const processing = validator.isEmail(req.body.email, { require_protocol: true });
  if (!processing) {
    const error = new Error('Неправильный Email');
    error.statusCode = 400;
    next(error);
  }
  User.findByIdAndUpdate(req.user, { name: req.body.name, email: req.body.email }, opts)
    .orFail(new Error('NotFoundId'))
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      errorProcessing(err, res, next);
    });
}; // обновляет профиль
