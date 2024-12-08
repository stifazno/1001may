'use client';

import { useSearchParams } from 'next/navigation'; 
import { useState, useEffect } from 'react'; 

import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const searchParams = useSearchParams(); 
  const searchTerm = searchParams.get('search'); 

  const [products, setProducts] = useState([]); 

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`http://localhost:3000/api/products/search?search=${searchTerm}`, { cache: 'no-store' });
      const data = await res.json();
      console.log('Products fetched from search:', data); // Логируем полученные товары
      setProducts(data); 
    };

    if (searchTerm) {
      fetchProducts(); 
    }
  }, [searchTerm]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{ zIndex: '-1', maxWidth: '1350px', width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <h2 style={{ textAlign: 'center' }}>Search results for "{searchTerm}"</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </div>
  );
}