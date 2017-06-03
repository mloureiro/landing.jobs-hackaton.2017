import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './UsernameInput.css';

export default class UsernameInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.value || !this.props.handleSubmit) {
      // @todo error message maybe?
      return;
    }

    this.props.handleSubmit(this.state.value);
  }

  render() {
    return (
      <form
        className={styles.inputWrapper}
        onSubmit={this.handleSubmit}
      >
        <input
          className={styles.mainInput}
          type="text"
          name={this.props.name}
          value={this.state.value}
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
        />
        <FontAwesome
          className={styles.searchIcon}
          name="search"
        />
      </form>
    );
  }
}
