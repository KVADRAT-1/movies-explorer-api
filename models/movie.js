const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    // страна создания фильма. Обязательное поле-строка.
  },
  director: {
    type: String,
    required: true,
    // режиссёр фильма. Обязательное поле-строка.
  },
  duration: {
    type: Number,
    required: true,
    // длительность фильма. Обязательное поле-число.
  },
  year: {
    type: String,
    required: true,
    // год выпуска фильма. Обязательное поле-строка.
  },
  description: {
    type: String,
    required: true,
    // описание фильма. Обязательное поле-строка.
  },
  image: {
    type: String,
    required: true,
    // ссылка на постер к фильму. Обязательное поле-строка. Запишите её URL-адресом.
  },
  trailer: {
    type: String,
    required: true,
    // ссылка на трейлер фильма. Обязательное поле-строка. Запишите её URL-адресом.
  },
  thumbnail: {
    type: String,
    required: true,
    // миниатюрное изображение постера к фильму. Обязательное поле-строка. Запишите её URL-адресом.
  },
  owner: {
    type: String,
    required: true,
    // _id пользователя, который сохранил фильм. Обязательное поле.
  },
  movieId: {
    type: String,
    required: true,
    // id фильма, который содержится в ответе сервиса MoviesExplorer. Обязательное поле.
  },
  nameRU: {
    type: String,
    required: true,
    // название фильма на русском языке. Обязательное поле-строка.
  },
  nameEN: {
    type: String,
    required: true,
    // название фильма на английском языке. Обязательное поле-строка.
  },
});

module.exports = mongoose.model('movie', movieSchema);
