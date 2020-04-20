import { createReducer } from 'core/helpers/redux'
import { CIRCLE_ACTION_TYPES } from './actions'

const initialState = {
  loading: false,
  loadingCircle: false,
  currentTab: 'ACTIVE',
  list: {
    page: -1,
    actives: [],
    inactives: [],
    last: false,
  },
  circle: {},
}

const reducer = {
  [CIRCLE_ACTION_TYPES.LOADING](state, { toggle }) {
    return {
      ...state,
      loading: toggle,
    }
  },
  [CIRCLE_ACTION_TYPES.LOADING_CIRCLE](state) {
    return {
      ...state,
      loadingCircle: !state.loadingCircle,
    }
  },
  [CIRCLE_ACTION_TYPES.LOADED_ACTIVES_CIRCLES](state, { list }) {
    const circleIds = new Set(state?.list?.actives.map(content => content.id))

    return {
      ...state,
      list: {
        ...list,
        actives: [
          ...state?.list?.actives,
          ...list?.content?.filter(content => !circleIds?.has(content.id)),
        ],
      },
    }
  },
  [CIRCLE_ACTION_TYPES.LOADED_INACTIVES_CIRCLES](state, { list }) {
    const circleIds = new Set(state?.list?.inactives.map(content => content.id))

    return {
      ...state,
      list: {
        ...list,
        inactives: [
          ...state?.list?.inactives,
          ...list?.content?.filter(content => !circleIds?.has(content.id)),
        ],
      },
    }
  },
  [CIRCLE_ACTION_TYPES.LOADED_CIRCLE](state, { circle }) {
    return {
      ...state,
      circle,
    }
  },
  [CIRCLE_ACTION_TYPES.SET_TAB](state, { tab }) {
    return {
      ...state,
      currentTab: tab,
    }
  },
  [CIRCLE_ACTION_TYPES.RESET]({ currentTab }) {
    return {
      ...initialState,
      currentTab,
    }
  },
}

export default createReducer(initialState, reducer)
