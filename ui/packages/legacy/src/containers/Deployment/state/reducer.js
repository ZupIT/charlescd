import { createReducer } from 'core/helpers/redux'
import { DEPLOY_ACTION_TYPES } from './actions'

const initialState = {
  loading: false,
  loadingList: false,
  builds: [],
  list: [],
}

const reducer = {
  [DEPLOY_ACTION_TYPES.LOADED_DEPLOYMENTS](state, { list }) {
    return {
      ...state,
      list,
    }
  },
  [DEPLOY_ACTION_TYPES.LOADING](state) {
    return {
      ...state,
      loading: !state.loading,
    }
  },
  [DEPLOY_ACTION_TYPES.LOADED_CHARTS](state, { charts }) {
    return {
      ...state,
      charts,
    }
  },

  [DEPLOY_ACTION_TYPES.LOADING_LIST](state) {
    return {
      ...state,
      loadingList: !state.loadingList,
    }
  },
  [DEPLOY_ACTION_TYPES.LOADED_VALIDATED_BUILDS](state, { builds }) {
    return {
      ...state,
      builds,
    }
  },
}

export default createReducer(initialState, reducer)
