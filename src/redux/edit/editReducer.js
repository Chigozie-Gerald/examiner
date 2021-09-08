import {
  QUESTION_DELETED,
  QUESTION_EDITED,
  TAG_DELETED,
  TAG_EDITED,
} from '../types';

const initialState = {
  delete_question_success: false,
  edit_question_success: false,
  delete_tag_success: false,
  edit_tag_success: false,
};

const editReducer = (state = initialState, action) => {
  //For edit and delete actions
  switch (action.type) {
    case QUESTION_DELETED: {
      return {
        ...state,
        delete_question_success: true,
      };
    }
    case QUESTION_EDITED: {
      return {
        ...state,
        edit_question_success: true,
      };
    }
    case TAG_DELETED: {
      return {
        ...state,
        delete_tag_success: true,
      };
    }
    case TAG_EDITED: {
      return {
        ...state,
        edit_tag_success: true,
      };
    }

    default:
      return state;
  }
};
export default editReducer;
