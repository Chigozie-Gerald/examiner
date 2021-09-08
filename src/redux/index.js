import { combineReducers } from 'redux';
import loaderReducer from './loader/loaderReducer';
import errorReducer from './error/errorReducer';

const rootReducer = combineReducers({
  loader: loaderReducer,
  error: errorReducer,
});

export default rootReducer;
export { questionLoading } from './loader/loader';
export { tagLoading } from './loader/loader';
export { questionLoaded } from './loader/loader';
export { tagLoaded } from './loader/loader';
