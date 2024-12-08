"use client"; // Указание, что компонент клиентский
import '@fortawesome/fontawesome-free/css/all.css';
import styles from './Header.css';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation'; // Импортируем usePathname
import { useCart } from './CartContext';
import { setCookie } from 'cookies-next'; // библиотека для работы с cookies

const Header = () => {
    const pathname = usePathname(); // Получаем текущий маршрут
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [searchTerm, setSearchTerm] = useState(''); // Хранение поискового запроса
    const [searchResults, setSearchResults] = useState([]); // Результаты поиска
    const { cart, totalCost } = useCart();

    const modalRef = useRef(null); // Создаём реф для модального окна
    
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/products/search?search=${encodeURIComponent(searchTerm)}`);
            const data = await res.json();
            if (res.ok) {
                setSearchResults(data); // Сохраняем результаты поиска
            } else {
                alert(`Ошибка: ${data.error || 'Не удалось выполнить поиск'}`);
            }
        } catch (error) {
            alert('Ошибка сети. Проверьте соединение.');
            console.error('Search error:', error);
        }
    };

    const handleLoginClick = (e) => {
        e.preventDefault(); // предотвращаем переход по ссылке
        setShowLoginForm(true); // показываем форму
    };

    const handleClose = () => {
        setShowLoginForm(false); // закрываем форму
    };

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev); // Переключение состояния видимости меню
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // предотвращаем перезагрузку страницы

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Успешный вход. Добро пожаловать!'); // Сообщение об успехе
                console.log('Login successful:', data);
                setIsLoggedIn(true); // Обновляем состояние
                setCookie('token', data.token, { maxAge: 60 * 60 * 24 }); // Пример с хранением на 24 часа
            } else {
                alert(`Ошибка: ${data.error || 'Не удалось войти'}`); // Сообщение об ошибке
                console.error('Login failed:', data.error);
            }
        } catch (error) {
            alert('Ошибка сети. Проверьте соединение и попробуйте снова.');
            console.error('Network error:', error);
        }

        setShowLoginForm(false); // Закрываем форму после попытки входа
    };

    // Обработчик кликов вне модального окна
    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowLoginForm(false); // Закрываем форму, если клик был вне неё
        }
    };

    // Добавляем обработчик событий при монтировании компонента
    useEffect(() => {
        if (showLoginForm) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLoginForm]);

    return (
        <div className='headerNavig'>
            <header className="header">
                <div className="headerLogo">
                    <Link href="/" >1001may LOGO</Link>
                </div>
                <div className="headerKatalog">
                    Каталог
                </div>
                <div className="headerSearch">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Искать..."
                            className="searchInput"
                        />
                        <Link href={`/search?search=${searchTerm}`}>
                            <button type="submit" className="searchButton">
                               Поиск   
                            </button>
                        </Link>
                    </form>
                </div>
                <div className="searchResults">
                    {searchResults.length > 0 && (
                        <ul>
                            {searchResults.map((product) => (
                                <li key={product.id}>
                                    {product.name} — {product.price} ₽
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="headerButtons">
                    {!isLoggedIn && pathname !== '/registration' && !showLoginForm && (
                        <a href="#" onClick={handleLoginClick} className={`${styles.iUserHeader} ${styles.headerNavItem}`}>
                            <i className="fa fa-user"></i> {/* Иконка пользователя */}
                            <span className={styles.headerNavItemText}>Войти</span>
                        </a>
                    )}
                    <a href="#" className={`${styles.iFavoriteHeader} ${styles.headerNavItem}`}>
                        <i className="fa fa-heart"></i> {/* Иконка сердца */}
                        <span className={styles.headerNavItemText}>Избранное</span>
                    </a>
                    <Link href="/cart" className={`${styles.iCartHeader} ${styles.headerNavItem}`}>
                        <i className="fa fa-shopping-cart"></i> {/* Иконка корзины */}
                        <span className={styles.headerNavItemText}>
                            Корзина ({cart.length}): {totalCost} TJS
                        </span>
                    </Link>
                </div>

                {showLoginForm && (
                    <div className="modal">
                        <div className="modal-content" ref={modalRef}>
                            <div className="login-box">
                                <span className="close" onClick={handleClose}>&times;</span>
                                <h2>Вход</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="user-box">
                                        <input
                                            type="text"
                                            name="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                        <label>Логин</label>
                                    </div>
                                    <div className="user-box">
                                        <input
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <label>Пароль</label>
                                    </div>
                                    <Link href="/registration" passHref legacyBehavior>
                                        <div className="registration" onClick={handleClose}>
                                            Создать аккаунт
                                        </div>
                                    </Link>
                                    <button type="submit" className="login-button">Войти</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </header>
            <nav>
                <div className="navigationWrapper">
                    <ul className="navigation">
                        <li className="navItem">
                            <Link href="/allProducts?category=Вино" className={styles.navItem}>Вино</Link>
                        </li>
                        <li className="navItem">
                            <Link href="/allProducts?category=Виски" className={styles.navItem}>Виски</Link>
                        </li>
                        <li className="navItem">
                            <Link href="/allProducts?category=Коньяк" className={styles.navItem}>Коньяк</Link>
                        </li>
                        <li className="navItem">
                            <Link href="/allProducts?category=Водка" className={styles.navItem}>Водка</Link>
                        </li>
                        <li className="navItem">
                            <Link href="/allProducts?category=Пиво" className={styles.navItem}>Пиво</Link>
                        </li>
                        <li className="navItem">
                            <Link href="/allProducts?category=Бренди" className={styles.navItem}>Бренди</Link>
                        </li>
                        <li className="navItem">
                            <Link href="/allProducts?category=Джин" className={styles.navItem}>Джин</Link>
                        </li>
                        <li className="navItem">
                            <Link href="/allProducts?category=Ликёр" className={styles.navItem}>Ликер</Link>
                        </li>
                        <li className="navItem">
                            <Link href="/allProducts?category=Шампанское" className={styles.navItem}>Шампанское</Link>
                        </li>
                        <li className="navItem">
                            <Link href="/allProducts?category=Ром" className={styles.navItem}>Ром</Link>
                        </li>
                        <li className="navItem">
                            <Link href="/allProducts?category=Текила" className={styles.navItem}>Текила</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Header;
