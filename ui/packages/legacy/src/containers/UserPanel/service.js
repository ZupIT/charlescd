import { useState } from 'react'
import NotificationsAPI from 'core/api/notifications'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState()

  const getNotifications = () => {
    NotificationsAPI.getNotifications()
      .then(({ content }) => setNotifications(content))
  }

  return [notifications, getNotifications]
}
