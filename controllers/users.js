const bcrypt = require('bcryptjs'); // Для хеширования пароля
const jwt = require('jsonwebtoken'); // Для создания токенов
const User = require('../models/user');
const errorProcessing = require('../middlewares/errorProcessing');

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
      const token = jwt.sign({ _id: user._id }, 'qwerty', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
}; // лог

module.exports.returnUser = (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  const userId = jwt.verify(token, 'qwerty')._id;
  User.findById(userId)
    .orFail(new Error('NotFoundId'))
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      errorProcessing(err, res, next);
    });
}; // возвращает информацию о текущем пользователе

module.exports.returnUserId = (req, res, next) => {
  User.findById(req.params.me)
    .orFail(new Error('NotFoundId'))
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      errorProcessing(err, res, next);
    });
}; // возвращает информацию о текущем пользователе по id

module.exports.updatesProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.params.me, { name: req.body.name }, opts)
    .orFail(new Error('NotFoundId'))
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      errorProcessing(err, res, next);
    });
}; // обновляет профиль
