import { all, takeEvery, call, put, takeLeading } from 'redux-saga/effects';
import { actions, Types } from './index';
import { callApi } from './../../common/util/api';
import { deleteApiCache, makeFetchSaga } from './../../common/util/fetch';

/**
 * 유저 검색
 * @param {object} param  액션 객체
 * @param {object} param.type 액션 타입
 * @param {string} param.name 유저 이름
 */
function* fetchUser({ name }) {
  const { isSuccess, data } = yield call(callApi, {
    url: '/user/search',
    params: { keyword: name },
  });

  if (isSuccess && data) {
    //? 키워드를 이름으로 사용했는지 검증
    const user = data.find(item => item.name === name);

    if (user) {
      yield put(actions.setValue('user', user));
    }
  }
}

/**
 * 유저 정보 업데이트
 * @param {object} param 액션
 * @param {object} param.user 유저 객체
 * @param {string} param.key 수정 할 키
 * @param {string} param.value 수정 할 값
 */
function* fetchUpdateUser({ user, key, value }) {
  const oldValue = user[key]; // 수정 하기 전 원본 데이터
  yield put(actions.setValue('user', { ...user, [key]: value })); // 상태 업데이트

  // API 요청
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
    // 수정 내역도 업데이트 한다.
    yield put(actions.addHistory(data.history));
  } else {
    yield put(actions.setValue('user', user)); // 원본 데이터로 롤백
  }
}

function* fetchUserHistory({ name }) {
  const { isSuccess, data } = yield call(callApi, {
    url: '/history',
    params: { name },
  });

  if (isSuccess && data) {
    yield put(actions.setValue('userHistory', data));
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
    takeLeading(
      Types.FetchUpdateUser,
      makeFetchSaga({
        fetchSaga: fetchUpdateUser,
        canCache: false,
      }),
    ),
    takeLeading(
      Types.FetchUserHistory,
      makeFetchSaga({
        fetchSaga: fetchUserHistory,
        canCache: false,
      }),
    ),
  ]);
}
