// Пример обработчика logout в API
import { serialize } from 'cookie';

export async function POST(req) {
  // Удаляем токен из cookies
  const cookie = serialize('auth_token', '', {
    httpOnly: true, // Токен доступен только через сервер, не через JavaScript
    secure: false,  // Включите true, если используете HTTPS
    sameSite: 'lax',
    path: '/',
    maxAge: -1, // Устанавливаем maxAge в -1 для удаления cookies
  });

  return new Response(JSON.stringify({ message: 'Выход успешен' }), {
    status: 200,
    headers: { 'Set-Cookie': cookie },
  });
}
