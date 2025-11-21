const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Инициация Flash Call
router.post(
  '/flash-call',
  [
    body('phone').isMobilePhone('ru-RU').withMessage('Неверный формат телефона'),
    validate
  ],
  authController.initiateFlashCall
);

// Верификация Flash Call
router.post(
  '/verify-flash-call',
  [
    body('phone').isMobilePhone('ru-RU').withMessage('Неверный формат телефона'),
    body('code').isLength({ min: 4, max: 4 }).withMessage('Код должен содержать 4 цифры'),
    validate
  ],
  authController.verifyFlashCall
);

// Регистрация (имя при первом входе)
router.post(
  '/register-name',
  protect,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Имя должно содержать от 2 до 100 символов'),
    validate
  ],
  authController.registerName
);

// Получить текущего пользователя
router.get('/me', protect, authController.getMe);

// Выход
router.post('/logout', protect, authController.logout);

module.exports = router;
