const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных.
const auth = require('../middlewares/auth');

const {
  returnMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.use(auth);

router.get('/movies', returnMovies); // возвращает все сохранённые пользователем фильмы
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailer: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
}), createMovie); // создаёт фильм с переданными в теле country, director, duration ...
router.delete('/movies/:movieId', deleteMovie); // удаляет сохранённый фильм по id

module.exports = router;
