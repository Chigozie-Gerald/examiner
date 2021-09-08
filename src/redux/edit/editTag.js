import { TAG_EDITED, TAG_DELETED, EDITING_TAG } from '../types';
import axios from 'axios';
import { getError } from '../error/errorAction';
import { loadTag } from '../loader/loader';

export const editTagSuccess = () => {
  return {
    type: TAG_EDITED,
  };
};
export const deleteTagSuccess = () => {
  return {
    type: TAG_DELETED,
  };
};

export const editTag = () => {
  return (dispatch) => {
    axios
      .get('http://localhost:6060/api/profile/questionReadAll', {
        'content-type': 'application/json',
      })
      .then(() => {
        dispatch(editTagSuccess());
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

export const deleteTag = () => {
  return (dispatch) => {
    axios
      .get('http://localhost:6060/api/profile/questionReadAll', {
        'content-type': 'application/json',
      })
      .then(() => {
        dispatch(deleteTagSuccess());
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
