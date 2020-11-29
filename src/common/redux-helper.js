import produce from 'immer';

/**
 * 리듀서를 생성하는 함수
 * @param {object} initialState 초기 상태
 * @param {object} handlerMap 리듀서 함수들이 있는 객체
 */
export function createReducer(initialState, handlerMap) {
  return function (state = initialState, action) {
    const handler = handlerMap[action.type];
    if (handler) {
      return produce(state, draft => {
        handler(draft, action);
      });
    } else {
      return state;
    }
  };
}

/**
 * 해당 액션 타입으로 상태를 변경할 수 있는 액션 암수를 리턴하는 함수
 * @param {string} type 액션 타입
 */
export function createSetValueAction(type) {
  return (key, value) => ({ type, key, value });
}

/**
 * 단순히 키 값의 상태를 변경시키는 리듀서 함수
 * @param {object} state 상태
 * @param {object} action 액션
 */
export function setValueReducer(state, action) {
  state[action.key] = action.value;
}

// ? 키값의 중복을 피하기 위해 심볼을 사용
export const FETCH_PAGE = Symbol('FETCH_PAGE');
export const FETCH_KEY = Symbol('FETCH_KEY');
