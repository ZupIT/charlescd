import { takeEvery, put, all, delay } from 'redux-saga/effects'
import { TOASTER_ACTION_TYPES, toasterActions } from './actions'

export function* toggleToast() {
  const timeout = 8500

  yield delay(timeout)
  yield put(toasterActions.removeToast())
}

export default function* root() {
  yield all([
    takeEvery(TOASTER_ACTION_TYPES.ADD_TOAST, toggleToast),
  ])
}
