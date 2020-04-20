import { createReducer } from 'core/helpers/redux'
import { NOTIFICATION_ACTION_TYPES } from './actions'

const initialState = {
  notifications: [],
  connected: false,
  pollingRunning: false,
  loading: false,
}

const reducer = {
  [NOTIFICATION_ACTION_TYPES.LOADING](state) {
    return {
      ...state,
      loading: !state.loading,
    }
  },
  [NOTIFICATION_ACTION_TYPES.LOADED_NOTIFICATIONS](state, { notifications }) {
    return {
      ...state,
      notifications,
    }
  },
  [NOTIFICATION_ACTION_TYPES.LOADED_NOTIFICATION](state, { notification }) {
    return {
      ...state,
      notifications: [...state.notifications, notification],
    }
  },
  [NOTIFICATION_ACTION_TYPES.SET_CONNECTED](state, { status }) {
    return {
      ...state,
      connected: status,
    }
  },
  [NOTIFICATION_ACTION_TYPES.START_POLLING](state) {
    return {
      ...state,
      pollingRunning: true,
    }
  },
}

export default createReducer(initialState, reducer)
