import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  // Конвертация объема в литры
  const getVolumeInLiters = (volume, unit) => {
    if (unit === 'ltr') {
      return `${volume} л`;
    } else if (unit === 'ml') {
      return `${(volume / 1000).toFixed(2)} л`;
    } else if (unit === 'cl') {
      return `${(volume / 100).toFixed(2)} л`;
    } else {
      // Для других единиц возвращаем исходное значение с указанием единиц
      return `${volume} ${unit}`;
    }
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} />
      </div>
      <div className={styles.productDetails}>
        <p className={styles.productPrice}>
          <span className={styles.currentPrice}>{product.price} TJS</span>
          {product.price && (
            <span className={styles.oldPrice}>{product.price} TJS</span>
          )}
        </p>
        <h3 className={styles.productName}>
          {product.name} ({getVolumeInLiters(product.volume, product.unit)})
        </h3>
        <button className={styles.addToCart}>В корзину</button>
      </div>
    </div>
  );
}
