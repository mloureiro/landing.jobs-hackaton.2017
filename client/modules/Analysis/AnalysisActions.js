import callApi from '../../util/apiCaller';

// Export Constants
export const ADD_RESULT = 'ADD_RESULT';

// Export Actions
export function addResult(result) {
  return {
    type: ADD_RESULT,
    result,
  };
}

export function fetchResult(username) {
  return (dispatch) => {
    return callApi(`analyzer/${username}/github`).then(res => dispatch(addResult(res.content)));
  };
}
