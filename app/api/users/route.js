// app/api/users/route.js
import { query } from '@/app/lib/db'; // Убедитесь, что путь правильный

export async function GET(req) {
  try {
    const result = await query('SELECT * FROM users'); // Запрос к базе данных
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при получении пользователей.' }), { status: 500 });
  }
}
