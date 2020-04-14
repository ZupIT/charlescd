import { Cookies } from 'react-cookie'
import has from 'lodash/has'
import { clearCircleID } from 'core/helpers/circle'
import { clearUserProfile } from 'core/helpers/profile'
import { clearApplication } from 'core/helpers/application'
import { domain } from 'core/helpers/domain'
import history from '../../history'

const cookies = new Cookies()
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access-token',
  REFRESH_TOKEN: 'refresh-token',
}

export function clearSession() {
  cookies.remove(STORAGE_KEYS.ACCESS_TOKEN, { path: '/', domain })
  cookies.remove(STORAGE_KEYS.REFRESH_TOKEN, { path: '/', domain })
  clearCircleID()
  clearUserProfile()
  clearApplication()
}

export function saveSessionData(accessToken, refreshToken) {
  cookies.remove(STORAGE_KEYS.ACCESS_TOKEN, { path: '/', domain })
  cookies.remove(STORAGE_KEYS.REFRESH_TOKEN, { path: '/', domain })
  cookies.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken, { path: '/', domain })
  cookies.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken, { path: '/', domain })
}

export function getSession() {
  const accessToken = cookies.get(STORAGE_KEYS.ACCESS_TOKEN, { path: '/', domain })
  const refreshToken = cookies.get(STORAGE_KEYS.REFRESH_TOKEN, { path: '/', domain })

  return [accessToken, refreshToken]
}

export function isAuthenticated() {
  const [accessToken, refreshToken] = getSession()

  return has(window, 'DEVELOPMENT') || accessToken || refreshToken
}

export function goToLogin() {
  history.go('/auth/login')
}

function buildRandomString() {
  const startIndex = 2
  const endIndex = 10
  const radix = 36

  return Math.random().toString(radix).substring(startIndex, endIndex)
}

export function getRandomPassword() {
  return `${buildRandomString()}${buildRandomString()}`
}

export const useAuth = () => {

  const logout = () => {
    clearSession()
    goToLogin()
  }

  return [logout]
}
