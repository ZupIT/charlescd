import { useEffect, useState } from 'react'
import filter from 'lodash/filter'
import map from 'lodash/map'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfileData } from 'core/helpers/profile'
import { notificationActions } from 'containers/Notification/state/actions'
import NotificationsAPI from 'core/api/notifications'

const initialUnread = 0

export const useNotifications = () => {
  const { notifications } = useSelector(({ notification }) => notification)
  const [unread, setUnread] = useState(initialUnread)
  const dispatch = useDispatch()
  const authorId = getUserProfileData('id')

  function markAsViewed() {
    const updated = map(notifications, notification => ({ ...notification, viewed: true }))
    dispatch(notificationActions.loadedNotifications(updated))

    NotificationsAPI
      .markAsViewed(authorId, { type: 'DARWIN' })
  }

  function markAsRead(notificationId) {
    const updated = map(notifications, notification => (
      notification.id === notificationId ? ({ ...notification, read: true }) : notification
    ))
    dispatch(notificationActions.loadedNotifications(updated))

    NotificationsAPI.markAsRead(notificationId)
  }

  function startPolling() {
    dispatch(notificationActions.startPolling(authorId))
  }

  function stopPolling() {
    dispatch(notificationActions.stopPolling())
  }

  useEffect(() => {
    const unreadNotifications = filter(notifications, ({ viewed }) => !viewed)
    setUnread(unreadNotifications.length)

  }, [notifications])


  return [{ notifications, unread }, { markAsViewed, markAsRead, startPolling, stopPolling }]
}
