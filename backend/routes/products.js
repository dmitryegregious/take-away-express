const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const productsController = require('../controllers/productsController');

// Публичные маршруты
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.get('/category/:categoryId', productsController.getProductsByCategory);

// Защищенные маршруты (только менеджеры и администраторы)
router.post(
  '/',
  protect,
  authorize('admin', 'manager'),
  upload.single('image'),
  [
    body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Название должно содержать от 2 до 200 символов'),
    body('description').trim().isLength({ max: 1000 }).withMessage('Описание не должно превышать 1000 символов'),
    body('price').isFloat({ min: 0 }).withMessage('Цена должна быть положительным числом'),
    body('weight').isInt({ min: 0 }).withMessage('Вес должен быть положительным числом'),
    body('category_id').isUUID().withMessage('Неверный ID категории'),
    validate
  ],
  productsController.createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  upload.single('image'),
  [
    param('id').isUUID().withMessage('Неверный ID товара'),
    body('name').optional().trim().isLength({ min: 2, max: 200 }),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('price').optional().isFloat({ min: 0 }),
    body('weight').optional().isInt({ min: 0 }),
    body('category_id').optional().isUUID(),
    validate
  ],
  productsController.updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  [param('id').isUUID().withMessage('Неверный ID товара'), validate],
  productsController.deleteProduct
);

module.exports = router;
