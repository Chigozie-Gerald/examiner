import { CLEAR_ERROR, GET_ERROR } from '../types';

const initialState = {
  msg: null,
  status: null,
  type: null,
  id: null,
};

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_ERROR: {
      return {
        ...state,
        msg: null,
        status: null,
        id: null,
        type: null,
      };
    }
    case GET_ERROR: {
      return {
        ...state,
        type: action.payload?.type || null,
        msg: action.payload?.msg || null,
        status: action.payload?.status || null,
        id: action.payload?.id || null,
      };
    }
    default:
      return state;
  }
};

export default errorReducer;
