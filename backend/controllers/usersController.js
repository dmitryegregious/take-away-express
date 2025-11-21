const pool = require('../config/db');

exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    
    let query = 'SELECT id, phone, name, role, created_at FROM users WHERE 1=1';
    const params = [];
    
    if (role) {
      query += ' AND role = $1';
      params.push(role);
    }
    
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { phone, name, role } = req.body;

    // Проверяем, не существует ли уже пользователь с таким номером
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE phone = $1',
      [phone]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким номером уже существует' });
    }

    const result = await pool.query(`
      INSERT INTO users (phone, name, role)
      VALUES ($1, $2, $3)
      RETURNING id, phone, name, role, created_at
    `, [phone, name, role]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Ошибка при создании пользователя' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (role !== undefined) {
      updates.push(`role = $${paramCount++}`);
      values.push(role);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Нет данных для обновления' });
    }

    values.push(id);

    const result = await pool.query(`
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, phone, name, role, created_at
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Нельзя удалить самого себя
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Вы не можете удалить свой аккаунт' });
    }

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
      success: true,
      message: 'Пользователь удален'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Ошибка при удалении пользователя' });
  }
};

exports.getCouriers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, phone, name, created_at
      FROM users
      WHERE role = 'courier'
      ORDER BY name ASC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get couriers error:', error);
    res.status(500).json({ error: 'Ошибка при получении списка курьеров' });
  }
};
