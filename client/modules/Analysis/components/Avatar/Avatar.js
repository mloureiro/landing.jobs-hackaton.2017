import React, {Component, PropTypes} from "react";
import FontAwesome from "react-fontawesome";
// Import Style
import styles from "./Avatar.css";

export default class Avatar extends Component {
  static propTypes = {
    profileData: PropTypes.object.isRequired,
  }

  render() {
    const profileData = this.props.profileData;

    return (
      <div className={styles.wrapper}>
        <img
          className={styles.avatar}
          src={profileData.avatar_url}
          alt="Avatar"
        />
        <p className={styles.userInfo}>
          <FontAwesome name="user"/>
          {profileData.name}
          <br />
          <FontAwesome name="building-o"/>
          {profileData.company}
          <br />
          <FontAwesome name="map-marker"/>
          {profileData.location}
          <br />
          <FontAwesome name="book"/>
          {profileData.quantity_repos} repos created
          <br />
          <FontAwesome name="arrow-circle-o-left"/>
          {profileData.quantity_followers} followers
        </p>
      </div>
    );
  }
}
