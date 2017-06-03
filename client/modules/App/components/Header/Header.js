import React from 'react';

// Import Style
import styles from './Header.css';

export function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <h1 className={styles.siteTitle}>
          WhatTheGithub
        </h1>
      </div>
    </div>
  );
}
export default Header;
