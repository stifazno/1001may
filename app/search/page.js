'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const searchParams = useSearchParams(); 
  const searchTerm = searchParams.get('search'); 

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (searchTerm) {
        const res = await fetch(`/api/products/search?search=${searchTerm}`, { cache: 'no-store' });
        const data = await res.json();
        setProducts(data); 
      }
    };

    fetchProducts();
  }, [searchTerm]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
            {searchTerm ? `Результаты поиска по "${searchTerm}"` : 'Результаты поиска'}
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
    </Suspense>
  );
}
