import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,  // Имя пользователя базы данных (по умолчанию postgres)
  host: process.env.DB_HOST,  // Адрес хоста, на котором находится PostgreSQL (например, 'localhost')
  database: process.env.DB_NAME, // Название вашей базы данных
  password: process.env.DB_PASSWORD,  // Пароль пользователя базы данных
  port: process.env.DB_PORT || 5432,  // Порт PostgreSQL (по умолчанию 5432)
});

export const query = (text, params) => pool.query(text, params);
