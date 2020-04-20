import axios from 'axios'
import defaultsDeep from 'lodash/defaultsDeep'

const getBaseConfig = () => ({
  headers: {
    Accept: 'application/json',
  },
})

const getAxiosOptions = () => axios.create({
  baseURL: global.ENVIRONMENT.CONSUL,
})

const mergeOptions = (axiosConfig, path, options) => {
  const mergedOptions = defaultsDeep(options, getBaseConfig())

  return axiosConfig(path, mergedOptions).then(({ data }) => data)
}

const onResponseError = error => Promise.reject(error)


const onRequestValidate = config => config

const getAxiosConfiguration = () => {
  const axiosConfig = getAxiosOptions()
  axiosConfig.request = (path, options) => mergeOptions(axiosConfig, path, options)
  axiosConfig.interceptors.request.use(onRequestValidate)
  axiosConfig.interceptors.response.use(null, onResponseError)

  return axiosConfig
}

const consulApi = {
  async request(path, options) {
    const axiosConfig = getAxiosConfiguration()

    return axiosConfig.request(path, options)
  },
}

export default consulApi
