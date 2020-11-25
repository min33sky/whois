import { all, takeEvery, call, put } from 'redux-saga/effects';
import { actions, Types } from './index';
import { callApi } from './../../common/util/api';
import { deleteApiCache, makeFetchSaga } from './../../common/util/fetch';

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
    //? 키워드가 이름인지 정확히 확인하기 위해
    const user = data.find((item) => item.name === name);

    if (user) {
      yield put(actions.setValue('user', user));
    }
  }
}

function* fetchUpdateUser({ user, key, value }) {
  const oldValue = user[key];
  yield put(actions.setValue('user', { ...user, [key]: value }));
  const { isSuccess, data } = yield call(callApi, {
    url: '/user/update',
    method: 'post',
    data: {
      name: user.name,
      key,
      value,
      oldValue,
    },
  });

  if (isSuccess && data) {
    // ? 캐싱된 검색어 목록을 삭제한다. (뒤로가기 했을 때 이전 결과가 나타나기 때문에)
    deleteApiCache();
  } else {
    yield put(actions.setValue('user', user));
  }
}

export default function* userSaga() {
  yield all([
    takeEvery(
      Types.FetchUser,
      makeFetchSaga({
        fetchSaga: fetchUser,
        canCache: true,
      }),
    ),
    takeEvery(
      Types.FetchUpdateUser,
      makeFetchSaga({
        fetchSaga: fetchUpdateUser,
        canCache: false,
      }),
    ),
  ]);
}
