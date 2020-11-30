import { all, call, put, takeEvery, takeLeading, cancel } from 'redux-saga/effects';
import { actions, Types } from './index';
import { callApi } from './../../common/util/api';
import { makeFetchSaga } from './../../common/util/fetch';

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

function* fetchAllHistory() {
  const { isSuccess, data } = yield call(callApi, {
    url: '/history',
  });

  if (isSuccess && data) {
    yield put(actions.setValue('userHistory', data));
  }
}

export default function* searchSaga() {
  yield all([
    takeEvery(
      Types.FetchAutoCompletes,
      makeFetchSaga({ fetchSaga: fetchAutoCompletes, canCache: true }),
    ),

    takeLeading(
      Types.FetchAllHistory,
      makeFetchSaga({
        fetchSaga: fetchAllHistory,
        canCache: false,
      }),
    ),
  ]);
}
