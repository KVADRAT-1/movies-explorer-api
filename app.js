const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const PORT = 3000;
const app = express();

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://diploma.kostin.nomoredomains.club',
  'https://diploma.kostin.nomoredomains.club/signin',
  'https://diploma.kostin.nomoredomains.club/signup',
  'https://diploma.kostin.nomoredomains.club/users/me',
  'https://diploma.kostin.nomoredomains.club/users/:me',
  'https://diploma.kostin.nomoredomains.club/movies',
  'https://diploma.kostin.nomoredomains.club/movies/:movieId',
  'http://diploma.kostin.nomoredomains.club',
  'http://diploma.kostin.nomoredomains.club/signin',
  'http://diploma.kostin.nomoredomains.club/signup',
  'http://diploma.kostin.nomoredomains.club/users/me',
  'http://diploma.kostin.nomoredomains.club/users/:me',
  'http://diploma.kostin.nomoredomains.club/movies',
  'http://diploma.kostin.nomoredomains.club/movies/:movieId',
  'localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';// Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const requestHeaders = req.headers['access-control-request-headers'];

  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS); // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Headers', requestHeaders); // разрешаем кросс-доменные запросы с этими заголовками
    res.status(200).send();
  }

  return next();
});

app.use(requestLogger); // подключаем логгер запросов
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {

});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  res.status(status).json({ err: message || 'Произошла ошибка на сервере.' });
  return next();
});
