export const usersInitialState = {
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
  groups: null,
}

export const usersTypes = {
  toggleListLoading: 'TOGGLE_LOADING',
  roles: 'LOADED/ROLES',
  users: 'LOADED/USERS',
  user: 'LOADED/USER',
  groups: 'LOADER/USER_GROUPS',
  reset: 'RESET',
}

export const usersActions = {
  toggleListLoading: () => ({ type: usersTypes.toggleListLoading }),
  users: list => ({ type: usersTypes.users, list }),
  user: item => ({ type: usersTypes.user, item }),
  groups: groups => ({ type: usersTypes.groups, groups }),
  reset: field => ({ type: usersTypes.reset, field }),
}

export const usersReducer = (state = usersInitialState, action) => {
  switch (action?.type) {
    case usersTypes.toggleListLoading:
      return {
        ...state,
        loading: {
          ...state.loading,
          list: !state.loading,
        },
      }
    case usersTypes.roles:
      return {
        ...state,
        roles: action.roles,
      }
    case usersTypes.users:
      return {
        ...state,
        list: action.list,
      }
    case usersTypes.user:
      return {
        ...state,
        item: action.item,
      }
    case usersTypes.groups:
      return {
        ...state,
        groups: action.groups,
      }
    case usersTypes.reset:
      return {
        ...state,
        [action.field]: usersInitialState[action.field],
      }
    default:
      return state
  }
}
