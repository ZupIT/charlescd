export const groupsInitialState = {
  loading: {
    list: false,
    config: false,
  },
  list: [],
  item: null,
  roles: null,
}

export const groupsTypes = {
  toggleListLoading: 'TOGGLE_LOADING',
  roles: 'LOADED/ROLES',
  groups: 'LOADED/GROUPS',
  module: 'LOADED/GROUP',
  reset: 'RESET',
}

export const groupsActions = {
  toggleListLoading: () => ({ type: groupsTypes.toggleListLoading }),
  roles: roles => ({ type: groupsTypes.roles, roles }),
  groups: list => ({ type: groupsTypes.groups, list }),
  group: item => ({ type: groupsTypes.group, item }),
  reset: field => ({ type: groupsTypes.reset, field }),
}

export const groupsReducer = (state = groupsInitialState, action) => {
  switch (action?.type) {
    case groupsTypes.toggleListLoading:
      return {
        ...state,
        loading: {
          ...state.loading,
          list: !state.loading,
        },
      }
    case groupsTypes.roles:
      return {
        ...state,
        roles: action.roles,
      }
    case groupsTypes.groups:
      return {
        ...state,
        list: action.list,
      }
    case groupsTypes.group:
      return {
        ...state,
        item: action.item,
      }
    case groupsTypes.reset:
      return {
        ...state,
        [action.field]: groupsInitialState[action.field],
      }
    default:
      return state
  }
}
