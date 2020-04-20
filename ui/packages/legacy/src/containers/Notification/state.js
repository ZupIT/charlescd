export const notificationsInitialState = {
  list: [],
  item: null,
  count: 0,
  notViewed: -1,
}

export const notificationsTypes = {
  notifications: 'LOADED/NOTIFICATIONS',
  addNewNotification: 'ADD_NEW/NOTIFICATIONS',
  count: 'LOADED_COUNT/NOTIFICATIONS',
  reset: 'RESET_NOTIFICATIONS',
}

export const notificationsActions = {
  notifications: list => ({ type: notificationsTypes.notifications, list }),
  addNewNotification: notification => ({
    type: notificationsTypes.addNewNotification, notification,
  }),
  count: count => ({ type: notificationsTypes.count, count }),
}

export const notificationsReducer = (state = notificationsInitialState, action) => {
  switch (action?.type) {
    case notificationsTypes.notifications:
      return {
        ...state,
        list: action.list,
      }
    case notificationsTypes.addNewNotification: {
      return {
        ...state,
        list: [action.notification, ...state.list],
      }
    }
    case notificationsTypes.count: {
      return {
        ...state,
        count: action.count,
      }
    }
    default:
      return state
  }
}
