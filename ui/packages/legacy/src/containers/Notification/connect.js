export const connectNotification = (recipientId, notification) => {
  const uri = `${window.ENVIRONMENT.NOTIFICATION}/notifications/connect/${recipientId}`
  const sse = new EventSource(uri, { withCredentials: true })

  sse.addEventListener('NOTIFICATION', ({ data }) => {
    notification(data)
  })

  sse.onerror = e => console.error(e)
  sse.onopen = () => null
}
