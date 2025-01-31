'use client'; // Директива для указания, что это клиентский компонент

import { Suspense, useState, useEffect } from 'react'; // Импортируем Suspense, useState, useEffect
import { useSearchParams } from 'next/navigation'; // Хук для получения параметров поиска
import styles from './allProducts.module.css';
import ProductCard from '../components/ProductCard';
import Cookies from 'js-cookie'; // Импортируем библиотеку для работы с cookies

// Оборачиваем компонент в Suspense для асинхронных операций
export default function AllProductsWrapper() {
  return (
    <Suspense fallback={<div>Loading All Products...</div>}>
      <AllProducts />
    </Suspense>
  );
}

// Убираем лишние скобки в объявлении функции
function AllProducts() {
  const searchParams = useSearchParams(); // Хук для получения параметров поиска
  const category = searchParams.get('category'); // Получаем значение параметра category

  const [isLoggedIn, setLoggedIn] = useState(false);
  const token = Cookies.get('auth_token'); // Получаем токен из cookie
  
  const [products, setProducts] = useState([]); // Состояние для хранения продуктов

  // Загружаем товары, когда изменяется категория
  useEffect(() => {
    const fetchProducts = async () => {
      if (category) {
        const res = await fetch(`/api/allProducts?category=${category}`, { cache: 'no-store' });
        const data = await res.json();
        setProducts(data); // Обновляем список товаров
      }
    };

    fetchProducts(); // Загружаем товары при изменении категории
  }, [category]); // Эффект срабатывает, когда изменяется категория

  // Если пользователь не авторизован, показываем сообщение
  if (!token) {
    return (
      <div className={styles.PleaseSign}>
        Пожалуйста, авторизуйтесь, чтобы увидеть товары
      </div>
    );
  }

  // Рендерим товары, если пользователь авторизован
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
