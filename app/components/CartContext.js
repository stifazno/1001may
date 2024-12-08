'use client';
import { createContext, useContext, useState } from 'react';

// Создаем контекст для корзины
export const CartContext = createContext();

// Провайдер контекста
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  // Функция для добавления товара в корзину
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Проверяем, есть ли товар в корзине
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        // Если товар есть, увеличиваем его количество
        const updatedCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        updateTotalCost(updatedCart);
        return updatedCart;
      } else {
        // Если товара нет, добавляем его
        const updatedCart = [...prevCart, { ...product, quantity: 1 }];
        updateTotalCost(updatedCart);
        return updatedCart;
      }
    });
  };

  // Обновление общей стоимости корзины
  const updateTotalCost = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalCost(total);
  };

  // Удаление товара из корзины
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    updateTotalCost(updatedCart);
  };

  // Очистка корзины
  const clearCart = () => {
    setCart([]);
    setTotalCost(0);
  };

  return (
    <CartContext.Provider value={{ cart, totalCost, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Хук для доступа к корзине
export const useCart = () => {
  return useContext(CartContext);
};
