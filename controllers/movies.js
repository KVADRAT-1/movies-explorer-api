const validator = require('validator');
const Movie = require('../models/movie');
const errorProcessing = require('../middlewares/errorProcessing');

module.exports.returnMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send({ movies }))
    .catch((err) => {
      errorProcessing(err, res, next);
    });
}; // возвращает все сохранённые пользователем фильмы

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country, director, duration, year, description,
    image, trailer, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const processingImage = validator.isURL(image, { require_protocol: true });
  const processingThumbnail = validator.isURL(thumbnail, { require_protocol: true });
  const processingTrailer = validator.isURL(trailer, { require_protocol: true });
  if (!processingImage || !processingThumbnail || !processingTrailer) {
    const error = new Error('Неправильный url у ссылки на постер или трейлер к фильму.');
    error.statusCode = 400;
    next(error);
  } else {
    Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN,
    })
      .then((movie) => {
        res.status(200).send({ movie });
      })
      .catch((err) => {
        errorProcessing(err, res, next);
      });
  }
}; // создаёт фильм с переданными в теле country, director, duration ...

module.exports.deleteMovie = (req, res, next) => {
  const createrId = req.user._id;
  Movie.findById(req.params.movieId)
    .orFail(new Error('NotValidId'))
    .then((movie) => {
      if (movie.owner === createrId) {
        Movie.findByIdAndRemove(req.params.movieId)
          .orFail(new Error('NotValidId'))
          .then((movieUser) => {
            res.status(200).send({ movieUser });
          })
          .catch((err) => {
            errorProcessing(err, res, next);
          });
      } else {
        res.status(404).send({
          message: 'У вас нет прав на удаление фильма.',
        });
      }
    }) // res.send({ data: movie.owner })
    .catch((err) => {
      errorProcessing(err, res, next);
    });
}; // удаляет сохранённый фильм по id
