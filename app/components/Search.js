// app/components/Search.js
"use client"; // Добавьте эту строку

import { useState } from 'react';
import styles from './Search.module.css';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <form action="submit" className={styles.searchForm}>
      <div className={styles.searchInner}>
        <input
          type="search"
          id="SearchInput"
          placeholder="Search"
          value={searchValue}
          onChange={handleChange}
          className={styles.searchInput}
        />
        <label className={styles.label} htmlFor="SearchInput"></label>
      </div>
    </form>
  );
};

export default Search;
