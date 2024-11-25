import ProductCard from '../components/ProductCard';

export default async function ProductsPage() {
  const res = await fetch('http://localhost:3000/api/allProducts', { cache: 'no-store' }); // URL вашего API
  const products = await res.json();

  return (
    <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '30px', 
        justifyContent: 'center' }
        }>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
