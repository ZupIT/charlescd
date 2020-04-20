import { createReducer } from 'core/helpers/redux'
import { TOASTER_ACTION_TYPES } from './actions'

const initialState = []

const reducer = {
  [TOASTER_ACTION_TYPES.ADD_TOAST](state, { toast, message }) {
    return [
      ...state,
      { toast, message },
    ]
  },
  [TOASTER_ACTION_TYPES.REMOVE_TOAST]() {
    return initialState
  },
}

export default createReducer(initialState, reducer)
