import { createReducer } from 'core/helpers/redux'
import { PROBLEM_ACTION_TYPES } from './actions'

const initialState = {
  loading: false,
  problem: null,
  list: [],
}

const reducer = {
  [PROBLEM_ACTION_TYPES.LOADING](state) {
    return {
      ...state,
      loading: !state.loading,
    }
  },
  [PROBLEM_ACTION_TYPES.LOADED_PROBLEM](state, { problem }) {
    return {
      ...state,
      problem,
    }
  },
  [PROBLEM_ACTION_TYPES.LOADED_PROBLEMS](state, { list }) {
    return {
      ...state,
      list,
    }
  },
  [PROBLEM_ACTION_TYPES.RESET]() {
    return initialState
  },
}

export default createReducer(initialState, reducer)
