import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
} from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import app from './reducers';

const reducer = combineReducers({
  app,
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [
  thunkMiddleware,
  createLogger(),
];
export default createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(...middleware),
  ),
);
