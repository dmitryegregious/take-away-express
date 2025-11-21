const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.get('/', protect, cartController.getCart);

router.post(
  '/add',
  protect,
  [
    body('product_id').isUUID().withMessage('Неверный ID товара'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Количество должно быть положительным числом'),
    validate
  ],
  cartController.addToCart
);

router.put(
  '/update',
  protect,
  [
    body('product_id').isUUID().withMessage('Неверный ID товара'),
    body('quantity').isInt({ min: 1 }).withMessage('Количество должно быть положительным числом'),
    validate
  ],
  cartController.updateCartItem
);

router.delete(
  '/remove/:productId',
  protect,
  [param('productId').isUUID().withMessage('Неверный ID товара'), validate],
  cartController.removeFromCart
);

router.delete('/clear', protect, cartController.clearCart);

module.exports = router;
