'use client';
import React, { useEffect, useState } from 'react';
import styles from './admin.module.css';
import UploadProductForm from '../components/UploadProductForm';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const correctPassword = 'admin'; // Пароль для доступа

  // Проверка пароля
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true); // Устанавливаем аутентификацию
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  // Загрузка пользователей и заказов только после аутентификации
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUsers = async () => {
        try {
          const response = await fetch('/api/users');
          if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
          }
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Ошибка при получении пользователей:', error);
        }
      };

      const fetchOrders = async () => {
        try {
          const response = await fetch('/api/admin/orders');
          if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
          }
          const data = await response.json();
          setOrders(data);
        } catch (error) {
          console.error('Ошибка при получении заказов:', error);
        }
      };

      fetchUsers();
      fetchOrders();
    }
  }, [isAuthenticated]); // Зависимость от isAuthenticated

  // Верификация пользователя
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

  // Открыть модальное окно с деталями заказа
  const openOrderDetails = (order) => setSelectedOrder(order);

  // Закрыть модальное окно
  const closeOrderDetails = () => setSelectedOrder(null);

  // Если пользователь не авторизован, показываем форму для ввода пароля
  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Введите пароль для доступа к админке</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handlePasswordSubmit}>
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

  // Если пользователь авторизован, показываем админку
  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.header}>Админка</h1>
      <h2 className={styles.subHeader}>Список пользователей</h2>
      
      {/* Форма для загрузки Excel с товарами */}
      <UploadProductForm />
      
      {/* Список пользователей */}
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
                {user.isactivated && <p>Верифицирован</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Список заказов */}
      <h2 className={styles.subHeader}>Список заказов</h2>
      <table className={styles.orderTable}>
        <thead>
          <tr>
            <th>№ Заказа</th>
            <th>Заказчик</th>
            <th>Товары</th>
            <th>Сумма</th>
            <th>Дата</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.customer_name}</td>
              <td>{order.items.length} товаров</td>
              <td>{order.total_cost} TJS</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>{order.status}</td>
              <td>
                <button 
                  onClick={() => openOrderDetails(order)} 
                  className={styles.showMoreButton}
                >
                  Просмотр
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Модальное окно с товарами заказа */}
      {selectedOrder && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Товары в заказе №{selectedOrder.order_id}</h3>
            <ul>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item, index) => (
                  <li key={index}>
                    {item.category} {item.name} ({item.quantity} x {item.volume || 'не указано'} {item.unit || ''})
                  </li>
                ))
              ) : (
                <p>Товары отсутствуют.</p>
              )}
            </ul>
            <button onClick={closeOrderDetails} className={styles.closeButton}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}