const pathDevelopmentV2 = 'http://localhost:3000/v2'

function isDevelopment() {
  const { NODE_ENV } = process.env
  const DEVELOPMENT = 'development'

  return NODE_ENV === DEVELOPMENT
}

export default {
  isDevelopment,
  pathDevelopmentV2,
}
