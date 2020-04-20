import moment from 'moment'

export const getDuration = (startTime, finishTime) => {
  const start = moment(startTime)
  const end = moment(finishTime)
  const diff = end.diff(start)

  return moment.utc(diff).format("HH:mm:ss");
}

export const formatStartTime = (startTime) => {
  return moment(startTime).format('DD/MM/YYYY HH:mm')
}

export const getStatusColor = (status) => ({
  'WAITING': 'secondary',
  'RUNNING': 'info',
  'FINISHED': 'success',
  'FAILED': 'danger',
  'WEBHOOK_FAILED': 'danger',
}[status || 'FAILED'])