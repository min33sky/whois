import { put, delay, fork, cancel, select, call } from 'redux-saga/effects';
import lruCache from 'lru-cache';
import { FetchStatus } from '../constant';
import { callApi } from './api';
import { actions } from '../state';
import { FETCH_PAGE, FETCH_KEY } from '../redux-helper';

function makeCheckSlowSaga(actionType, fetchKey) {
  return function* () {
    yield delay(500);
    yield put(
      actions.setIsSlow({
        actionType,
        fetchKey,
        isSlow: true,
      }),
    );
  };
}

const apiCache = new lruCache({
  max: 500, // 캐시 최대 크기
  maxAge: 1000 * 60 * 2, // 최대 2분 저장
});

const SAGA_CALL_TYPE = call(() => {}).type;

function getIsCallEffect(value) {
  return value && value.type === SAGA_CALL_TYPE;
}

export function makeFetchSaga({ fetchSaga, canCache, getTotalCount = (res) => res?.totalCount }) {
  return function* (action) {
    const { type: actionType } = action;
    const fetchPage = action[FETCH_PAGE];
    const fetchKey = getFetchKey(action);
    const nextPage = yield select(
      (state) => state.common.fetchInfo.nextPageMap[actionType]?.[fetchKey] || 0,
    );

    const page = fetchPage !== undefined ? fetchPage : nextPage;
    const iterStack = [];

    let iter = fetchSaga(action, page); // 사가 함수를 호출해서 제너레이터를 생성
    let res;
    let checkSlowTask;
    let params;

    while (true) {
      const { value, done } = iter.next(res);

      // 사가함수에서 또다른 사가함수를 호출할 때 사용
      if (getIsCallEffect(value) && getIsGeneratorFunction(value.payload.fn)) {
        iterStack.push(iter);
        iter = value.payload.fn(...value.payload.args);
        continue;
      }

      if (getIsCallEffect(value) && value.payload.fn === callApi) {
        yield put(
          actions.setFetchStatus({
            actionType,
            fetchKey,
            status: FetchStatus.Request,
          }),
        );

        // 캐시 관련
        const apiParam = value.payload.args[0];
        const cacheKey = getApiCacheKey(actionType, apiParam);
        let apiResult = canCache && apiCache.has(cacheKey) ? apiCache.get(cacheKey) : undefined;
        const isFromCache = !!apiResult;

        // 캐시된게 없으면 api 호출
        if (!isFromCache) {
          if (!apiResult) {
            checkSlowTask = yield fork(makeCheckSlowSaga(actionType, fetchKey));
            apiResult = yield value;
            if (checkSlowTask) {
              yield cancel(checkSlowTask);
            }
          }
        }

        res = apiResult;

        if (apiResult) {
          const isSuccess = apiResult.isSuccess;
          // api 요청이 성공이고 캐시되지 않았다면 캐싱한다.
          if (isSuccess && canCache && !isFromCache) {
            apiCache.set(cacheKey, apiResult);
          }

          const totalCount = getTotalCount(apiResult);

          params = {
            actionType,
            fetchKey,
            status: isSuccess ? FetchStatus.Success : FetchStatus.Fail,
            totalCount,
            nextPage: isSuccess ? page + 1 : page,
            errorMessage: isSuccess ? '' : apiResult.resultMessage,
          };
        }
      } else if (value !== undefined) {
        res = yield value;
      }

      if (done) {
        const nextIter = iterStack.pop();

        if (nextIter) {
          iter = nextIter;
          continue;
        }

        // Success or Fail 상태로 변경
        if (params) {
          yield put(actions.setFetchStatus(params));
        }

        break;
      }
    }
  };
}

// 쿼리 파라미터 순서가 바뀌어도 같은 key가 나오도록 키 이름으로 정렬한다
export function getApiCacheKey(actionType, { apiHost, url, params }) {
  const prefix = `${actionType}_${apiHost ? apiHost + url : url}`;
  const keys = params ? Object.keys(params) : [];
  if (keys.length) {
    return prefix + keys.sort().reduce((acc, key) => `${acc}&${key}=${params[key]}`, '');
  } else {
    return prefix;
  }
}

export function getFetchKey(action) {
  const fetchKey = action[FETCH_KEY];
  return fetchKey === undefined ? action.type : String(fetchKey);
}

function getIsGeneratorFunction(obj) {
  const constructor = obj.constructor;
  if (!constructor) {
    return false;
  }
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) {
    return true;
  }
  const proto = constructor.prototype;
  return 'function' === typeof proto.next && 'function' === typeof proto.throw;
}

/**
 *
 * @param {string=} actionType
 */
export function deleteApiCache(actionType) {
  let keys = apiCache.keys();
  if (actionType) {
    keys = keys.filter((key) => key.includes(actionType));
  }
  for (const key of keys) {
    apiCache.del(key);
  }
}
