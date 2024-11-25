import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} />
        
      </div>
      <div className={styles.productDetails}>
        <p className={styles.productPrice}>
          <span className={styles.currentPrice}>{product.price} TJS</span>
          {product.price && (
            <span className={styles.oldPrice}>{product.price}TJS</span>
          )}
        </p>
        <h3 className={styles.productName}>{product.name}</h3>
       
        
        <button className={styles.addToCart}>В корзину</button>
      </div>
    </div>
  );
}
