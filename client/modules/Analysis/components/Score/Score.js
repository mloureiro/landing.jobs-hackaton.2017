import React, { Component, PropTypes } from 'react';
import CircularProgressbar from 'react-circular-progressbar';

// Import Style
import styles from './Score.css';

export default class Score extends Component {
  static propTypes = {
    score: PropTypes.number.isRequired,
  };

  render() {
    return (
      <CircularProgressbar
        className={styles.CircularProgressbar}
        percentage={this.props.score}
        initialAnimation
      />
    );
  }
}
