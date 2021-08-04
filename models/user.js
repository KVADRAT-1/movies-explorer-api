const bcrypt = require('bcryptjs'); // Для хеширования пароля
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    // email, строка, обязательное поле.
  },
  password: {
    type: String,
    required: true,
    select: false, // API не возвращал хеш пароля.
    // password, строка, обязательное поле.
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    // имя пользователя, строка от 2 до 30 символов;
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль')); // пользователь не найден — отклоняем промис
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль')); // хеши не совпали — отклоняем промис
          }
          return user; // аутентификация успешна
        })
        .catch((err) => {
          Promise.reject(new Error(`${err}`));
        });
    })
    .catch((err) => {
      Promise.reject(new Error(`${err}`));
    });
};

userSchema.statics.emailProcessing = function ({ req, hash, next }) {
  const processing = validator.isEmail(req.body.email, { require_protocol: true });
  if (!processing) {
    const error = new Error('Неправильный Email');
    error.statusCode = 400;
    next(error);
  }
  return this.create({
    email: req.body.email,
    password: hash,
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  });
};

module.exports = mongoose.model('user', userSchema);
