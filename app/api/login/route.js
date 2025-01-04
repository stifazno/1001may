import { query } from '../../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = 'samurai.61203';

export async function POST(req) {
  const { username, password } = await req.json();

  // Запрос к базе данных
  const result = await query('SELECT * FROM users WHERE username = $1', [username]);

  if (result.rows.length === 0) {
    return new Response(JSON.stringify({ error: 'Пользователь не найден' }), {
      status: 404,
    });
  }

  const user = result.rows[0];

  // Проверка пароля
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return new Response(JSON.stringify({ error: 'Неверный пароль' }), {
      status: 401,
    });
  }

  // Создание токена JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' } // Токен будет действителен 1 час
  );

  // Установка токена в cookies
  const cookie = serialize('auth_token', token, {
    httpOnly: false, // Токен доступен только через сервер, не через JavaScript
    secure: false, // Для HTTPS в продакшене
    //sameSite: 'strict',
    sameSite: 'lax',  // Используй 'lax' для локальной разработки
    path: '/',
    maxAge: 60 * 60, // Токен будет действителен 1 час
  });

  return new Response(JSON.stringify({ message: 'Успешный вход' }), {
    status: 200,
    headers: { 'Set-Cookie': cookie },
  });
}
