export const USER_ACTION_TYPES = {
  GET_USERS: 'USERS/GET_USERS',
  LOADED_USERS: 'USERS/LOADED_USERS',
  LOADING: 'USERS/LOADING',
}

export const userActions = {
  getUsers: (page, size) => ({ type: USER_ACTION_TYPES.GET_USERS, page, size }),
  toggleLoading: () => ({ type: USER_ACTION_TYPES.LOADING }),
  loadedUsers: list => ({ type: USER_ACTION_TYPES.LOADED_USERS, list }),
}
