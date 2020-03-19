import moment from 'moment'

export const getDuration = (startTime, finishTime) => {
  const start = moment(startTime)
  const end = moment(finishTime)
  const diff = end.diff(start)

  return moment.utc(diff).format("HH:mm:ss");
}

export const formatStartTime = (startTime) => {
  return moment.utc(startTime).format('DD/MM/YYYY HH:mm')
}

export const getStatusColor = (status) => ({
  'WAITING': 'secondary',
  'DEPLOYING': 'info',
  'DEPLOYED': 'info',
  'ADD_TO_CIRCLE': 'info',
  'REMOVE_FROM_CIRCLE': 'info',
  'FINISHED': 'success',
  'FAILED': 'error'
}[status || 'FAILED'])