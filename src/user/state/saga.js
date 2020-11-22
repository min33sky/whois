import { all, takeEvery, call, put } from 'redux-saga/effects';
import { actions, Types } from './index';
import { callApi } from './../../common/util/api';

/**
 *
 * @param {object} param
 * @param {object} param.type
 * @param {string} param.name 이름
 */
function* fetchUser({ name }) {
  const { isSuccess, data } = yield call(callApi, {
    url: '/user/search',
    params: { keyword: name },
  });

  if (isSuccess && data) {
    // 키워드가 이름인지 정확히 확인하기 위해
    const user = data.find((item) => item.name === name);

    if (user) {
      yield put(actions.setValue('user', user));
    }
  }
}

export default function* userSaga() {
  yield all([takeEvery(Types.FetchUser, fetchUser)]);
}
