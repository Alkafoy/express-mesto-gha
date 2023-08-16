const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users'); // Подключаем роуты пользователей
const cardsRouter = require('./routes/cards'); // Подключаем роуты карточек

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

// Парсим входящие запросы в формате JSON
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64da084dfe92cd9587161532',
  };
  next();
});

// Используем роуты пользователей
app.use('/users', usersRouter);
// Используем роуты карточек
app.use('/cards', cardsRouter);

// Обработчик несуществующих путей
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT);
