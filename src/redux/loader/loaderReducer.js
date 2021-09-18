import {
  QUESTION_SUCCESS,
  QUESTION_ERROR,
  TAG_SUCCESS,
  TAG_ERROR,
  QUESTIONLOADING,
  QUESTIONLOADED,
  TAGLOADING,
  TAGLOADED,
} from '../types';

const initialState = {
  questions: [],
  tags: [],
  questionLoading: false,
  questionError: '',
  tagLoading: false,
  tagError: '',
};

const loaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case QUESTION_SUCCESS: {
      //For question creation
      const list = [...state.questions, action.payload];
      return {
        ...state,
        questionError: '',
        questionLoading: false,
        questions: list,
      };
    }
    case QUESTION_ERROR: {
      //For question errors during creation or loading
      return {
        ...state,
        questionError:
          action?.payload?.error ||
          "Questions couldn't be created/loaded",
        questionLoading: false,
      };
    }
    case TAG_SUCCESS: {
      //For tag creation
      return {
        ...state,
        tagError: '',
        tagLoading: false,
        tags: [...state.tags, action.payload],
      };
    }
    case TAG_ERROR: {
      //For tag errors during creation or loading
      return {
        ...state,
        tagError:
          action.payload?.error || "Questions couldn't be created",
        tagLoading: false,
      };
    }
    case QUESTIONLOADING: {
      //For loading already created questions
      return {
        ...state,
        questionLoading: true,
      };
    }
    case QUESTIONLOADED: {
      //Already created questions loaded completely
      return {
        ...state,
        questionError: '',
        questionLoading: false,
        questions: action.payload,
      };
    }
    case TAGLOADING: {
      //For loading already created tags
      return {
        ...state,
        tagLoading: true,
      };
    }
    case TAGLOADED: {
      //Already created tags loaded completely
      const tags = [...action?.payload];
      return {
        ...state,
        tagError: '',
        tagLoading: false,
        tags: tags,
      };
    }

    default:
      return state;
  }
};
export default loaderReducer;
