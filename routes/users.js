const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных.
const auth = require('../middlewares/auth');

const {
  createUser,
  login,
  returnUser,
  returnUserId,
  updatesProfile,
} = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);

router.use(auth);

router.get('/users/me', returnUser); // возвращает информацию о текущем пользователе
router.get('/users/:me', returnUserId); // возвращает информацию пользователя по id
router.patch('/users/:me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
  }),
}), updatesProfile); // обновляет профиль

module.exports = router;
