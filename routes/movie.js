const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных.
const auth = require('../middlewares/auth');

const {
  returnCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.use(auth);

router.get('/cards', returnCards); // возвращает все карточки
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }).unknown(true),
}), createCard); // создаёт карточку
router.delete('/cards/:cardId', deleteCard); // удаляет карточку по идентификатору
router.put('/cards/:cardId/likes', likeCard); // поставить лайк карточке
router.delete('/cards/:cardId/likes', dislikeCard); // убрать лайк с карточки

module.exports = router;
