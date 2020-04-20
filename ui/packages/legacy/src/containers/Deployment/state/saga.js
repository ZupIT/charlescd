import { takeEvery, all, put, call, delay, race, take } from 'redux-saga/effects'
import DeploymentApi from 'core/api/deployment'
import HypothesesApi from 'core/api/hypotheses'
import { toasterActions } from 'containers/Toaster/state/actions'
import { circleActions } from 'containers/Circle/state/actions'
import { DEPLOY_ACTION_TYPES, deploymentActions } from './actions'

export function* createDeployment({ data, hypothesisId }) {
  try {
    yield put(deploymentActions.toggleLoading())
    yield call(DeploymentApi.create, data)
    yield put(deploymentActions.getDeploymentsByHypothesisId(hypothesisId))
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(deploymentActions.toggleLoading())
  }
}

export function* deleteDeployment({ deploymentId }) {
  try {
    yield put(deploymentActions.toggleLoading())
    yield call(DeploymentApi.delete, deploymentId)
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(deploymentActions.toggleLoading())
  }
}

export function* undeployDeployment({ deploymentId }) {
  try {
    yield put(deploymentActions.toggleLoading())
    yield call(DeploymentApi.undeploy, deploymentId)
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(deploymentActions.toggleLoading())
  }
}

export function* getDeploymentById({ deploymentId }) {
  try {
    yield put(deploymentActions.toggleLoading())
    const deployment = yield call(DeploymentApi.findById, deploymentId)
    yield put(deploymentActions.loadedDpeloyment(deployment))
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(deploymentActions.toggleLoading())
  }
}

export function* getDeployments({ hypothesisId }) {
  try {
    yield put(deploymentActions.toggleLoadingList())
    const deployments = yield call(HypothesesApi.getDeploymentsById, hypothesisId)
    yield put(deploymentActions.loadedDeployments(deployments))
    yield put(deploymentActions.getValidatedBuilds(hypothesisId))
    yield put(circleActions.getCircles())
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(deploymentActions.toggleLoadingList())
  }
}

export function* getDeploymentsByHypothesisId({ hypothesisId }) {
  try {
    yield put(deploymentActions.toggleLoadingList())
    const deployments = yield call(HypothesesApi.getDeploymentsById, hypothesisId)
    yield put(deploymentActions.loadedDeployments(deployments))
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(deploymentActions.toggleLoadingList())
  }
}

export function* getValidatedBuilds({ hypothesisId }) {
  try {
    yield put(deploymentActions.toggleLoadingList())
    const builds = yield call(HypothesesApi.getValidatedBuilds, hypothesisId)
    yield put(deploymentActions.loadedValidatedBuilds(builds))
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(deploymentActions.toggleLoadingList())
  }
}

export function* pollingWorker({ hypothesisId }) {
  const timeout = 15000

  while (true) {
    try {
      const deployments = yield call(HypothesesApi.getDeploymentsById, hypothesisId)
      yield put(deploymentActions.loadedDeployments(deployments))
    } catch (e) {
      yield put(toasterActions.toastFailed('message.error.unexpected'))
    } finally {
      yield delay(timeout)
    }
  }
}

export function* watchPolling() {
  while (true) {
    const data = yield take(DEPLOY_ACTION_TYPES.START_POLLING)
    yield race([
      call(pollingWorker, data),
      take(DEPLOY_ACTION_TYPES.STOP_POLLING),
    ])
  }
}

export function* getCharts() {
  try {
    const Women = yield call(DeploymentApi.getCharts, 'Women')
    const Men = yield call(DeploymentApi.getCharts, 'Men')
    const Default = yield call(DeploymentApi.getCharts, 'Default')

    yield put(deploymentActions.loadedCharts({
      Women,
      Men,
      Default,
    }))

  } catch (e) {
    console.error(e)
  }
}

export default function* root() {
  yield all([
    takeEvery(DEPLOY_ACTION_TYPES.CREATE, createDeployment),
    takeEvery(DEPLOY_ACTION_TYPES.DELETE, deleteDeployment),
    takeEvery(DEPLOY_ACTION_TYPES.GET_DEPLOYMENTS, getDeployments),
    takeEvery(DEPLOY_ACTION_TYPES.GET_DEPLOYMENTS_BY_HYPOTHESIS_ID, getDeploymentsByHypothesisId),
    takeEvery(DEPLOY_ACTION_TYPES.GET_VALIDATED_BUILDS, getValidatedBuilds),
    takeEvery(DEPLOY_ACTION_TYPES.GET_CHARTS, getCharts),
    takeEvery(DEPLOY_ACTION_TYPES.UNDEPLOY, undeployDeployment),
    watchPolling(),
  ])
}
