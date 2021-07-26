const jwt = require('jsonwebtoken'); // Для создания токенов
const validator = require('validator');
const Card = require('../models/card');
const errorProcessing = require('../middlewares/errorProcessing');

module.exports.returnCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch((err) => {
      errorProcessing(err, res, next);
    });
}; // возвращает все карточки

module.exports.createCard = (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  const owner = jwt.verify(token, 'qwerty')._id;
  const {
    name, link,
  } = req.body;
  const processing = validator.isURL(link, { require_protocol: true });
  if (!processing) {
    const error = new Error('Неправильный url у картинки.');
    error.statusCode = 400;
    next(error);
  } else {
    Card.create({ name, link, owner })
      .then((card) => {
        res.status(200).send({ card });
      })
      .catch((err) => {
        errorProcessing(err, res, next);
      });
  }
}; // создаёт карточку

module.exports.deleteCard = (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  const createrId = jwt.verify(token, 'qwerty')._id;
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (card.owner === createrId) {
        res.status(200).send({ card });
      } else {
        res.status(404).send({
          message: 'У вас нет прав на удаление карточки.',
        });
      }
    })
    .catch((err) => {
      errorProcessing(err, res, next);
    });
}; // удаляет карточку по идентификатору

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail(new Error('NotFoundId'))
  .then((card) => {
    res.status(200).send({ card });
  })
  .catch((err) => {
    errorProcessing(err, res, next);
  }); // поставить лайк карточке

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
) // убрать _id из массива
  .orFail(new Error('NotFoundId'))
  .then((card) => {
    res.status(200).send({ card });
  })
  .catch((err) => {
    errorProcessing(err, res, next);
  }); // убрать лайк с карточки
