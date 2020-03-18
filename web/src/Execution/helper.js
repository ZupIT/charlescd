export const getManifestStatusColor = (status) => ({
  'CREATED': 'info',
  'DEPLOYING': 'info',
  'DEPLOYED': 'success',
  'IS_DEPLOYED': 'secondary',
  'FAILED': 'error'
}[status || 'FAILED'])