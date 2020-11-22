import { createSetValueAction } from '../../common/redux-helper';
import { createReducer, setValueReducer } from './../../common/redux-helper';

export const Types = {
  SetValue: 'user/SetValue',
  FetchUser: 'user/FetchUser',
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchUser: (name) => ({
    type: Types.FetchUser,
    name,
  }),
};

const INITIAL_STATE = {
  user: undefined,
};

const reducer = createReducer(INITIAL_STATE, {
  [Types.SetValue]: setValueReducer,
});

export default reducer;
