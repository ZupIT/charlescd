import { takeEvery, all, put, call } from 'redux-saga/effects'
import HypothesesApi from 'core/api/hypotheses'
import { deploymentActions } from 'containers/Deployment/state/actions'
import { replace } from 'react-router-redux'
import { getPath } from 'core/helpers/routes'
import { history } from 'core/routing/createRouter'
import { toasterActions } from 'containers/Toaster/state/actions'
import { DASHBOARD_HYPOTHESES_DETAIL } from 'core/constants/routes'
import { HYPOTHESIS_ACTION_TYPES, hypothesisActions } from './actions'

function moovePath(hypothesisId) {
  return getPath(DASHBOARD_HYPOTHESES_DETAIL, [hypothesisId])
}

export function* createHypothesis({ data }) {
  try {
    yield put(hypothesisActions.toggleLoading())
    const hypothesis = yield call(HypothesesApi.createHypothesis, data)
    yield put(hypothesisActions.loadHypothesis(hypothesis))
    history.push(moovePath(hypothesis.id))
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(hypothesisActions.toggleLoading())
  }
}

export function* getHypothesisById({ hypothesisId }) {
  try {
    yield put(hypothesisActions.toggleLoading())
    const hypothesis = yield call(HypothesesApi.getHypothesisById, hypothesisId)
    yield put(hypothesisActions.loadHypothesis(hypothesis))

  } catch (err) {
    yield put(toasterActions.toastFailed(err.message))

  } finally {
    yield put(hypothesisActions.toggleLoading())
  }
}

export function* updateHypothesis({ refs, data }) {
  try {
    const { valueFlowId, problemId, hypothesisId } = refs

    yield put(hypothesisActions.toggleLoading())
    yield call(HypothesesApi.update, hypothesisId, data)
    yield put(replace(moovePath({ valueFlowId, problemId }, hypothesisId)))

  } catch (err) {
    yield put(toasterActions.toastFailed(err.message))

  } finally {
    yield put(hypothesisActions.toggleLoading())
  }
}

export function* addCircles({ hypothesisId, data }) {
  try {
    yield put(deploymentActions.toggleLoadingList())
    const hypothesis = yield call(HypothesesApi.addCircles, hypothesisId, data)
    yield put(hypothesisActions.loadHypothesis(hypothesis))
    yield put(deploymentActions.getDeploymentsByHypothesisId(hypothesisId))
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(deploymentActions.toggleLoadingList())
  }
}

export default function* root() {
  yield all([
    takeEvery(HYPOTHESIS_ACTION_TYPES.CREATE, createHypothesis),
    takeEvery(HYPOTHESIS_ACTION_TYPES.GET_HYPOTHESIS_BY_ID, getHypothesisById),
    takeEvery(HYPOTHESIS_ACTION_TYPES.UPDATE_HYPOTHESIS, updateHypothesis),
    takeEvery(HYPOTHESIS_ACTION_TYPES.ADD_CIRCLES, addCircles),
  ])
}
