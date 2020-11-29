import { createSetValueAction } from '../../common/redux-helper';
import { createReducer, setValueReducer, FETCH_KEY } from './../../common/redux-helper';

export const Types = {
  SetValue: 'user/SetValue',
  FetchUser: 'user/FetchUser',
  FetchUpdateUser: 'user/FetchUpdateUser',
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
};

const INITIAL_STATE = {
  user: undefined,
};

const reducer = createReducer(INITIAL_STATE, {
  [Types.SetValue]: setValueReducer,
});

export default reducer;
