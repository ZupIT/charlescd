
import get from 'lodash/get'

const getData = (key) => {
  const { ENVIRONMENT } = window

  return get(ENVIRONMENT, key, '')
}

export default {
  getData,
}
