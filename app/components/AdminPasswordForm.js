import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPasswordForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Пароль для доступа к админке
  const correctPassword = 'admin'; // Можно заменить на process.env.ADMIN_PASSWORD

  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверяем пароль
    if (password === correctPassword) {
      // Перенаправляем на страницу админки
      router.push('/admin');
    } else {
      setError('Неверный пароль');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Введите пароль для доступа к админке</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}