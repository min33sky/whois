import { createSetValueAction, NOT_IMMUTABLE } from '../../common/redux-helper';
import { createReducer, setValueReducer, FETCH_KEY } from './../../common/redux-helper';

export const Types = {
  SetValue: 'user/SetValue',
  FetchUser: 'user/FetchUser',
  FetchUpdateUser: 'user/FetchUpdateUser',
  FetchUserHistory: 'user/FetchUserHistory',
  AddHistory: 'user/AddHistory',
  Initialize: 'user/Initialize',
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),

  /**
   * 유저 정보를 가져오기
   */
  fetchUser: name => ({
    type: Types.FetchUser,
    name,
  }),

  /**
   * 유저 정보 업데이트 액션 함수
   */
  fetchUpdateUser: ({ user, key, value, fetchKey }) => ({
    type: Types.FetchUpdateUser,
    user,
    key,
    value,
    [FETCH_KEY]: fetchKey,
  }),

  /**
   * 유저 수정 내역 가져오는 액션 함수
   */
  fetchUserHistory: name => ({ type: Types.FetchUserHistory, name }),

  /**
   * 수정 내역 추가 액션 함수
   */
  addHistory: history => ({ type: Types.AddHistory, history }),

  initilize: () => ({
    type: Types.Initialize,
    [NOT_IMMUTABLE]: true,
  }),
};

const INITIAL_STATE = {
  user: undefined,
  userHistory: [],
};

const reducer = createReducer(INITIAL_STATE, {
  [Types.SetValue]: setValueReducer,
  [Types.AddHistory]: (state, action) =>
    (state.userHistory = [action.history, ...state.userHistory]),
  // 초기화
  [Types.Initialize]: () => INITIAL_STATE,
});

export default reducer;
