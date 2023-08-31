// Подключаем модель пользователя
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { CastError, DocumentNotFoundError, ValidationError } = mongoose.Error;
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/ConflictError');

// Контроллер для получения всех пользователей
module.exports.getAllUsers = (req, res, next) => {
  User.find()
    .then((users) => res.send(users))
    .catch(next);
};

// Контроллер для получения пользователя по _id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорректный формат ID пользователя'));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден'));
      }
      next(err);
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// Контроллер для создания пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then(() => res.status(201).send({
        name, about, avatar, email,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Пользователь с такой почтой уже зарегистрирован'));
        } else if (err instanceof ValidationError) {
          next(new BadRequestError(err.message));
        } else {
          next(err);
        }
      }));
};

module.exports.editUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.editUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
    .orFail(() => res.status(404).send({ message: 'Пользователь не найден' }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else { next(new NotFoundError('Пользователь не найден')); }
    })
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequestError('Некорректный формат ID пользователя'));
      } else { next(error); }
    });
};
