import { takeEvery, all, call, put, take, race, delay } from 'redux-saga/effects'
import NotificationsAPI from 'core/api/notifications'
import { NOTIFICATION_ACTION_TYPES, notificationActions } from './actions'

export function* getNotifications({ id }) {
  try {
    yield put(notificationActions.toggleLoading())
    const { content } = yield call(NotificationsAPI.getNotifications, id)
    yield put(notificationActions.loadedNotifications(content))
  } catch (err) {
    console.error(err)
  } finally {
    yield put(notificationActions.toggleLoading())
  }
}

export function* startNotificationPolling({ authorId }) {
  const timeout = 10000

  while (true) {
    try {
      yield put(notificationActions.getNotifications(authorId))
      yield delay(timeout)
    } catch (e) {
      console.error(e)
    }
  }
}

export function* watchNotificationPolling() {
  while (true) {
    const data = yield take(NOTIFICATION_ACTION_TYPES.START_POLLING)
    yield race([
      call(startNotificationPolling, data),
    ])
  }
}

export default function* root() {
  yield all([
    takeEvery(NOTIFICATION_ACTION_TYPES.GET_NOTIFICATIONS, getNotifications),
    watchNotificationPolling(),
  ])
}
