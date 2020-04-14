import { createReducer } from 'core/helpers/redux'
import { USER_ACTION_TYPES } from './actions'

const initialState = {
  loading: false,
  list: [],
}

const reducer = {
  [USER_ACTION_TYPES.LOADING](state) {
    return {
      ...state,
      loading: !state.loading,
    }
  },
  [USER_ACTION_TYPES.LOADED_USERS](state, { list }) {
    return {
      ...state,
      list,
    }
  },
}

export default createReducer(initialState, reducer)
