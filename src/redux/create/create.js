import {
  QUESTION_SUCCESS,
  QUESTION_ERROR,
  TAG_SUCCESS,
  TAG_ERROR,
} from '../types';
import { questionLoading, tagLoading } from '../index';
import { getError } from '../error/errorAction';
import axios from 'axios';
import { loadQuestion, loadTag } from '../loader/loader';

export const questionSuccess = (payload) => {
  return {
    type: QUESTION_SUCCESS,
    payload,
  };
};
export const questionError = () => {
  return {
    type: QUESTION_ERROR,
  };
};

export const tagSuccess = (payload) => {
  return {
    type: TAG_SUCCESS,
    payload,
  };
};
export const tagError = () => {
  return {
    type: TAG_ERROR,
  };
};

export const createQuestion = (body) => {
  return (dispatch) => {
    dispatch(questionLoading());
    body.forEach((body) => {
      const fd = new FormData();
      fd.append(`tag`, body.tag);
      fd.append(`title`, body.title);
      fd.append(`details`, body.details);
      fd.append(`image`, body.image);
      axios
        .post('http://localhost:6060/api/questionCreate', fd, {
          headers: {
            'content-type':
              'multipart/form-data; chatset=utf-8; boundary: "????"',
          },
        })
        .then((details) => {
          dispatch(questionSuccess(details.data));
          dispatch(loadQuestion());
          dispatch(loadTag());
        })
        .catch((err) => {
          // console.log(err.response.data, "errordetails");
          dispatch(
            getError(
              err?.response?.data?.msg,
              err?.response?.status,
              err?.response?.id,
              'QUESTION_FAILED',
            ),
          );
          dispatch(questionError());
        });
    });
  };
};

export const createTag = (body) => {
  return (dispatch) => {
    dispatch(tagLoading());
    const fd = new FormData();
    Object.keys(body).forEach((key) => {
      fd.append(key, body[key]);
    });

    axios
      .post('http://localhost:6060/api/tag', fd, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((details) => {
        dispatch(tagSuccess(details.data));
        dispatch(loadQuestion());
        dispatch(loadTag());
        console.log(`tag Creat action`);
      })
      .catch((err) => {
        dispatch(
          getError(
            err?.response?.data?.msg,
            err?.response?.status,
            'Tag creation failed',
            err?.response?.data?.id,
          ),
        );
        dispatch(tagError());
      });
  };
};
