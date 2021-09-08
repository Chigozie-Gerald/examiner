import { GET_ERROR, CLEAR_ERROR } from "../types";

export const getError = (msg, status, type = null, id = null) => {
  return {
    type: GET_ERROR,
    payload: {
      msg,
      status,
      type,
      id,
    },
  };
};
export const clearError = () => {
  return {
    type: CLEAR_ERROR,
  };
};
