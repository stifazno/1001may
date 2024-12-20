import { query } from '../../lib/db.js';
import bcrypt from 'bcrypt';

export async function POST(req) {
  const { username, password } = await req.json();

  // Запрос к базе данных
  const result = await query('SELECT * FROM users WHERE username = $1', [username]);

  if (result.rows.length === 0) {
    console.log('Пользователь не найден:', username); 
    return new Response(JSON.stringify({ error: 'Пользователь не найден' }), {
      status: 404,
    });
  }

  const user = result.rows[0];

  console.log('Введенный пароль:', password);
  console.log('Хэш пароля из базы данных:', user.password);

  // Проверка пароля
  const match = await bcrypt.compare(password, user.password);

  console.log('Результат сравнения паролей:', match);

  if (!match) {
    return new Response(JSON.stringify({ error: 'Неверный пароль' }), {
      status: 401,
    });
  }

  return new Response(JSON.stringify({ message: 'Успешный вход' }), {
    status: 200,
  });
}
