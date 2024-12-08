'use client';

import { useCart } from '../components/CartContext';
import { useRouter } from 'next/navigation';
import styles from './Checkout.module.css'; // Подключение стилей

export default function CheckoutPage() {
  const { cart, totalCost, clearCart } = useCart();
  const router = useRouter();

  const handleOrderSubmit = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, totalCost }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Заказ успешно оформлен! Номер заказа: ' + data.orderId);
        clearCart();
        router.push('/'); // Перенаправление на главную страницу
      } else {
        const errorData = await response.json();
        alert('Ошибка: ' + errorData.error);
      }
    } catch (error) {
      console.error('Ошибка отправки заказа:', error);
      alert('Не удалось оформить заказ');
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h2 className={styles.checkoutTitle}>Оформление заказа</h2>
      {cart.map((item) => (
        <div key={item.id} className={styles.cartItem}>
          <div className={styles.cartItemDetails}>
            <p className={styles.cartItemName}>{item.name}</p>
            <p className={styles.cartItemPrice}>
              Количество: {item.quantity} | Цена: {item.price} TJS
            </p>
          </div>
          <p className={styles.cartItemPrice}>
            Общая стоимость: {item.price * item.quantity} TJS
          </p>
        </div>
      ))}
      <h3 className={styles.totalCost}>Общая стоимость: {totalCost} TJS</h3>
      <button onClick={handleOrderSubmit} className={styles.confirmButton}>
        Подтвердить заказ
      </button>
    </div>
  );
}
