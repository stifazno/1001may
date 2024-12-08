import { db } from '../../lib/db'; // Подключение к базе данных
import { getSession } from 'next-auth/react'; // Если используется next-auth для аутентификации

export async function POST(req) {
  try {
    // Получаем данные запроса
    const body = await req.json();
    const { cart, totalCost } = body;

    // Проверяем, есть ли пользователь
    const session = await getSession({ req });
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Пользователь не авторизован' }), { status: 401 });
    }

    // Извлекаем информацию о пользователе
    const userId = session.user.id;

    // Создаем заказ
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, total_price, created_at) VALUES ($1, $2, NOW()) RETURNING id`,
      [userId, totalCost]
    );

    if (!orderResult.rows.length) {
      return new Response(JSON.stringify({ error: 'Не удалось создать заказ' }), { status: 500 });
    }

    const orderId = orderResult.rows[0].id;

    // Добавляем товары в таблицу order_items
    for (const item of cart) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, total_price) 
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.id, item.quantity, item.price, item.quantity * item.price]
      );
    }

    return new Response(JSON.stringify({ success: true, orderId }), { status: 201 });
  } catch (error) {
    console.error('Ошибка создания заказа:', error); // Печать ошибки для диагностики
    return new Response(JSON.stringify({ error: 'Ошибка создания заказа' }), { status: 500 });
  }
}
