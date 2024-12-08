import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Обертываем весь контент в CartProvider */}
        <CartProvider>
          <main>
            <Header />
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
