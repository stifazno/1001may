import { useState } from 'react';
import { useCart } from './CartContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1); // Состояние для количества товара

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value); // Преобразуем в число
    console.log("Input value before update:", value); // Логируем значение перед обновлением

    if (value >= 1) {
      setQuantity(value); // Обновляем только если значение корректное
      console.log("Updated quantity:", value); // Логируем после обновления
    }
  };

  const handleAddToCart = () => {
    console.log("Adding to cart with quantity:", quantity); // Логируем количество перед добавлением
    if (quantity < 1) return; // Проверяем на случай некорректного значения

    // Добавляем товар в корзину столько раз, сколько указано в quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1, // Добавляем 1 единицу товара за каждый цикл
      });
    }
  };

  return (
    <div className={styles.productListItem}>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productCategory}>Категория: {product.category}</p>
        <p className={styles.productVolume}>Объем: {product.volume} {product.unit}</p>
        <p className={styles.productPrice}>Цена: {product.price} TJS</p>
      </div>
      <div className={styles.controls}>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className={styles.quantityInput}
        />
        <button className={styles.addToCart} onClick={handleAddToCart}>
          В корзину
        </button>
      </div>
    </div>
  );
}
