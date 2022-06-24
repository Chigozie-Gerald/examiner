import { TAG_EDITED, TAG_DELETED } from '../types';
import axios from 'axios';
import { getError } from '../error/errorAction';
import { loadQuestion, loadTag } from '../loader/loader';

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

export const editTag = (_id, edit_data) => {
  return (dispatch) => {
    const body = { _id, ...edit_data };
    const fd = new FormData();
    Object.keys(body).forEach((key) => {
      fd.append(key, body[key]);
    });

    axios
      .post('http://localhost:6060/api/tagEdit', fd, {
        'content-type': 'application/json',
      })
      .then(() => {
        dispatch(editTagSuccess());
        dispatch(loadQuestion());
        dispatch(loadTag());
      })
      .catch((err) => {
        dispatch(
          getError(err?.response?.data?.msg, err?.response?.status),
        );
      });
  };
};

export const deleteTag = (_id) => {
  return (dispatch) => {
    const BODY = { _id };
    axios
      .post('http://localhost:6060/api/questionDelete', {
        'content-type': 'application/json',
        BODY,
      })
      .then(() => {
        dispatch(deleteTagSuccess());
        dispatch(loadQuestion());
        dispatch(loadTag());
      })
      .catch((err) => {
        dispatch(
          getError(err?.response?.data?.msg, err?.response?.status),
        );
      });
  };
};
