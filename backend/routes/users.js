const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');
const usersController = require('../controllers/usersController');

// Только для администраторов
router.get(
  '/',
  protect,
  authorize('admin'),
  usersController.getAllUsers
);

router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('phone').isMobilePhone('ru-RU').withMessage('Неверный формат телефона'),
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Имя должно содержать от 2 до 100 символов'),
    body('role').isIn(['admin', 'manager', 'courier']).withMessage('Неверная роль'),
    validate
  ],
  usersController.createUser
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  [
    param('id').isUUID().withMessage('Неверный ID пользователя'),
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('role').optional().isIn(['admin', 'manager', 'courier', 'client']),
    validate
  ],
  usersController.updateUser
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  [param('id').isUUID().withMessage('Неверный ID пользователя'), validate],
  usersController.deleteUser
);

// Получить список курьеров (для менеджеров)
router.get(
  '/couriers',
  protect,
  authorize('admin', 'manager'),
  usersController.getCouriers
);

module.exports = router;
