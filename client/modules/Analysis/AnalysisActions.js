import callApi from '../../util/apiCaller';

// Export Constants
export const ADD_RESULT = 'ADD_RESULT';
export const ADD_SCORE = 'ADD_SCORE';

// Export Actions
export function addResult(result) {
  return {
    type: ADD_RESULT,
    result,
  };
}

export function addScore(result) {
  return {
    type: ADD_SCORE,
    result
  };
}

export function fetchScore(username) {
  return (dispatch) => {
    return callApi(`analyzer/${username}/github/score`).then(res => dispatch(addScore(res.content)));
  };
}

export function fetchResult(username) {
  return (dispatch) => {
    return callApi(`analyzer/${username}/github`).then(res => dispatch(addResult(res.content)));
  };
}
