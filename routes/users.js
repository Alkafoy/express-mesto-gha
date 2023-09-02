const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, getUserById, editUserData, editUserAvatar, getUserInfo,
} = require('../controllers/users');
const { urlRegex } = require('../utils/constants');

const router = express.Router();

// Роут для получения всех пользователей
router.get('/', getAllUsers);

// Роут для получения данных пользователя
router.get('/me', getUserInfo);

// Роут для получения пользователя по _id
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

// Роут для редактирования данных пользователя
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUserData);

// Роут для редактирования аватара
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegex),
  }),
}), editUserAvatar);

module.exports = router;
