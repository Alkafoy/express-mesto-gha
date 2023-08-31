const mongoose = require('mongoose');

const { CastError, DocumentNotFoundError, ValidationError } = mongoose.Error;
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getAllCards = (req, res, next) => {
  Card.find()
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      // Проверяем, является ли текущий пользователь владельцем карточки
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав на удаление карточки');
      }
      return card.remove(); // Удаляем карточку
    })
    // Если документ не найден, создаём ошибку DocumentNotFoundError и передаём её в блок catch
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорректный формат ID карточки'));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорректный формат ID карточки'));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорректный формат ID карточки'));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else next(err);
    });
};
