import { query } from '../../lib/db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'samurai.61203';

export async function POST(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Извлекаем токен из заголовка

  if (!token) {
    return new Response(JSON.stringify({ error: 'Токен не найден' }), { status: 401 });
  }

  try {
    // Проверка токена
    const decoded = jwt.verify(token, JWT_SECRET);

    // Получение информации о пользователе из токена
    const userId = decoded.id;
    const { cart, totalCost } = await req.json();

    // Логика для оформления заказа
    // Например, создание записи в таблице orders
    const orderResult = await query(
      'INSERT INTO orders (user_id, status, total_cost, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
      [userId, 'pending', totalCost]
    );

    const orderId = orderResult.rows[0].id;

    // Логика для добавления товаров в таблицу order_items
    for (const item of cart) {
      await query(
        'INSERT INTO order_items (order_id, product_id, quantity, price, total_price, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        [orderId, item.id, item.quantity, item.price, item.price * item.quantity]
      );
    }

    return new Response(JSON.stringify({ orderId }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Ошибка при верификации токена' }), { status: 401 });
  }
}
