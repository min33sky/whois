import { takeLeading, call, all, put } from 'redux-saga/effects';
import { actions, Types } from './index';
import { makeFetchSaga } from './../../common/util/fetch';
import { callApi } from './../../common/util/api';

function* fetchLogin({ name, password }) {
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
}

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

export function* fetchUser() {
  const { isSuccess, data } = yield call(callApi, {
    url: '/auth/user',
    method: 'get',
  });

  if (isSuccess && data) {
    yield put(actions.setUser(data.name));
  }
}

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
