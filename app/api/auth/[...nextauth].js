import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../lib/db"; // Подключите свой файл с базой данных

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Запрос к базе данных для получения пользователя
          const result = await db.query('SELECT * FROM users WHERE username = $1', [credentials.username]);
          
          if (result.rows.length > 0) {
            const user = result.rows[0]; // Первый пользователь из результата запроса
            // Здесь нужно добавить проверку пароля (например, с bcrypt)
            if (credentials.password === user.password) {
              // Возвращаем данные о пользователе, если пароль верный
              return { id: user.id, username: user.username };
            }
          }
          // Если пользователь не найден или пароль неверный
          return null;
        } catch (error) {
          console.error("Ошибка при авторизации", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Используем JWT для хранения сессии
  },
  pages: {
    signIn: "/auth/signin", // Укажите свою страницу для входа, если есть
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
