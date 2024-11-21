import { query } from '@/app/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    // Получаем данные из тела запроса
    const { firstName, lastName, email, phone, company, username, password } = await req.json();
    
    console.log('Получены данные:', { firstName, lastName, email, phone, company, username, password });

    // Проверяем, что все обязательные поля заполнены
    if (!firstName || !lastName || !username || !phone || !company || !password) {
      console.log("Ошибка валидации: все обязательные поля должны быть заполнены.");
      return new Response(JSON.stringify({ error: 'Все поля обязательны, кроме email.' }), { status: 400 });
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Пароль хэширован.');

    // Запрос на вставку данных пользователя в базу данных
    const result = await query(
      'INSERT INTO users (username, password, email, phone, company, firstname, lastname) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [username, hashedPassword, email || null, phone, company, firstName, lastName] // Если email пустой, передаём null
    );

    console.log('Данные успешно сохранены в базе данных:', result.rows[0]);

    // Возвращаем успешный ответ с данными пользователя
    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при регистрации.' }), { status: 500 });
  }
}
