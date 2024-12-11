'use client'; // Директива для указания, что это клиентский компонент

import { useSearchParams } from 'next/navigation'; // Хук для получения параметров поиска
import { useState, useEffect } from 'react'; // Импортируем useState и useEffect

import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const searchParams = useSearchParams(); // Хук для получения параметров поиска
  const category = searchParams.get('category'); // Получаем значение параметра category

  const [products, setProducts] = useState([]); // Состояние для хранения продуктов

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`/api/allProducts?category=${category}`, { cache: 'no-store' });
      const data = await res.json();
      setProducts(data); // Обновляем список товаров
    };

    if (category) {
      fetchProducts(); // Загружаем товары для выбранной категории
    }
  }, [category]); // Эффект срабатывает, когда изменяется категория

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      {/* Отключаем перехват кликов для всех элементов */}
      <div
        style={{
          maxWidth: '1350px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>{category}</h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '30px',
            justifyContent: 'center',
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
