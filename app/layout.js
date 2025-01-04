import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';

export default function RootLayout({ children, showHeader = true }) {  // Добавляем пропс showHeader
  return (
    <html lang="en">
      <body>
        {/* Обертываем весь контент в CartProvider */}
        <CartProvider>
          <main>
            {showHeader && <Header />}  {/* Условно рендерим хедер */}
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
