const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// обработчик ошибок от celebrate
const { errors } = require('celebrate');
const mainRouter = require('./routes/index');

// Слушаем 3000 порт
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

// Парсим входящие запросы в формате JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', mainRouter);

// Обработчик несуществующих путей
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});
// middleware для обработки ошибок валидации от celebrate
app.use(errors());

app.use((err, req, res, next) => {
  // console.log(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT);
