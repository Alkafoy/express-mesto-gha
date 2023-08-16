const express = require('express');
const {
  getAllUsers, getUserById, createUser, editUserData, editUserAvatar,
} = require('../controllers/users');

const router = express.Router();

// Роут для получения всех пользователей
router.get('/', getAllUsers);

// Роут для получения пользователя по _id
router.get('/:userId', getUserById);

// Роут для создания пользователя
router.post('/', createUser);

// Роут для редактирования данных пользователя
router.patch('/me', editUserData);

// Роут для редактирования аватара
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
