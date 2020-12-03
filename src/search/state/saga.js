import { all, call, put, takeEvery, takeLeading, select } from 'redux-saga/effects';
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

/**
 * 모든 수정 내역 가져오기
 * @param {object} _ 액션 객체
 * @param {number} page 페이지 번호
 */
function* fetchAllHistory(_, page) {
  const { isSuccess, data } = yield call(callApi, {
    url: '/history',
    params: { page },
  });

  const userHistory = yield select(state => state.search.userHistory);

  if (isSuccess && data) {
    yield put(actions.setValue('userHistory', [...userHistory, ...data]));
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
