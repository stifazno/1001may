import jwt from 'jsonwebtoken';

const JWT_SECRET = 'samurai.61203';


export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET); // Проверка токена
  } catch (err) {
    return null; // Если токен недействителен
  }
}
 