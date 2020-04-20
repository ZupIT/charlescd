import axios from 'axios'
import { Observable } from 'rxjs'
import first from 'lodash/first'
import defaultsDeep from 'lodash/defaultsDeep'
import { getCircleID } from 'core/helpers/circle'
import { getSession, isAuthenticated } from 'core/helpers/auth'
import { getApplication } from 'core/helpers/application'
import { renewSession } from './utils/renew-token'

const getBaseConfig = () => ({
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getAuthConfig = () => {
  return {
    headers: {
      authorization: `Bearer ${first(getSession())}`,
      'x-circle-id': getCircleID() || 'Default',
      'x-application-id': getApplication(),
    },
  }
}

function mergeOptions(axiosConfig, path, options) {
  const mergedOptions = defaultsDeep(options, getBaseConfig())

  return axiosConfig(path, mergedOptions).then(({ data }) => data)
}

function createAxiosConfig(baseURL, isAuth = false) {
  const config = axios.create({ baseURL })

  if (isAuth) {
    config.interceptors.request.use((requestConfig) => {
      if (!isAuthenticated()) {
        window.location.href = `/auth/login?redirectTo=${window.location.pathname}`
      }

      return requestConfig
    })
    config.interceptors.response.use(null, error => renewSession(error, config))
  }

  return {
    ...config,
    request: (path, options) => mergeOptions(config, path, options),
  }
}

const baseAuthenticated = host => ({
  async request(path, options) {
    const axiosConfig = createAxiosConfig(host, true)
    const mergedOptions = defaultsDeep(options, getAuthConfig())

    return axiosConfig.request(path, mergedOptions)
  },
})

const baseUnauthenticated = host => ({
  async request(path, options = {}) {
    const axiosConfig = createAxiosConfig(host, false)

    return axiosConfig.request(path, options)
  },
})

const baseAuthObservable = host => ({
  request(path, options = {}) {
    return Observable.create((observer) => {
      baseAuthenticated(host)
        .request(path, options)
        .then(data => observer.next(data))
        .catch(err => observer.error(err))
    })
  },
})

export default {
  baseAuthenticated,
  baseUnauthenticated,
  baseAuthObservable,
}
