import { put, delay, fork, cancel, select, call } from 'redux-saga/effects';
import lruCache from 'lru-cache';
import { FetchStatus } from '../constant';
import { callApi } from './api';
import { actions } from '../state';
import { FETCH_PAGE, FETCH_KEY } from '../redux-helper';

/**
 * API 요청이 느릴 때 상태를 변경시키는 제너레이터를 생성하는 함수
 * @param {string} actionType 액션 타입
 * @param {string} fetchKey 요청 시간이 오래 걸리는 키
 */
function makeCheckSlowSaga(actionType, fetchKey) {
  return function* () {
    yield delay(500); //? 0.5초 이상 걸릴 때 상태를 변경시킨다.
    console.log('~!@~!@~!@ 아오 느려...................~!@~!@~!@');
    yield put(
      actions.setIsSlow({
        actionType,
        fetchKey,
        isSlow: true,
      }),
    );
  };
}

// api 요청 캐시할 장소 생성
const apiCache = new lruCache({
  max: 500, // 캐시 최대 크기
  maxAge: 1000 * 60 * 2, // 최대 2분 저장
});

const SAGA_CALL_TYPE = call(() => {}).type; // saga call effect 타입

/**
 * CALL 사가 이펙트인지 확인하는 함수
 * @param {object} value 액션 객체
 */
function getIsCallEffect(value) {
  return value && value.type === SAGA_CALL_TYPE;
}

/**
 * 사가 미들웨어와 사가 함수 사이에서 소통하는 사가 함수
 * - 캐싱된 값이 있으면 사가 미들웨어로 보내지 않고 다시 사가 함수로 캐싱된 값을 넘긴다.
 *
 * @param {object} param
 * @param {function} param.fetchSaga api 요청 사가
 * @param {boolean} param.canCache 캐시 유무
 * @param {function=} param.getTotalCount 페이징네이션 할 때 필요
 */
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

    // console.log('action ->', action);
    // console.log('fetchPage ->', fetchPage);
    // console.log('fetchKey ->', fetchKey);
    // console.log('nextPage ->', nextPage);
    // console.log('page ->', page);

    let iter = fetchSaga(action, page); // 요청한 사가 함수를 호출해서 제너레이터를 생성
    let res;
    let checkSlowTask;
    let params;

    console.log('fetchSaga --> ', fetchSaga);
    console.log('iter --> ', iter);

    while (true) {
      const { value, done } = iter.next(res);

      // 사가함수에서 또다른 사가함수를 호출할 때 사용
      if (getIsCallEffect(value) && getIsGeneratorFunction(value.payload.fn)) {
        console.log('..............................................................');
        iterStack.push(iter);
        iter = value.payload.fn(...value.payload.args);
        continue;
      }

      console.log('value -----> ', value);
      console.log('done -----> ', done);

      /**
       ** API 요청 상태 업데이트 (Request 상태로 설정)
       *? call effect면서 call의 매개변수의 함수가 요청 api와 같을 때 호출
       */
      if (getIsCallEffect(value) && value.payload.fn === callApi) {
        yield put(
          actions.setFetchStatus({
            actionType,
            fetchKey,
            status: FetchStatus.Request,
          }),
        );

        //* 캐시 관련
        const apiParam = value.payload.args[0]; // call effect의 두 번째 매개변수
        const cacheKey = getApiCacheKey(actionType, apiParam);
        let apiResult = canCache && apiCache.has(cacheKey) ? apiCache.get(cacheKey) : undefined;
        const isFromCache = !!apiResult;

        console.log('cacheKey ->', cacheKey);

        //* 캐시된 요청이 없으면 api 호출
        if (!isFromCache) {
          if (!apiResult) {
            //* 0.5초 이상 걸릴 경우 느린 요청 상태로 변경하는 논블로킹 이펙트를 생성한다.
            checkSlowTask = yield fork(makeCheckSlowSaga(actionType, fetchKey));
            apiResult = yield value; //! call effect를 사가 미들웨어로 보내고 응답 대기
            //? 응답이 왔으므로 느린 요청 사가를 취소한다.
            if (checkSlowTask) {
              yield cancel(checkSlowTask);
            }
          }
        }

        res = apiResult;
        console.log('res', res);

        //* API 요청이 성공했을 때
        if (apiResult) {
          const isSuccess = apiResult.isSuccess;
          //* api 요청이 성공이고 캐시되지 않았다면 캐싱한다.
          if (isSuccess && canCache && !isFromCache) {
            apiCache.set(cacheKey, apiResult);
          }

          const totalCount = getTotalCount(apiResult);

          console.log('apiResult', apiResult);
          console.log('totalCount', totalCount);

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
        //* 일반 액션 객체일 때
        res = yield value;
      }

      if (done) {
        console.log('********** 이터레이터 반복 끝 *****************');
        const nextIter = iterStack.pop();

        if (nextIter) {
          iter = nextIter;
          continue;
        }

        //* Success or Fail 상태로 변경
        if (params) {
          yield put(actions.setFetchStatus(params));
        }

        break;
      }
    }
  };
}

/**
 * 쿼리 파라미터 순서가 바뀌어도 같은 key가 나오도록 키 이름으로 정렬한다
 *
 * @param {string} actionType 액션 타입
 * @param {object} param
 * @param {string} param.apiHost  baseURL
 * @param {string} param.url 요청 주소
 * @param {object} param.params 쿼리 파라미터
 */
export function getApiCacheKey(actionType, { apiHost, url, params }) {
  const prefix = `${actionType}_${apiHost ? apiHost + url : url}`;
  const keys = params ? Object.keys(params) : [];

  if (keys.length) {
    return prefix + keys.sort().reduce((acc, key) => `${acc}&${key}=${params[key]}`, '');
  } else {
    return prefix;
  }
}

/**
 * 어떤 key값으로 fetch 할 것인지 얻는 함수
 * - 따로 키를 넣지 않으면 액션 타입이 패치 키가 된다.
 * @param {object} action 액션 객체
 */
export function getFetchKey(action) {
  const fetchKey = action[FETCH_KEY];
  console.log('....................fetchkey', action, fetchKey);
  return fetchKey === undefined ? action.type : String(fetchKey);
}

/**
 * 제네레이터 함수인지 체크
 * @param {object} obj dd
 */
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
 * 캐시된 API를 삭제
 * - 액션 타입을 지정하지 않으면 모든 캐시 삭제
 * @param {string=} actionType 액션 타입
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
