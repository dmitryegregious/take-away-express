const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');
const ordersController = require('../controllers/ordersController');

// Клиентские маршруты
router.get('/my-orders', protect, ordersController.getMyOrders);
router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('Корзина не может быть пустой'),
    body('items.*.product_id').isUUID().withMessage('Неверный ID товара'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Количество должно быть положительным числом'),
    body('delivery_type').isIn(['pickup', 'delivery']).withMessage('Неверный тип доставки'),
    body('payment_type').isIn(['cash', 'card', 'prepaid']).withMessage('Неверный тип оплаты'),
    body('delivery_address').optional().trim().isLength({ max: 500 }),
    body('comment').optional().trim().isLength({ max: 1000 }),
    validate
  ],
  ordersController.createOrder
);

// Маршруты для менеджеров и администраторов
router.get(
  '/',
  protect,
  authorize('admin', 'manager', 'courier'),
  ordersController.getAllOrders
);

router.get(
  '/:id',
  protect,
  [param('id').isUUID().withMessage('Неверный ID заказа'), validate],
  ordersController.getOrderById
);

router.put(
  '/:id/status',
  protect,
  authorize('admin', 'manager'),
  [
    param('id').isUUID().withMessage('Неверный ID заказа'),
    body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled']),
    validate
  ],
  ordersController.updateOrderStatus
);

router.put(
  '/:id/assign-courier',
  protect,
  authorize('admin', 'manager'),
  [
    param('id').isUUID().withMessage('Неверный ID заказа'),
    body('courier_id').isUUID().withMessage('Неверный ID курьера'),
    validate
  ],
  ordersController.assignCourier
);

// Маршруты для курьера
router.get(
  '/courier/my-deliveries',
  protect,
  authorize('courier'),
  ordersController.getCourierDeliveries
);

router.put(
  '/:id/mark-delivered',
  protect,
  authorize('courier'),
  [param('id').isUUID().withMessage('Неверный ID заказа'), validate],
  ordersController.markAsDelivered
);

module.exports = router;
