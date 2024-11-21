// page.js
'use client'; // Убедитесь, что эта строка в начале файла
import React, { useEffect, useState } from 'react';
import styles from './admin.module.css'; // Предполагается, что у вас есть стили для админки
import UploadProductForm from '../components/UploadProductForm';  // Импортируем компонент загрузки файла

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data); // Устанавливаем полученные данные пользователей
      } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
      }
    };

    fetchUsers(); // Вызываем функцию для получения пользователей
  }, []);

  const handleVerify = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, { 
        method: 'POST',
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка верификации: ${response.status}`);
      }
  
      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      alert('Пользователь успешно верифицирован!');
    } catch (error) {
      console.error(error);
      alert(`Ошибка при верификации: ${error.message}`);
    }
  };
  
  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.header}>Админка</h1>
      <h2 className={styles.subHeader}>Список пользователей</h2>
      
      {/* Форма для загрузки Excel с товарами */}
      <UploadProductForm />
      
      <h2 className={styles.subHeader}>Список пользователей</h2>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя пользователя</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Компания</th>
            <th>Должность</th>
            <th>Статус активации</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email || 'Не указан'}</td>
              <td>{user.phone || 'Не указан'}</td>
              <td>{user.company || 'Не указана'}</td>
              <td>{user.position || 'Не указана'}</td>
              <td>{user.isactivated ? 'Активен' : 'Неактивен'}</td>
              <td>
                {!user.isactivated && (
                  <button onClick={() => handleVerify(user.id)}>Верифицировать</button>
                )}
                {
                    user.isactivated && (
                        <p>Верифицирован</p>
                    )
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
