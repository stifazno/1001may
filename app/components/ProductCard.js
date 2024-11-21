import styles from './ProductCard.module.css'

export default function ProductCard ({ product }){
    return(
        <div className={styles.productCard}>
      <div className={styles.productImage}>
        <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} />
        {product.discount && <div className={styles.discount}>-{product.discount}%</div>}
      </div>
      <div className={styles.productDetails}>
        <p className={styles.productPrice}>
          <span className={styles.currentPrice}>{product.price} ₽</span>
          {product.old_price && (
            <span className={styles.oldPrice}>{product.old_price} ₽</span>
          )}
        </p>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productInfo}>{product.details}</p>
        <div className={styles.productRating}>
          <span>★ ★ ★ ★ ☆</span>
          <span className={styles.reviews}>{product.reviews || 0}</span>
        </div>
        <button className={styles.addToCart}>В корзину</button>
      </div>
    </div>
  );
    
}