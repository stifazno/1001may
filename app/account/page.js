'use client';

import React, { useEffect, useState } from 'react';
import styles from './account.module.css';

export default function Account() {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    async function fetchAccountData() {
      try {
        const response = await fetch('/api/account?userId=6');
        if (!response.ok) {
          throw new Error('Failed to fetch account data');
        }
        const data = await response.json();
        setUserData(data.user);
        setOrders(data.orders);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchAccountData();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!userData) {
    return <div>Ошибка загрузки данных. Попробуйте снова.</div>;
  }

  return (
    <div className={styles.accountContainer}>
      <div className={styles.userInfo}>
        <h2>Личная информация</h2>
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            <img src="https://via.placeholder.com/150" alt="Avatar" />
          </div>
          <div className={styles.details}>
            <h3>{userData.firstname} {userData.lastname}</h3>
            <p><strong>Имя пользователя:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email || 'Не указан'}</p>
            <p><strong>Телефон:</strong> {userData.phone}</p>
            <p><strong>Компания:</strong> {userData.company || 'Не указана'}</p>
          </div>
        </div>
      </div>

      <div className={styles.orderHistory}>
        <h2>История заказов</h2>
        {orders.length === 0 ? (
          <p>У вас пока нет заказов.</p>
        ) : (
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Номер заказа</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Сумма</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>{order.order_status}</td>
                  <td>{order.total_cost} ₽</td>
                  <td>
                    <button
                      className={styles.viewButton}
                      onClick={() => openModal(order)}
                    >
                      Смотреть
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && selectedOrder && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Детали заказа {selectedOrder.order_id}</h3>
            <p><strong>Дата:</strong> {new Date(selectedOrder.order_date).toLocaleDateString()}</p>
            <p><strong>Статус:</strong> {selectedOrder.order_status}</p>
            <p><strong>Сумма:</strong> {selectedOrder.total_cost} ₽</p>
            <h4>Товары:</h4>
            <ul>
              {selectedOrder.items.map((item) => (
                <li key={item.product_id}>
                  {item.product_name} ({item.quantity} x {item.product_price} ₽)
                </li>
              ))}
            </ul>
            <button className={styles.closeModalButton} onClick={closeModal}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
