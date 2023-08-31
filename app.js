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

app.use('/', mainRouter);

// Обработчик несуществующих путей
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

// middleware для обработки ошибок валидации от celebrate
app.use(errors);
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

// подключаемся к серверу mongo
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.listen(PORT);
