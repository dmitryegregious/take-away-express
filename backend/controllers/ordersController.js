const pool = require('../config/db');

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT o.*, 
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, courier_id } = req.query;
    
    let query = `
      SELECT o.*, 
        u.name as customer_name,
        u.phone as customer_phone,
        c.name as courier_name,
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN users c ON o.courier_id = c.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND o.status = $${paramCount++}`;
      params.push(status);
    }

    if (courier_id) {
      query += ` AND o.courier_id = $${paramCount++}`;
      params.push(courier_id);
    }

    query += ` GROUP BY o.id, u.name, u.phone, c.name ORDER BY o.created_at DESC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT o.*, 
        u.name as customer_name,
        u.phone as customer_phone,
        c.name as courier_name,
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'weight', p.weight
          )
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN users c ON o.courier_id = c.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1
      GROUP BY o.id, u.name, u.phone, c.name
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    // Проверка прав доступа
    const order = result.rows[0];
    if (req.user.role === 'client' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Ошибка при получении заказа' });
  }
};

exports.createOrder = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { items, delivery_type, payment_type, delivery_address, comment } = req.body;
    const userId = req.user.id;

    // Получаем данные о товарах
    const productIds = items.map(item => item.product_id);
    const productsResult = await client.query(
      'SELECT id, price, weight FROM products WHERE id = ANY($1) AND deleted_at IS NULL',
      [productIds]
    );

    if (productsResult.rows.length !== items.length) {
      throw new Error('Некоторые товары не найдены');
    }

    // Рассчитываем итоговую сумму
    let totalPrice = 0;
    const orderItems = items.map(item => {
      const product = productsResult.rows.find(p => p.id === item.product_id);
      totalPrice += product.price * item.quantity;
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      };
    });

    // Создаем заказ
    const orderResult = await client.query(`
      INSERT INTO orders (user_id, total_price, delivery_type, payment_type, delivery_address, comment, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
    `, [userId, totalPrice, delivery_type, payment_type, delivery_address, comment]);

    const order = orderResult.rows[0];

    // Добавляем товары в заказ
    for (const item of orderItems) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `, [order.id, item.product_id, item.quantity, item.price]);
    }

    // Очищаем корзину пользователя
    await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message || 'Ошибка при создании заказа' });
  } finally {
    client.release();
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(`
      UPDATE orders 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении статуса заказа' });
  }
};

exports.assignCourier = async (req, res) => {
  try {
    const { id } = req.params;
    const { courier_id } = req.body;

    // Проверяем, что пользователь является курьером
    const courierCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND role = $2',
      [courier_id, 'courier']
    );

    if (courierCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Указанный пользователь не является курьером' });
    }

    const result = await pool.query(`
      UPDATE orders 
      SET courier_id = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [courier_id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Assign courier error:', error);
    res.status(500).json({ error: 'Ошибка при назначении курьера' });
  }
};

exports.getCourierDeliveries = async (req, res) => {
  try {
    const courierId = req.user.id;

    const result = await pool.query(`
      SELECT o.*, 
        u.name as customer_name,
        u.phone as customer_phone,
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.courier_id = $1 AND o.status IN ('ready', 'delivering')
      GROUP BY o.id, u.name, u.phone
      ORDER BY o.created_at DESC
    `, [courierId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get courier deliveries error:', error);
    res.status(500).json({ error: 'Ошибка при получении доставок' });
  }
};

exports.markAsDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    const courierId = req.user.id;

    const result = await pool.query(`
      UPDATE orders 
      SET status = 'delivered', delivered_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND courier_id = $2
      RETURNING *
    `, [id, courierId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден или не назначен вам' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Mark as delivered error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении статуса доставки' });
  }
};
