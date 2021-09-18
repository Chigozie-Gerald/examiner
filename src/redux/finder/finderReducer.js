import { FIND_SUCCESS, COMBINE_SUCCESS } from '../types';

const initialState = {
  tags: [],
  questions: [],
};

const finderReducer = (state = initialState, action) => {
  switch (action.type) {
    case FIND_SUCCESS: {
      return {
        tags: action?.payload?.tags,
        questions: action?.payload?.questions,
      };
    }
    case COMBINE_SUCCESS: {
      return {
        tags: [],
        questions: action?.payload?.questions,
      };
    }
    default:
      return state;
  }
};

export default finderReducer;
