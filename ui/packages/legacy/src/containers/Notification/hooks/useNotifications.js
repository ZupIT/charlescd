import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { useDispatch, useSelector } from 'core/state/hooks'
import NotificationsAPI from 'core/api/notifications'
import { getUserProfileData } from 'core/helpers/profile'
import { notificationsActions } from '../state'

export const useNotifications = () => {
  const authorId = getUserProfileData('id')
  const dispatch = useDispatch()
  const { list: notifications, count } = useSelector(state => state.notifications)

  const getCountNotViewed = async () => {
    try {
      const res = await NotificationsAPI.getCountNotViewed(authorId)
      dispatch(notificationsActions.count(res.count))
    } catch (e) {
      console.error(e)
    }
  }

  const newNotification = (data) => {
    try {
      const notification = JSON.parse(data)
      dispatch(notificationsActions.addNewNotification(notification))
      getCountNotViewed()
    } catch (e) {
      console.error(e)
    }
  }


  const getNotifications = async () => {
    try {
      if (isEmpty(notifications)) {
        const { content } = await NotificationsAPI.getNotifications(authorId)
        getCountNotViewed()
        dispatch(notificationsActions.notifications(content))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const markAsRead = (notificationId) => {
    const updated = map(notifications, notification => (
      notification.id === notificationId ? ({ ...notification, read: true }) : notification
    ))

    dispatch(notificationsActions.notifications(updated))

    NotificationsAPI.markAsRead(notificationId)
  }

  const markAsViewed = async () => {
    const updated = map(notifications, notification => ({ ...notification, viewed: true }))

    dispatch(notificationsActions.notifications(updated))

    await NotificationsAPI
      .markAsViewed(authorId, { type: 'DARWIN' })

    getCountNotViewed()
  }

  return [
    {
      count,
    },
    {
      newNotification,
      getNotifications,
      markAsRead,
      markAsViewed,
      getCountNotViewed,
    },
  ]
}
