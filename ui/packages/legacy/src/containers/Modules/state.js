export const modulesInitialState = {
  loading: {
    list: false,
    config: false,
  },
  list: {
    page: 0,
    content: [],
    last: false,
  },
  item: null,
  config: null,
}

export const modulesTypes = {
  toggleListLoading: 'TOGGLE_LOADING',
  config: 'LOADED/CONFIGS',
  modules: 'LOADED/MODULES',
  module: 'LOADED/MODULE',
  reset: 'RESET',
}

export const modulesActions = {
  toggleListLoading: () => ({ type: modulesTypes.toggleListLoading }),
  config: config => ({ type: modulesTypes.config, config }),
  modules: list => ({ type: modulesTypes.modules, list }),
  module: item => ({ type: modulesTypes.module, item }),
  reset: field => ({ type: modulesTypes.reset, field }),
}

export const modulesReducer = (state = modulesInitialState, action) => {
  switch (action?.type) {
    case modulesTypes.toggleListLoading:
      return {
        ...state,
        loading: {
          ...state.loading,
          list: !state.loading,
        },
      }
    case modulesTypes.config:
      return {
        ...state,
        config: action.config,
      }
    case modulesTypes.modules:
      return {
        ...state,
        list: action.list,
      }
    case modulesTypes.module:
      return {
        ...state,
        item: action.item,
      }
    case modulesTypes.reset:
      return {
        ...state,
        [action.field]: modulesInitialState[action.field],
      }
    default:
      return state
  }
}
