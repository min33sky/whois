import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import searchReducer from '../search/state';
import searchSaga from '../search/state/saga';
import userReducer from '../user/state';
import userSaga from '../user/state/saga';
import commonReducer from './state';

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  common: commonReducer,
  search: searchReducer,
  user: userReducer,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancer(applyMiddleware(sagaMiddleware)));

function* rootSaga() {
  yield all([searchSaga(), userSaga()]);
}

sagaMiddleware.run(rootSaga);

export default store;
