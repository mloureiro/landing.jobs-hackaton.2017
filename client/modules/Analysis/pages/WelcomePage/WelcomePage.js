import React from 'react';
import UsernameInput from '../../components/UsernameInput/UsernameInput';

import styles from './WelcomePage.css';

export default class WelcomePage extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(value) {
    window.location.replace(`/results/${value}`);
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <UsernameInput
          name="username"
          placeholder="Insert GitHub User Name..."
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}
