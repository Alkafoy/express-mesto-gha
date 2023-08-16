// Подключаем модель пользователя
const mongoose = require('mongoose');
const User = require('../models/user');

// Контроллер для получения всех пользователей
module.exports.getAllUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

// Контроллер для получения пользователя по _id
module.exports.getUserById = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).send({ message: 'Некорректный формат ID пользователя' });
  }
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

// Контроллер для создания пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Поля name, about и avatar являются обязательными' });
  }
  if (name.length < 2 || name.length > 30) {
    return res.status(400).send({ message: 'Длина поля name должна быть от 2 до 30 символов' });
  }
  if (about.length < 2 || about.length > 30) {
    return res.status(400).send({ message: 'Длина поля about должна быть от 2 до 30 символов' });
  }
  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  if (name && (name.length < 2 || name.length > 30)) {
    return res.status(400).send({ message: 'Длина поля name должна быть от 2 до 30 символов' });
  }
  if (about && (about.length < 2 || about.length > 30)) {
    return res.status(400).send({ message: 'Длина поля about должна быть от 2 до 30 символов' });
  }
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.editUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};
