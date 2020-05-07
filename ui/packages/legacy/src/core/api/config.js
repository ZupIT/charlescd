import { BaseApi } from './base'

const ConfigAPI = '/config'
const GitAPI = 'v2/configurations'

const Credentials = {
  saveGit(data) {
    return BaseApi.request(`${ConfigAPI}/git`, { method: 'POST', data })
  },
  saveK8s(data) {
    return BaseApi.request(`${ConfigAPI}/k8s`, { method: 'POST', data })
  },
  saveRegistry(data) {
    return BaseApi.request(`${ConfigAPI}/registry`, { method: 'POST', data })
  },
  getConfigs() {
    return BaseApi.request(`${ConfigAPI}`)
  },
  getGitConfig() {
    return BaseApi.request(`${GitAPI}/git`)
  }
}

export default Credentials
