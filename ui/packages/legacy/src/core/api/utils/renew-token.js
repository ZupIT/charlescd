import axios from 'axios'
import get from 'lodash/get'
import replace from 'lodash/replace'
import includes from 'lodash/includes'
import { saveSessionData, getSession, clearSession } from 'core/helpers/auth'
import AuthAPI from 'core/api/auth'
import { HTTP_STATUS_CODE } from 'core/constants/HTTPStatusCode'

const { INTERNAL_SERVER_ERROR, UNAUTHORIZED } = HTTP_STATUS_CODE

const replaceURL = (config) => {
  config.url = replace(get(config, 'url', ''), get(config, 'baseURL', ''), '')

  return config
}

const replaceAuthorizationHeader = (config, accessToken) => ({
  ...config,
  headers: {
    ...config.headers,
    Authorization: `Bearer ${accessToken}`,
  },
})

const renewSessionSuccess = (response, config) => {
  const { access_token, refresh_token } = response
  saveSessionData(access_token, refresh_token)

  return axios(replaceURL(replaceAuthorizationHeader(config, access_token)))
}

const renewSessionError = (error) => {
  const { location } = window
  clearSession()

  if (!includes(location.href, '/auth/login')) {
    location.href = `/auth/login?redirectTo=${location.pathname}`
  }

  return Promise.reject(error)
}

const doRefreshtoken = (refreshToken = {}, config) => {
  return AuthAPI.refreshToken(refreshToken)
    .then(refreshResponse => renewSessionSuccess(refreshResponse, config))
    .catch(renewSessionError)
}

const doRenewSession = (axiosConfig, config) => {
  const [, refreshToken] = getSession()

  return doRefreshtoken(refreshToken, config)
}

export const renewSession = (error, axiosConfig) => {
  const { config, response } = error
  const status = get(response, 'status', INTERNAL_SERVER_ERROR)

  return status === UNAUTHORIZED ? doRenewSession(axiosConfig, config) : Promise.reject(error)
}

export const handleResponse = response => response
