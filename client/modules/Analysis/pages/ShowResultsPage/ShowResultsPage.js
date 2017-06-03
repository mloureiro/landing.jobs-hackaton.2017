import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

// Import Style

// Import Actions
import { fetchResult } from '../../AnalysisActions';

// Import Selectors
import { getResult } from '../../AnalysisReducer';

export function ShowResultsPage(props) {
  return (
    <div>
      <Helmet title={props.result.name} />
      <div>
        <div>{props.result.name}</div>
        <img alt="Avatar" src={props.result.avatar_url} />
        <div>{props.result.company}</div>
        <div>{props.result.location}</div>
      </div>
      <div>
        <div>{props.result.quantity_repos} repos created</div>
        <div>{props.result.quantity_followers} followers</div>
      </div>
    </div>
  );
}

// Actions required to provide data for this component to render in server side.
ShowResultsPage.need = [params => {
  return fetchResult(params.username);
}];

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    result: getResult(state, props.params.username),
  };
}

ShowResultsPage.propTypes = {
  result: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(ShowResultsPage);
