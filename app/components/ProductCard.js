// app/components/ProductCard.js
import { useCart } from './CartContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart(); // Используем хук для получения функции добавления в корзину

  // Конвертация объема в литры
  const getVolumeInLiters = (volume, unit) => {
    if (unit === 'ltr') {
      return `${volume} л`;
    } else if (unit === 'ml') {
      return `${(volume / 1000).toFixed(2)} л`;
    } else if (unit === 'cl') {
      return `${(volume / 100).toFixed(2)} л`;
    } else {
      return `${volume} ${unit}`;
    }
  };

  const handleAddToCart = () => {
    // Добавляем товар в корзину
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        <img src={'https://via.placeholder.com/150'} alt={product.name} />
      </div>
      <div className={styles.productDetails}>
        <p className={styles.productPrice}>
          <span className={styles.currentPrice}>{product.price} TJS</span>
        </p>
        <h3 className={styles.productName}>
          {product.name} ({product.volume} {product.unit})
        </h3>
        <p>
          {product.category}
        </p>
        <button className={styles.addToCart} onClick={handleAddToCart}>
          В корзину
        </button>
      </div>
    </div>
  );
}
