import { createReducer, createSetValueAction, setValueReducer } from '../../common/redux-helper';
import { FetchStatus } from '../constant';

export const Types = {
  SetValue: 'common/SetValue',
  SetIsSlow: 'common/SetIsSlow',
  SetFetchStatus: 'common/SetFetchStatus',
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  setIsSlow: (payload) => ({ type: Types.SetIsSlow, payload }),
  setFetchStatus: (payload) => ({ type: Types.SetFetchStatus, payload }),
};

const INITIAL_STATE = {
  fetchInfo: {
    fetchStatusMap: {}, // API 요청 상태
    isSlowMap: {},
    totalCountMap: {},
    errorMessageMap: {},
    nextPageMap: {},
  },
};
const reducer = createReducer(INITIAL_STATE, {
  [Types.SetValue]: setValueReducer,

  [Types.SetFetchStatus]: (state, action) => {
    const { actionType, fetchKey, status, totalCount, nextPage, errorMessage } = action.payload;
    if (!state.fetchInfo.fetchStatusMap[actionType]) {
      state.fetchInfo.fetchStatusMap[actionType] = {};
    }
    state.fetchInfo.fetchStatusMap[actionType][fetchKey] = status;

    //* Success or Fail일때 Fetch 관련 상태 변경
    if (status !== FetchStatus.Request) {
      if (state.fetchInfo.isSlowMap[actionType]) {
        state.fetchInfo.isSlowMap[actionType][fetchKey] = false;
      }

      if (totalCount !== undefined) {
        if (!state.fetchInfo.totalCountMap[actionType]) {
          state.fetchInfo.totalCountMap[actionType] = {};
        }
        state.fetchInfo.totalCountMap[actionType][fetchKey] = totalCount;
      }

      if (nextPage !== undefined) {
        if (!state.fetchInfo.nextPageMap[actionType]) {
          state.fetchInfo.nextPageMap[actionType] = {};
        }
        state.fetchInfo.nextPageMap[actionType][fetchKey] = nextPage;
      }

      if (!state.fetchInfo.errorMessageMap[actionType]) {
        state.fetchInfo.errorMessageMap[actionType] = {};
      }

      if (errorMessage) {
        state.fetchInfo.errorMessageMap[actionType][fetchKey] = errorMessage;
      }
    }
  },

  [Types.SetIsSlow]: (state, action) => {
    const { actionType, fetchKey, isSlow } = action.payload;
    if (!state.fetchInfo.isSlowMap[actionType]) {
      state.fetchInfo.isSlowMap[actionType] = {};
    }
    state.fetchInfo.isSlowMap[actionType][fetchKey] = isSlow;
  },
});
export default reducer;
