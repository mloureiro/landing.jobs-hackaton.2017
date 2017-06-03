import React, { Component, PropTypes } from 'react';

// Import Style
import styles from './Score.css';

export default class Score extends Component {
  static propTypes = {
    score: PropTypes.number.isRequired,
  }

  render() {
    const score = this.props.score;
    return (
      <div className={styles['scoreNumber']}>
        {score}
      </div>
    );
  }
}
