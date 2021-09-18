import { COMBINE_SUCCESS, FIND_SUCCESS } from '../types';
import { getError } from '../error/errorAction';
import axios from 'axios';

export const combineSuccess = (payload) => {
  return {
    type: COMBINE_SUCCESS,
    payload,
  };
};

export const finderSuccess = (payload) => {
  return {
    type: FIND_SUCCESS,
    payload,
  };
};

export const finder = (body) => {
  return (dispatch) => {
    const BODY = JSON.stringify(body);
    axios
      .post('http://localhost:6060/api/finder', BODY, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((details) => {
        dispatch(finderSuccess(details.data));
      })
      .catch((err) => {
        dispatch(
          getError(
            err?.response?.data?.msg,
            err?.response?.status,
            err?.response?.id,
            err?.response?.data?.type,
          ),
        );
      });
  };
};

export const combine = (body) => {
  return (dispatch) => {
    const BODY = JSON.stringify(body);
    axios
      .post('http://localhost:6060/api/combine', BODY, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((details) => {
        dispatch(combineSuccess(details.data));
      })
      .catch((err) => {
        dispatch(
          getError(
            err?.response?.data?.msg,
            err?.response?.status,
            err?.response?.data?.id,
            err?.response?.data?.type,
          ),
        );
      });
  };
};
