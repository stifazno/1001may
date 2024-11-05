import { query } from '../../lib/db'; // Убедитесь, что путь правильный
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { firstName, lastName, email, phone, company, position, password } = await req.json();

    // Проверяем, что все обязательные поля заполнены
    if (!firstName || !lastName || !email || !phone || !company || !position || !password) {
      return new Response(JSON.stringify({ error: 'Все поля обязательны.' }), { status: 400 });
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Выполняем запрос на вставку пользователя в базу данных
    const result = await query(
      'INSERT INTO users (username, password, email, phone, company, position, firstname, lastname) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [email, hashedPassword, email, phone, company, position, firstName, lastName]
    );

    // Возвращаем данные о зарегистрированном пользователе
    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in registration:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при регистрации.' }), { status: 500 });
  }
}
