import { takeLeading, call, all, put } from 'redux-saga/effects';
import { actions, Types } from './index';
import { makeFetchSaga } from './../../common/util/fetch';
import { callApi } from './../../common/util/api';

/**
 * 로그인 요청
 * @param {object} param
 * @param {string} param.name 유저 이름
 * @param {string} param.password 패스워드
 */
function* fetchLogin({ name, password }) {
  try {
    const { isSuccess, data } = yield call(callApi, {
      url: '/auth/login',
      method: 'post',
      data: {
        name,
        password,
      },
    });

    if (isSuccess && data) {
      yield put(actions.setUser(data.name));
    }
  } catch (error) {
    console.log('에러발생');
    console.error('error', error);
  }
}

/**
 * 회원 가입 요청
 * @param {object} param
 * @param {string} param.email 이메일 주소
 */
function* fetchSignup({ email }) {
  const { isSuccess, data } = yield call(callApi, {
    url: '/auth/signup',
    method: 'post',
    data: {
      email,
    },
  });

  if (isSuccess && data) {
    yield put(actions.setUser(data.name));
  }
}

/**
 * 유저 정보 가져오기
 */
export function* fetchUser() {
  const { isSuccess, data } = yield call(callApi, {
    url: '/auth/user',
    method: 'get',
  });

  if (isSuccess && data) {
    yield put(actions.setUser(data.name));
  }
}

/**
 * 로그아웃 요청
 */
export function* fetchLogout() {
  const { isSuccess } = yield call(callApi, {
    url: '/auth/logout',
    method: 'get',
  });

  if (isSuccess) {
    yield put(actions.setUser(''));
  }
}

export default function* authSaga() {
  yield all([
    takeLeading(
      Types.FetchLogin,
      makeFetchSaga({
        fetchSaga: fetchLogin,
        canCache: false,
      }),
    ),

    takeLeading(
      Types.FetchSignup,
      makeFetchSaga({
        fetchSaga: fetchSignup,
        canCache: false,
      }),
    ),

    takeLeading(
      Types.FetchUser,
      makeFetchSaga({
        fetchSaga: fetchUser,
        canCache: false,
      }),
    ),

    takeLeading(
      Types.FetchLogout,
      makeFetchSaga({
        fetchSaga: fetchLogout,
        canCache: false,
      }),
    ),
  ]);
}
