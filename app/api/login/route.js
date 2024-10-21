// app/api/login/route.js
import { query } from '../../lib/db.js';;
import bcrypt from 'bcrypt'; // для безопасного хранения паролей

export async function POST(req) {
  const { username, password } = await req.json();

  // Запрос к базе данных
  const result = await query('SELECT * FROM users WHERE username = $1', [username]);

  if (result.rows.length === 0) {
    console.log('Пользователь не найден:', username); // Логируем, если пользователь не найден
    return new Response(JSON.stringify({ error: 'Пользователь не найден' }), {
      status: 404,
    });
  }

  const user = result.rows[0];

  // Логирование для отладки
  console.log('Введенный пароль:', password);
  console.log('Хэш пароля из базы данных:', user.password);

  // Проверка пароля
  const match = await bcrypt.compare(password, user.password);

  // Логирование результата сравнения
  console.log('Результат сравнения паролей:', match);

  if (!match) {
    return new Response(JSON.stringify({ error: 'Неверный пароль' }), {
      status: 401,
    });
  }

  // Возвращаем успешный ответ
  return new Response(JSON.stringify({ message: 'Успешный вход' }), {
    status: 200,
  });
}
