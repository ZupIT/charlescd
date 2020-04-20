import { takeEvery, all, call, put } from 'redux-saga/effects'
import UserApi from 'core/api/users'
import { toasterActions } from 'containers/Toaster/state/actions'
import { USER_ACTION_TYPES, userActions } from './actions'

export function* getUsers({ page, size }) {
  try {
    yield put(userActions.toggleLoading())
    const users = yield call(UserApi.findAll, page, size)
    yield put(userActions.loadedUsers(users))
  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))
  } finally {
    yield put(userActions.toggleLoading())
  }
}

export default function* root() {
  yield all([
    takeEvery(USER_ACTION_TYPES.GET_USERS, getUsers),
  ])
}
