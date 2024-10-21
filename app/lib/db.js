import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',  // Имя пользователя базы данных (по умолчанию postgres)
  host: 'localhost',  // Адрес хоста, на котором находится PostgreSQL (например, 'localhost')
  database: 'Dtbase', // Название вашей базы данных
  password: 'stifazno',  // Пароль пользователя базы данных
  port: 5432,  // Порт PostgreSQL (по умолчанию 5432)
});

export const query = (text, params) => pool.query(text, params);
