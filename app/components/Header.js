"use client"; // Указание, что компонент клиентский
import styles from './Header.css'
import Link from 'next/link';
import { useState } from 'react';

const Header = () =>{

    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние для управления видимостью меню
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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

    const handleSubmit = (e) => {
        e.preventDefault(); // предотвращаем перезагрузку страницы
        console.log('Username:', username);
        console.log('Password:', password);
        setShowLoginForm(false); // Закрываем форму после отправки
    };




    return(
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
            <div >
                <a href="#" onClick={handleLoginClick} id="enter" 
                className={showLoginForm ? 'enter-active' : ''}
                >Войти</a>
            </div>




            {showLoginForm && (
                <div className="modal">
                <div className="modal-content">
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
                        <button type="submit" className="login-button">Войти</button>
                    </form>
                    </div>
                </div>
                </div>
            )}
















        </header>
    )
}

export default Header;
