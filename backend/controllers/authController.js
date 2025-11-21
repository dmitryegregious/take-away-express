const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Инициация Flash Call через Plusofon
exports.initiateFlashCall = async (req, res) => {
  try {
    const { phone } = req.body;

    // Вызов API Plusofon для инициации Flash Call
    // Это пример - нужно адаптировать под реальное API Plusofon
    const response = await axios.post(
      `${process.env.PLUSOFON_API_URL}/flash-call`,
      { phone },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PLUSOFON_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      message: 'Flash call инициирован',
      call_id: response.data.call_id
    });
  } catch (error) {
    console.error('Flash call error:', error);
    res.status(500).json({ error: 'Ошибка при инициации Flash Call' });
  }
};

// Верификация Flash Call
exports.verifyFlashCall = async (req, res) => {
  try {
    const { phone, code } = req.body;

    // Проверка кода через API Plusofon
    // Это пример - нужно адаптировать под реальное API Plusofon
    const verifyResponse = await axios.post(
      `${process.env.PLUSOFON_API_URL}/verify`,
      { phone, code },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PLUSOFON_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!verifyResponse.data.verified) {
      return res.status(401).json({ error: 'Неверный код' });
    }

    // Проверяем, существует ли пользователь
    const userResult = await pool.query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );

    let user;
    let isNewUser = false;

    if (userResult.rows.length === 0) {
      // Создаем нового клиента
      const result = await pool.query(
        'INSERT INTO users (phone, role) VALUES ($1, $2) RETURNING id, phone, name, role',
        [phone, 'client']
      );
      user = result.rows[0];
      isNewUser = true;
    } else {
      user = userResult.rows[0];
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role
      },
      isNewUser
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Ошибка при верификации' });
  }
};

// Регистрация имени (при первом входе)
exports.registerName = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    await pool.query(
      'UPDATE users SET name = $1 WHERE id = $2',
      [name, userId]
    );

    res.json({
      success: true,
      message: 'Имя успешно обновлено'
    });
  } catch (error) {
    console.error('Register name error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении имени' });
  }
};

// Получить текущего пользователя
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

// Выход
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Вы вышли из системы'
  });
};
