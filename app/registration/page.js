'use client'; // Добавьте эту строку в начало файла
import React, { useState } from 'react'; // Добавлен импорт React
import Link from 'next/link';
import styles from './page.module.css';

export default function Registration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: 'Проектировщик',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <div className={styles.registrationContainer}>
      <h1 className={styles.header}>Регистрация</h1>
      <p className={styles.textCenter}>
        Если вы уже зарегистрированы, перейдите на страницу{' '}
        <Link href="/login">авторизации</Link>.
      </p>
      <form onSubmit={handleSubmit}>
        <h2 className={styles.subHeader}>Основные данные</h2>
        <div className={styles.formGroup}>
          <label className={styles.label}>Имя</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Фамилия</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Телефон</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>

        <h2 className={styles.subHeader}>Дополнительно</h2>
        <div className={styles.formGroup}>
          <label className={styles.label}>Компания</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Должность</label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className={styles.selectField}
          >
            <option value="Проектировщик">Проектировщик</option>
            <option value="Инженер">Инженер</option>
            <option value="Менеджер">Менеджер</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Продолжить
        </button>
      </form>

      <p className={styles.textCenter}>
        Если у вас есть вопросы, обратитесь к нам.
      </p>
    </div>
  );
}
