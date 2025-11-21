const pool = require('../config/db');

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT f.product_id, p.*
      FROM favorites f
      LEFT JOIN products p ON f.product_id = p.id
      WHERE f.user_id = $1 AND p.deleted_at IS NULL
      ORDER BY f.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Ошибка при получении избранного' });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    const { product_id } = req.body;
    const userId = req.user.id;

    // Проверяем существование товара
    const productCheck = await pool.query(
      'SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL',
      [product_id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    // Проверяем, не добавлен ли уже
    const existingFavorite = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    );

    if (existingFavorite.rows.length > 0) {
      return res.status(400).json({ error: 'Товар уже в избранном' });
    }

    await pool.query(
      'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2)',
      [userId, product_id]
    );

    res.status(201).json({
      success: true,
      message: 'Товар добавлен в избранное'
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ error: 'Ошибка при добавлении в избранное' });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден в избранном' });
    }

    res.json({
      success: true,
      message: 'Товар удален из избранного'
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ error: 'Ошибка при удалении из избранного' });
  }
};
