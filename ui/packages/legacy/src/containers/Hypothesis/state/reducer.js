import { createReducer } from 'core/helpers/redux'
import { HYPOTHESIS_ACTION_TYPES } from './actions'

const initialState = {
  loading: false,
}

const reducer = {
  [HYPOTHESIS_ACTION_TYPES.LOADING](state) {
    return {
      ...state,
      loading: !state.loading,
    }
  },
  [HYPOTHESIS_ACTION_TYPES.LOAD_HYPOTHESIS](state, { hypothesis }) {
    return {
      ...state,
      hypothesis,
    }
  },
  [HYPOTHESIS_ACTION_TYPES.RESET]() {
    return initialState
  },
}

export default createReducer(initialState, reducer)
