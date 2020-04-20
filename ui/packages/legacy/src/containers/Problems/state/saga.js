import { takeEvery, call, put, all } from 'redux-saga/effects'
import { goBack } from 'react-router-redux'
import ProblemApi from 'core/api/problems'
import { toasterActions } from 'containers/Toaster/state/actions'
import { PROBLEM_ACTION_TYPES, problemActions } from './actions'

export function* saveProblem({ data }) {
  try {
    yield put(problemActions.toggleLoading())
    yield call(ProblemApi.create, data)
    yield put(goBack())
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(problemActions.toggleLoading())
  }
}

export function* getProblems() {
  try {
    yield put(problemActions.toggleLoading())
    const problems = yield call(ProblemApi.findAll)
    const [problem] = problems.content
    yield put(problemActions.loadedProblem(problem))
    yield put(problemActions.loadedProblems(problems))
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(problemActions.toggleLoading())
  }
}

export function* getProblemById({ problemId }) {
  try {
    yield put(problemActions.toggleLoading())
    const problem = yield call(ProblemApi.findById, problemId)
    yield put(problemActions.loadedProblem(problem))

  } catch (err) {
    throw new Error(err)
  } finally {
    yield put(problemActions.toggleLoading())
  }
}

export function* updateProblem({ problemId, data }) {
  try {
    yield put(problemActions.toggleLoading())
    const problem = yield call(ProblemApi.update, problemId, data)
    yield put(problemActions.loadedProblem(problem))
    yield put(goBack())

  } catch (err) {
    throw new Error(err)
  } finally {
    yield put(problemActions.toggleLoading())
  }
}

export default function* root() {
  yield all([
    takeEvery(PROBLEM_ACTION_TYPES.SAVE_PROBLEM, saveProblem),
    takeEvery(PROBLEM_ACTION_TYPES.GET_PROBLEMS, getProblems),
    takeEvery(PROBLEM_ACTION_TYPES.GET_PROBLEM_BY_ID, getProblemById),
    takeEvery(PROBLEM_ACTION_TYPES.UPDATE_PROBLEM, updateProblem),
  ])
}
