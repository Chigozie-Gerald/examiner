import { combineReducers } from 'redux';
import loaderReducer from './loader/loaderReducer';
import errorReducer from './error/errorReducer';
import finderReducer from './finder/finderReducer';

const rootReducer = combineReducers({
  loader: loaderReducer,
  error: errorReducer,
  finder: finderReducer,
});

export default rootReducer;
export { questionLoading } from './loader/loader';
export { tagLoading } from './loader/loader';
export { questionLoaded } from './loader/loader';
export { tagLoaded } from './loader/loader';
