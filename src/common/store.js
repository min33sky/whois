import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import searchReducer from '../search/state';
import searchSaga from '../search/state/saga';

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  search: searchReducer,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancer(applyMiddleware(sagaMiddleware)));

function* rootSaga() {
  yield all([searchSaga()]);
}

sagaMiddleware.run(rootSaga);

export default store;
