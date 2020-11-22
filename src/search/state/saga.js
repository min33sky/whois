import { all, call, put, takeEvery } from 'redux-saga/effects';
import { actions, Types } from './index';
import { callApi } from './../../common/util/api';

/**
 *
 * @param {object} param
 * @param {string} param.type
 * @param {string} param.keyword 키워드
 */
function* fetchAutoCompletes({ keyword }) {
  const { isSuccess, data } = yield call(callApi, {
    url: '/user/search',
    params: { keyword },
  });

  if (isSuccess && data) {
    yield put(actions.setValue('autoCompletes', data));
  }
}

export default function* searchSaga() {
  yield all([takeEvery(Types.FetchAutoCompletes, fetchAutoCompletes)]);
}
