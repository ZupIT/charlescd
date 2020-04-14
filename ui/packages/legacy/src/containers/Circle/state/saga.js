import { takeEvery, all, call, put, select } from 'redux-saga/effects'
import CircleApi from 'core/api/circles'
import { goBack } from 'react-router-redux'
import { toasterActions } from 'containers/Toaster/state/actions'
import { ONE } from 'core/helpers/constants'
import { CIRCLE_ACTION_TYPES, circleActions } from './actions'

export function* getCircles({ active = false, circleFilter }) {
  try {
    const { circle } = yield select()
    yield put(circleActions.toggleLoading(true))
    const page = circle.list.page + ONE
    const circles = yield call(CircleApi.findAll, page, active, circleFilter)

    active
      ? yield put(circleActions.loadedActivesCircles(circles))
      : yield put(circleActions.loadedInactivesCircles(circles))

  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(circleActions.toggleLoading(false))
  }
}

export function* getCircle({ circleId }) {
  try {
    yield put(circleActions.loadingCircle(true))
    const circle = yield call(CircleApi.findById, circleId)
    yield put(circleActions.loadedCircle(circle))
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(circleActions.loadingCircle(false))
  }
}

export function* saveCircle({ circle }) {
  try {
    yield put(circleActions.toggleLoading(true))
    yield call(CircleApi.createCircle, circle)
    yield put(goBack())
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(circleActions.toggleLoading(false))
  }
}

export function* updateCircle({ circleId, circle }) {
  try {
    yield put(circleActions.toggleLoading(true))
    yield call(CircleApi.updateCircle, circleId, circle)
    yield put(goBack())
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(circleActions.toggleLoading(false))
  }
}

export default function* root() {
  yield all([
    takeEvery(CIRCLE_ACTION_TYPES.GET_CIRCLES, getCircles),
    takeEvery(CIRCLE_ACTION_TYPES.GET_CIRCLE, getCircle),
    takeEvery(CIRCLE_ACTION_TYPES.SAVE_CIRCLE, saveCircle),
    takeEvery(CIRCLE_ACTION_TYPES.UPDATE_CIRCLE, updateCircle),
  ])
}
