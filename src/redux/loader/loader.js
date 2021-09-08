import {
  QUESTIONLOADING,
  QUESTIONLOADED,
  TAGLOADING,
  TAGLOADED,
} from '../types';
import axios from 'axios';
import { getError } from '../error/errorAction';

export const questionLoading = () => {
  return {
    type: QUESTIONLOADING,
  };
};
export const questionLoaded = (payload) => {
  return {
    type: QUESTIONLOADED,
    payload,
  };
};

export const tagLoading = () => {
  return {
    type: TAGLOADING,
  };
};
export const tagLoaded = (payload) => {
  return {
    type: TAGLOADED,
    payload,
  };
};

export const loadQuestion = () => {
  return (dispatch) => {
    dispatch(questionLoading());
    axios
      .get('http://localhost:6060/api/questionReadAll', {
        'content-type': 'application/json',
      })
      .then((res) => {
        dispatch(questionLoaded(res.data.questions));
      })
      .catch((err) => {
        dispatch(
          getError(err.response.data.msg, err.response.status),
        );
      });
  };
};

export const loadTag = () => {
  return (dispatch) => {
    dispatch(tagLoading());
    axios
      .get('http://localhost:6060/api/tagReadAll', {
        'content-type': 'application/json',
      })
      .then((res) => {
        dispatch(tagLoaded(res.data.tags));
      })
      .catch((err) => {
        dispatch(
          getError(err.response.data.msg, err.response.status),
        );
      });
  };
};
