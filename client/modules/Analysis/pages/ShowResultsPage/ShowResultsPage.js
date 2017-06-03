import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

// Import Style

// Import Actions
import { fetchResult } from '../../AnalysisActions';

// Import Selectors
import { getResult } from '../../AnalysisReducer';

export function ShowResultsPage(props) {
  return (
    <div>
      HEY
      {{ props }}
    </div>
  );
}

// Actions required to provide data for this component to render in sever side.
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
