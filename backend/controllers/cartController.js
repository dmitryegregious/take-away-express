const pool = require('../config/db');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT c.*, p.name, p.price, p.weight, p.image
      FROM cart c
      LEFT JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1 AND p.deleted_at IS NULL
    `, [userId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Ошибка при получении корзины' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Проверяем существование товара
    const productCheck = await pool.query(
      'SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL',
      [product_id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    // Проверяем, есть ли товар уже в корзине
    const existingItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Увеличиваем количество
      const result = await pool.query(`
        UPDATE cart 
        SET quantity = quantity + $1
        WHERE user_id = $2 AND product_id = $3
        RETURNING *
      `, [quantity, userId, product_id]);

      return res.json({
        success: true,
        data: result.rows[0]
      });
    } else {
      // Добавляем новый товар
      const result = await pool.query(`
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [userId, product_id, quantity]);

      return res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Ошибка при добавлении в корзину' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.user.id;

    const result = await pool.query(`
      UPDATE cart 
      SET quantity = $1
      WHERE user_id = $2 AND product_id = $3
      RETURNING *
    `, [quantity, userId, product_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден в корзине' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении корзины' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден в корзине' });
    }

    res.json({
      success: true,
      message: 'Товар удален из корзины'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Ошибка при удалении из корзины' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    res.json({
      success: true,
      message: 'Корзина очищена'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Ошибка при очистке корзины' });
  }
};
