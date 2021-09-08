import { QUESTION_EDITED, QUESTION_DELETED } from '../types';
import axios from 'axios';
import { getError } from '../error/errorAction';
import { loadQuestion } from '../loader/loader';

export const editQuestionSuccess = () => {
  return {
    type: QUESTION_EDITED,
  };
};
export const deleteQuestionSuccess = () => {
  return {
    type: QUESTION_DELETED,
  };
};

export const editQuestion = () => {
  return (dispatch) => {
    axios
      .get('http://localhost:6060/api/profile/questionReadAll', {
        'content-type': 'application/json',
      })
      .then(() => {
        dispatch(editQuestionSuccess());
        dispatch(loadQuestion());
        dispatch(loadTag());
      })
      .catch((err) => {
        dispatch(
          getError(err.response.data.msg, err.response.status),
        );
      });
  };
};

export const deleteQuestion = () => {
  return (dispatch) => {
    axios
      .get('http://localhost:6060/api/profile/questionReadAll', {
        'content-type': 'application/json',
      })
      .then(() => {
        dispatch(deleteQuestionSuccess());
        dispatch(loadQuestion());
        dispatch(loadTag());
      })
      .catch((err) => {
        dispatch(
          getError(err.response.data.msg, err.response.status),
        );
      });
  };
};
