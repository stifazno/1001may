// app/api/account/route.js
import { query } from '../../lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Пользователь не найден' }), {
      status: 400,
    });
  }

  try {
    // Ваш код для получения данных
    const user = await query('SELECT * FROM users WHERE id = $1', [userId]);

    if (user.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Пользователь не найден' }), {
        status: 404,
      });
    }

    const orders = await query(
      `SELECT o.id AS order_id, o.total_cost, o.status AS order_status, o.created_at AS order_date,
              ARRAY_AGG(
                json_build_object(
                  'product_id', p.id,
                  'product_name', p.name,
                  'quantity', oi.quantity,
                  'product_price', p.price
                )
              ) AS items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id`,
      [userId]
    );

    return new Response(
      JSON.stringify({ user: user.rows[0], orders: orders.rows }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    return new Response(JSON.stringify({ error: 'Ошибка сервера' }), {
      status: 500,
    });
  }
}
