const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const categoriesController = require('../controllers/categoriesController');

// Публичные маршруты
router.get('/', categoriesController.getCategories);
router.get('/:id', categoriesController.getCategoryById);

// Защищенные маршруты
router.post(
  '/',
  protect,
  authorize('admin', 'manager'),
  upload.single('image'),
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Название должно содержать от 2 до 100 символов'),
    body('description').optional().trim().isLength({ max: 500 }),
    validate
  ],
  categoriesController.createCategory
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  upload.single('image'),
  [
    param('id').isUUID().withMessage('Неверный ID категории'),
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    validate
  ],
  categoriesController.updateCategory
);

router.delete(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  [param('id').isUUID().withMessage('Неверный ID категории'), validate],
  categoriesController.deleteCategory
);

module.exports = router;
