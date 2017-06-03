import { ADD_RESULT } from './AnalysisActions';

// Initial State
const initialState = { data: [] };

const AnalysisReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_RESULT :
      return {
        data: [action.result, ...state.data],
      };

    default:
      return state;
  }
};

/* Selectors */

// Get result by username
export const getResult = (state, username) => state.results.data.filter(result => result.login.toLowerCase() === username.toLowerCase())[0];

// Export Reducer
export default AnalysisReducer;
