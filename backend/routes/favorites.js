const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const favoritesController = require('../controllers/favoritesController');

router.get('/', protect, favoritesController.getFavorites);

router.post(
  '/add',
  protect,
  [body('product_id').isUUID().withMessage('Неверный ID товара'), validate],
  favoritesController.addToFavorites
);

router.delete(
  '/remove/:productId',
  protect,
  [param('productId').isUUID().withMessage('Неверный ID товара'), validate],
  favoritesController.removeFromFavorites
);

module.exports = router;
