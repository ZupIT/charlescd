import React, { useEffect } from 'react'
import { getUserProfileData } from 'core/helpers/profile'
import { connectNotification } from './connect'
import { useNotifications } from './hooks/useNotifications'

const Notification = () => {
  const authorId = getUserProfileData('id')
  const [, { newNotification, getNotifications }] = useNotifications()

  useEffect(() => {
    if (authorId) {
      connectNotification(authorId, newNotification)
      getNotifications(authorId)
    }
  }, [
    connectNotification,
    authorId,
  ])

  return <></>
}

export default React.memo(Notification)
