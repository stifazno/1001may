import { query } from '@/app/lib/db';

export async function POST(req, { params }) {
  const { id } = params; // Получаем id пользователя из параметров

  try {
    const result = await query(
      'UPDATE users SET isactivated = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Пользователь не найден.' }), { status: 404 });
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Ошибка верификации:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при верификации.' }), { status: 500 });
  }
}
