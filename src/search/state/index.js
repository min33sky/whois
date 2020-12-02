import { createSetValueAction, FETCH_PAGE } from '../../common/redux-helper';
import { createReducer, setValueReducer } from './../../common/redux-helper';

export const Types = {
  SetValue: 'search/SetValue',
  FetchAutoCompletes: 'search/FetchAutoCompletes',
  FetchAllHistory: 'search/FetchAllHistory',
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchAutoCompletes: keyword => ({
    type: Types.FetchAutoCompletes,
    keyword,
  }),

  fetchAllHistory: (page = 0) => ({
    type: Types.FetchAllHistory,
    [FETCH_PAGE]: page,
  }),
};

const INITIAL_STATE = {
  keyword: '',
  autoCompletes: [],
  userHistory: [],
};

const reducer = createReducer(INITIAL_STATE, {
  [Types.SetValue]: setValueReducer,
});

export default reducer;
