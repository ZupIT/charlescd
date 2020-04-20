import { Cookies } from 'react-cookie'
import { domain } from 'core/helpers/domain'

const cookies = new Cookies()
const STORAGE_CIRCLE_KEY = 'x-circle-id'

export const clearCircleID = () => {
  cookies.remove(STORAGE_CIRCLE_KEY, { path: '/', domain })
}

export const saveCircleID = (circle) => {
  clearCircleID()
  cookies.set(STORAGE_CIRCLE_KEY, circle, { path: '/', domain })
}

export const getCircleID = () => {
  return cookies.get(STORAGE_CIRCLE_KEY, { path: '/', domain })
}
