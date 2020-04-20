export const PROBLEM_ACTION_TYPES = {
  LOADING: 'PROBLEM/LOADING',
  SAVE_PROBLEM: 'PROBLEM/SAVE',
  UPDATE_PROBLEM: 'PROBLEM/UPDATE',
  GET_PROBLEMS: 'PROBLEM/GET_ALL',
  GET_PROBLEM_BY_ID: 'PROBLEM/GET_PROBLEM_BY_ID',
  LOADED_PROBLEM: 'PROBLEM/LOADED_PROBLEM',
  LOADED_PROBLEMS: 'PROBLEM/LOADED_PROBLEMS',
  RESET: 'PROBLEM/RESET',
}

export const problemActions = {
  getProblems: () => ({ type: PROBLEM_ACTION_TYPES.GET_PROBLEMS }),
  getProblemById: problemId => ({ type: PROBLEM_ACTION_TYPES.GET_PROBLEM_BY_ID, problemId }),
  saveProblem: data => ({ type: PROBLEM_ACTION_TYPES.SAVE_PROBLEM, data }),
  updateProblem: (problemId, data) => ({
    type: PROBLEM_ACTION_TYPES.UPDATE_PROBLEM, problemId, data,
  }),
  loadedProblem: problem => ({ type: PROBLEM_ACTION_TYPES.LOADED_PROBLEM, problem }),
  loadedProblems: list => ({ type: PROBLEM_ACTION_TYPES.LOADED_PROBLEMS, list }),
  toggleLoading: () => ({ type: PROBLEM_ACTION_TYPES.LOADING }),
  reset: () => ({ type: PROBLEM_ACTION_TYPES.RESET }),
}
