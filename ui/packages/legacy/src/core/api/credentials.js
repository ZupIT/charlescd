import { BaseRxApi as Api } from './base'

const ConfigAPI = '/config'
const GitAPI = 'v2/configurations'

const Credentials = {
  saveGit(data) {
    return Api.request(`${GitAPI}/git`, { method: 'POST', data })
  },
  saveK8s(data) {
    return Api.request(`${ConfigAPI}/cd`, { method: 'POST', data })
  },
  saveRegistry(data) {
    return Api.request(`${ConfigAPI}/registry`, { method: 'POST', data })
  },
  getConfigs() {
    return Api.request(`${ConfigAPI}`)
  },
  getGitConfig() {
    return Api.request(`${GitAPI}/git`)
  }
}

export default Credentials
