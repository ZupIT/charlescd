import get from 'lodash/get'
import { getKeycloak, initKeycloak } from './keycloak'
import moment from './moment'

const BASE = 100
const REFRESH_TOKEN_PERCENT = 50
const TIMEOUT_MODAL_PERCENT = 20
export const DEFAULT_APP_CURRENCY = 'BRL'

let MIN_REFRESH_TOKEN_TIME
let MIN_TIMEOUT_MODAL_TIME

let refreshTokenPromise

export function getSlug() {
  return window.location.hostname.split('.')[0]
}

export function initApplication(callback) {
  initKeycloak(callback)
}

export function getToken() {
  return get(getKeycloak(), 'token')
}

export function getAppId() {
  const app = { id: 2014, name: 'Care', slug: 'care', description: 'care', currency: 'USD', tenantGroupSlug: 'care' }

  return app.slug
}

export function hasApplication() {
  return !!getAppId()
}

export function hasPermission(appId) {
  let appIdCopy = appId
  if (!appIdCopy) {
    appIdCopy = getAppId()
  }

  const permission = get(getKeycloak(), 'tokenParsed.resource_access', {})

  return appIdCopy ? !!permission[appIdCopy] : !!appIdCopy
}

export function getAppName() {
  const app = localStorage.getItem('rw.application')

  return app && JSON.parse(app).name
}

export function getAppCurrency() {
  const app = localStorage.getItem('rw.application')
  const currency = app && JSON.parse(app).currency

  return currency || DEFAULT_APP_CURRENCY
}

export function getUserName() {
  const userName = get(getKeycloak(), 'tokenParsed.name')

  return userName
}

export function logout() {
  getKeycloak().logout()
}

export function login() {
  return getKeycloak().login()
}

export function redirectTo(url) {
  window.location.replace(url)
}

export function setApplication(application) {
  localStorage.setItem('rw.application', JSON.stringify(application))
}

function getTokenRemainingTime() {
  const timeSkew = get(getKeycloak(), 'timeSkew')
  const expires = moment.unix(get(getKeycloak(), 'tokenParsed.exp'))
  const now = moment()
  const diff = (expires.diff(now, 'seconds') + timeSkew)

  return diff
}

export function shouldOpenTimeoutModal() {
  const remainingTime = getTokenRemainingTime()

  if (!MIN_TIMEOUT_MODAL_TIME) {
    MIN_TIMEOUT_MODAL_TIME = parseInt(remainingTime * (TIMEOUT_MODAL_PERCENT / BASE), 0)
  }

  return remainingTime <= MIN_TIMEOUT_MODAL_TIME
}

export function needRefreshToken() {
  const remainingTime = getTokenRemainingTime()

  if (!MIN_REFRESH_TOKEN_TIME) {
    MIN_REFRESH_TOKEN_TIME = parseInt(remainingTime * (REFRESH_TOKEN_PERCENT / BASE), 0)
  }

  return remainingTime <= MIN_REFRESH_TOKEN_TIME
}

export function refreshToken(data) {
  if (!needRefreshToken()) {
    return Promise.resolve(data)
  }

  if (!refreshTokenPromise) {
    refreshTokenPromise = getKeycloak().updateToken(MIN_REFRESH_TOKEN_TIME)
  }

  const promise = new Promise((resolve, reject) => {
    refreshTokenPromise.success(() => {
      refreshTokenPromise = null
      resolve(data)
    }).error(() => {
      refreshTokenPromise = null
      login()
      reject(data)
    })
  })

  return promise
}
