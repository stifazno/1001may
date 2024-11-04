"use client"; // Указание, что компонент клиентский
import styles from './Header.css';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation'; // Импортируем usePathname

const Header = () => {
    const pathname = usePathname(); // Получаем текущий маршрут
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const modalRef = useRef(null); // Создаём реф для модального окна

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

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
            console.log('Login successful:', data);
        } else {
            console.error('Login failed:', data.error);
        }

        setShowLoginForm(false); // Закрываем форму после отправки
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
        <header>
            <nav>
                <div className="burgerMenu" onClick={toggleMenu}>
                    ☰ Меню
                </div>
                <div className={`menu ${isMenuOpen ? 'active' : ''}`}>
                    <Link href="#">Контакты</Link>
                    <Link href="#">Email</Link>
                    <Link href="#">Адрес</Link>
                </div>
            </nav>
            {/* Условный рендеринг ссылки "Войти" только если мы не на странице регистрации */}
            {pathname !== '/registration' && !showLoginForm && (
                <div>
                    <a href="#" onClick={handleLoginClick} id="enter" className="enter-active">
                        Войти
                    </a>
                </div>
            )}

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
    );
}

export default Header;
