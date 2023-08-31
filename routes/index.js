const router = require('express').Router();
const usersRouter = require('./users'); // Подключаем роуты пользователей
const cardsRouter = require('./cards'); // Подключаем роуты карточек
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const auth = require('../middlewares/auth');

// Используем роут для регистрации
router.use('/signup', signupRouter);
// Используем роут для логина
router.use('/signin', signinRouter);
// Middleware для аутентификации пользователя для всех роутов ниже
router.use(auth);
// Используем роуты пользователей
router.use('/users', usersRouter);
// Используем роуты карточек
router.use('/cards', cardsRouter);

module.exports = router;
