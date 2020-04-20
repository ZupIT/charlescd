import { createReducer } from 'core/helpers/redux'
import { MODULE_ACTION_TYPES } from './actions'

const initialState = {
  listLoading: false,
  modules: {
    content: [],
  },
}

const reducer = {
  [MODULE_ACTION_TYPES.LIST_LOADING](state) {
    return {
      ...state,
      listLoading: !state.listLoading,
    }
  },
  [MODULE_ACTION_TYPES.LOAD_MODULES](state, { modules }) {
    return {
      ...state,
      modules,
    }
  },
}

export default createReducer(initialState, reducer)
