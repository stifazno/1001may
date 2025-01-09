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
      const res = await fetch(`/api/products/search?search=${searchTerm}`, { cache: 'no-store' });
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
      <div
        style={{
          maxWidth: '1350px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>
          {searchTerm ? `Результаты поиска по "${searchTerm}"` : 'Результат поиска'}
        </h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '30px',
            justifyContent: 'center',
            pointerEvents: 'none', // Отключаем перехват кликов для всего контейнера
          }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>Товар не найден!</p>
          )}
        </div>
      </div>
    </div>
  );
}
