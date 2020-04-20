export const CIRCLE_ACTION_TYPES = {
  GET_CIRCLES: 'CIRCLES/GET_CIRCLES',
  GET_CIRCLE: 'CIRCLES/GET_CIRCLE',
  LOADED_ACTIVES_CIRCLES: 'CIRCLES/LOADED_ACTIVES_CIRCLES',
  LOADED_INACTIVES_CIRCLES: 'CIRCLES/LOADED_INACTIVES_CIRCLES',
  LOADED_CIRCLE: 'CIRCLES/LOADED_CIRCLE',
  LOADING: 'CIRCLES/LOADING',
  LOADING_CIRCLE: 'CIRCLES/LOADING_CIRCLE',
  SAVE_CIRCLE: 'CIRCLES/SAVE_CIRCLES',
  UPDATE_CIRCLE: 'CIRCLES/UPDATE_CIRCLE',
  DELETE_PROFILE: 'CIRCLES/DELETE_PROFILE',
  SET_TAB: 'CIRCLES/SET_TAB',
  RESET: 'CIRCLES/RESET',
}

export const circleActions = {
  getCircles: (active, circleFilter) => (
    { type: CIRCLE_ACTION_TYPES.GET_CIRCLES, active, circleFilter }
  ),
  getCircleById: circleId => ({ type: CIRCLE_ACTION_TYPES.GET_CIRCLE, circleId }),
  toggleLoading: toggle => ({ type: CIRCLE_ACTION_TYPES.LOADING, toggle }),
  loadingCircle: () => ({ type: CIRCLE_ACTION_TYPES.LOADING_CIRCLE }),
  loadedActivesCircles: list => ({ type: CIRCLE_ACTION_TYPES.LOADED_ACTIVES_CIRCLES, list }),
  loadedInactivesCircles: list => ({ type: CIRCLE_ACTION_TYPES.LOADED_INACTIVES_CIRCLES, list }),
  loadedCircle: circle => ({ type: CIRCLE_ACTION_TYPES.LOADED_CIRCLE, circle }),
  saveCircle: circle => ({ type: CIRCLE_ACTION_TYPES.SAVE_CIRCLE, circle }),
  updateCircle: (circleId, circle) => ({
    type: CIRCLE_ACTION_TYPES.UPDATE_CIRCLE, circleId, circle,
  }),
  setTab: tab => ({ type: CIRCLE_ACTION_TYPES.SET_TAB, tab }),
  reset: () => ({ type: CIRCLE_ACTION_TYPES.RESET }),
}
