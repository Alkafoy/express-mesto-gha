const mongoose = require('mongoose');
const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find()
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return res.status(400).send({ message: 'Некорректный формат ID карточки' });
  }
  return Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => res.status(404).send({ message: 'Карточка не найдена' }))
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.likeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return res.status(400).send({ message: 'Некорректный формат ID карточки' });
  }
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => res.status(404).send({ message: 'Карточка не найдена' }))
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return res.status(400).send({ message: 'Некорректный формат ID карточки' });
  }
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => res.status(404).send({ message: 'Карточка не найдена' }))
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};
