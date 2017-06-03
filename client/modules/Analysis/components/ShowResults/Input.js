import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './Input.css';

export default function() {
  return (
    <div className={styles.inputWrapper}>
      <input
        className={styles.mainInput}
        type="text"
        name="input"
        placeholder="Insert GitHub User Name..."
      />
      <FontAwesome
        className={styles.searchIcon}
        name="search"
      />
    </div>
  );
}
