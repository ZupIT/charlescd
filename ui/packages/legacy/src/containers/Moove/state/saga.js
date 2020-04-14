import { takeEvery, call, put, all, delay, take, race } from 'redux-saga/effects'
import size from 'lodash/size'
import { history } from 'core/routing/createRouter'
import { getPath } from 'core/helpers/routes'
import { ERRORS } from 'core/constants/routes'
import HypothesesApi from 'core/api/hypotheses'
import CardsApi from 'core/api/cards'
import ModulesApi from 'core/api/modules'
import BuildsApi from 'core/api/builds'
import DeploymentsApi from 'core/api/deployment'
import { toasterActions } from 'containers/Toaster/state/actions'
import { HTTP_STATUS_CODE } from 'core/constants/HTTPStatusCode'
import { MOOVE_ACTION_TYPES, mooveActions } from './actions'


export function* getColumns({ hypothesisId }) {
  try {
    yield put(mooveActions.toggleColumnLoading(true))
    const columns = yield call(HypothesesApi.findById, hypothesisId)

    yield put(mooveActions.loadedColumns(columns))
  } catch (error) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(mooveActions.toggleColumnLoading(false))
  }
}

export function* updateReleaseColumn({ buildId, columnId }) {
  try {
    yield call(BuildsApi.updateBuildColumn, buildId, columnId)
  } catch (e) {
    yield put(toasterActions.toastFailed('moove.error.updateCardColumn'))
  }
}

export function* updateCardColumn({ cardId, hypothesisId, data }) {
  try {
    yield call(HypothesesApi.updateCardColumn, hypothesisId, cardId, data)
  } catch (error) {
    yield put(mooveActions.getColumns(hypothesisId))
    yield put(toasterActions.toastFailed('moove.error.updateCardColumn'))
  }
}

export function* updateCardUsers({ cardId, data }) {
  try {
    yield call(CardsApi.updateMembers, cardId, data)
  } catch (err) {
    yield put(toasterActions.toastFailed('moove.error.updateCardUsers'))
  }
}

export function* orderCardsInColumn({ hypothesisId, data }) {
  try {
    yield call(HypothesesApi.orderCardsInColumn, hypothesisId, data)
  } catch (error) {
    yield put(mooveActions.getColumns(hypothesisId))
    yield put(toasterActions.toastFailed('moove.error.updateCardColumn'))
  }
}

export function* createCard({ payload }) {
  const { hypothesisId } = payload

  try {
    yield put(mooveActions.toggleCreateLoading())
    yield put(mooveActions.updateColumnWithNewCard(payload))
    yield call(CardsApi.create, payload)
    yield put(mooveActions.getColumns(hypothesisId))
  } catch (e) {
    yield put(mooveActions.updateColumnWithoutNewCard(payload))
    yield put(mooveActions.getColumns(hypothesisId))
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(mooveActions.toggleCreateLoading())
  }
}

export function* getCard({ cardId }) {
  try {
    yield put(mooveActions.toggleCardLoading())
    const card = yield call(CardsApi.getById, cardId)
    yield put(mooveActions.loadedCard(card))
  } catch (e) {
    if (e?.response?.status !== HTTP_STATUS_CODE.NOT_FOUND) {
      yield put(toasterActions.toastFailed('message.error.unexpected'))
    } else {
      yield call(history.replace, getPath(ERRORS))
    }
  } finally {
    yield put(mooveActions.toggleCardLoading())
  }
}

export function* updateCard({ cardId, data }) {
  try {
    const card = yield call(CardsApi.update, cardId, data)
    yield put(mooveActions.loadedCard(card))
  } catch (e) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  }
}

export function* deleteCard({ cardId }) {
  try {
    yield call(CardsApi.delete, cardId)
    yield put(mooveActions.deleteCardColumn(cardId))
    yield put(toasterActions.toastSuccess('moove.success.card.deleted'))
  } catch (e) {
    yield put(toasterActions.toastFailed('moove.error.card.delete'))
  }
}

export function* archiveCard({ cardId }) {
  try {
    yield call(CardsApi.archive, cardId)
    yield put(mooveActions.deleteCardColumn(cardId))
    yield put(toasterActions.toastSuccess('moove.success.card.archived'))
  } catch (e) {
    yield put(toasterActions.toastFailed('moove.error.card.archive'))
  }
}

export function* getBuild({ buildId }) {
  try {
    yield put(mooveActions.toggleCardLoading())
    const build = yield call(BuildsApi.findById, buildId)
    yield put(mooveActions.loadedBuild(build))
  } catch (e) {
    if (e?.response?.status !== HTTP_STATUS_CODE.NOT_FOUND) {
      yield put(toasterActions.toastFailed('message.error.unexpected'))
    } else {
      yield call(history.replace, getPath(ERRORS))
    }
  } finally {
    yield put(mooveActions.toggleCardLoading())
  }
}

export function* deleteBuild({ cardId }) {
  try {
    yield call(BuildsApi.delete, cardId)
    yield put(mooveActions.deleteCardColumn(cardId))
    yield put(toasterActions.toastSuccess('moove.success.build.deleted'))
  } catch (e) {
    yield put(toasterActions.toastFailed('moove.error.build.delete'))
  }
}

export function* archiveBuild({ cardId }) {
  try {
    yield call(BuildsApi.archive, cardId)
    yield put(mooveActions.deleteCardColumn(cardId))
    yield put(toasterActions.toastSuccess('moove.success.build.archived'))
  } catch (e) {
    yield put(toasterActions.toastFailed('moove.error.build.archive'))
  }
}

export function* getModules() {
  try {
    yield put(mooveActions.toggleModulesLoading())
    const modules = yield call(ModulesApi.getModules)
    yield put(mooveActions.loadedModules(modules))
  } catch (e) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(mooveActions.toggleModulesLoading())
  }
}

export function* generateReleseCandidate({ data }) {
  try {
    const { hypothesisId } = data
    yield put(mooveActions.toggleGeneratingRelease())
    yield put(mooveActions.updateTeamValidationWithNewCard(data))
    yield call(BuildsApi.create, data)
    yield put(mooveActions.getColumns(hypothesisId))
    yield put(mooveActions.startPolling(hypothesisId))
    yield put(toasterActions.toastSuccess('message.success.build.triggered'))
  } catch (error) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(mooveActions.toggleGeneratingRelease())
  }
}

export function* deployReleaseCandidate({ data, hypothesisId }) {
  try {
    yield call(DeploymentsApi.create, data)
    yield put(mooveActions.getColumns(hypothesisId))
    yield put(mooveActions.startPolling(hypothesisId))
    yield put(toasterActions.toastSuccess('message.success.deploy.triggered'))
  } catch (error) {
    const { response: { data: { message } } } = error
    yield put(toasterActions.toastFailed(message))
  }
}

export function* addComment({ cardId, data }) {
  try {
    yield put(mooveActions.toggleCommentsLoading())
    yield call(CardsApi.addComment, cardId, data)
    yield put(mooveActions.getCard(cardId))
  } catch (e) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(mooveActions.toggleCommentsLoading())
  }
}

export function* pollingWorker({ hypothesisId }) {
  const timeout = 15000
  let oldEvents = []

  while (true) {
    try {
      const { events: currentEvents } = yield call(HypothesesApi.buildEvents, hypothesisId)

      if (size(oldEvents) !== size(currentEvents)) {
        oldEvents = currentEvents
        const columns = yield call(HypothesesApi.findById, hypothesisId)
        yield put(mooveActions.loadedColumns(columns))
      }

      yield delay(timeout)
    } catch (e) {
      console.error(e)
    }
  }
}

export function* watchPolling() {
  while (true) {
    const data = yield take(MOOVE_ACTION_TYPES.START_POLLING)
    yield race([
      call(pollingWorker, data),
      take(MOOVE_ACTION_TYPES.STOP_POLLING),
    ])
  }
}

export default function* root() {
  yield all([
    takeEvery(MOOVE_ACTION_TYPES.GET_COLUMNS, getColumns),
    takeEvery(MOOVE_ACTION_TYPES.UPDATE_CARD_USERS, updateCardUsers),
    takeEvery(MOOVE_ACTION_TYPES.UPDATE_CARD_COLUMN, updateCardColumn),
    takeEvery(MOOVE_ACTION_TYPES.ORDER_CARDS, orderCardsInColumn),
    takeEvery(MOOVE_ACTION_TYPES.UPDATE_RELEASE, updateReleaseColumn),
    takeEvery(MOOVE_ACTION_TYPES.CREATE_CARD, createCard),
    takeEvery(MOOVE_ACTION_TYPES.UPDATE_CARD, updateCard),
    takeEvery(MOOVE_ACTION_TYPES.GET_CARD, getCard),
    takeEvery(MOOVE_ACTION_TYPES.DELETE_CARD, deleteCard),
    takeEvery(MOOVE_ACTION_TYPES.ARCHIVE_CARD, archiveCard),
    takeEvery(MOOVE_ACTION_TYPES.GET_BUILD, getBuild),
    takeEvery(MOOVE_ACTION_TYPES.DELETE_BUILD, deleteBuild),
    takeEvery(MOOVE_ACTION_TYPES.ARCHIVE_BUILD, archiveBuild),
    takeEvery(MOOVE_ACTION_TYPES.GET_MODULES, getModules),
    takeEvery(MOOVE_ACTION_TYPES.GENERATE_RELEASE_CANDIDATE, generateReleseCandidate),
    takeEvery(MOOVE_ACTION_TYPES.DEPLOY_RELEASE_CANDIDATE, deployReleaseCandidate),
    takeEvery(MOOVE_ACTION_TYPES.ADD_COMMENT, addComment),
    watchPolling(),
  ])
}
