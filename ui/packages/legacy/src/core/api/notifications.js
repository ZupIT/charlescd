import { BaseApiNotification } from './base'

const NotificationsAPI = '/notifications'
const defaultPage = 0

const Notifications = {
  getCountNotViewed(recipientId) {
    return BaseApiNotification.request(`${NotificationsAPI}/recipients/${recipientId}/count?viewed=false`)
  },

  getNotifications(id, page = defaultPage) {
    const SIZE = 100
    const query = `?recipientId=${id}&type=DARWIN&page=${page}&size=${SIZE}`

    return BaseApiNotification.request(`${NotificationsAPI}/${query}`)
  },

  markAsViewed(recipientId, data) {
    return BaseApiNotification.request(`${NotificationsAPI}/recipients/${recipientId}/view`, { method: 'PUT', data })
  },

  markAsRead(notificationId) {
    return BaseApiNotification.request(`${NotificationsAPI}/${notificationId}`, { method: 'PATCH', data: { read: true } })
  },
}

export default Notifications
