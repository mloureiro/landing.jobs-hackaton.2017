import React, { Component, PropTypes } from 'react';

// Import Style
import styles from './Avatar.css';

export default class Avatar extends Component {
  static propTypes = {
    profileData: PropTypes.object.isRequired,
  }

  render() {
    const profileData = this.props.profileData;
    const cls = `${styles.userInfo}`;
    return (
      <div className={cls}>
        <div>
          <div className={styles['name']}>{profileData.name}</div>
          <img alt="Avatar" className={styles['avatar']} src={profileData.avatar_url} />
          <div className={styles['company']}>{profileData.company}</div>
          <div className={styles['location']}>{profileData.location}</div>
        </div>
        <div>
          <div>{profileData.quantity_repos} repos created</div>
          <div>{profileData.quantity_followers} followers</div>
        </div>
      </div>
    );
  }
}
