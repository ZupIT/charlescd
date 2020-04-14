export const HYPOTHESIS_ACTION_TYPES = {
  LOADING: 'HYPOTHESIS/LOADING',
  CREATE: 'HYPOTHESIS/CREATE',
  GET_HYPOTHESIS_BY_ID: 'HYPOTHESIS/GET_HYPOTHESIS_BY_ID',
  LOAD_HYPOTHESIS: 'HYPOTHESIS/LOAD_HYPOTHESIS',
  UPDATE_HYPOTHESIS: 'HYPOTHESIS/UPDATE',
  ADD_CIRCLES: 'HYPOTHESIS/ADD_CIRCLES',
  RESET: 'HYPOTHESIS/RESET',
}

export const hypothesisActions = {
  createHypothesis: data => ({ type: HYPOTHESIS_ACTION_TYPES.CREATE, data }),
  getHypothesisById: hypothesisId => ({
    type: HYPOTHESIS_ACTION_TYPES.GET_HYPOTHESIS_BY_ID, hypothesisId,
  }),
  updateHypothesis: (refs, data) => ({
    type: HYPOTHESIS_ACTION_TYPES.UPDATE_HYPOTHESIS, refs, data,
  }),
  addCircles: (hypothesisId, data) => ({
    type: HYPOTHESIS_ACTION_TYPES.ADD_CIRCLES, hypothesisId, data,
  }),
  loadHypothesis: hypothesis => ({ type: HYPOTHESIS_ACTION_TYPES.LOAD_HYPOTHESIS, hypothesis }),
  toggleLoading: () => ({ type: HYPOTHESIS_ACTION_TYPES.LOADING }),
  reset: () => ({ type: HYPOTHESIS_ACTION_TYPES.RESET }),
}
