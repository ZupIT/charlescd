import { BaseApi, ApmBaseApi } from './base'

const API = '/deployments'

const Deployment = {
  create(data) {
    return BaseApi.request(`v2${API}`, { method: 'POST', data })
  },

  findById(deploymentId) {
    return BaseApi.request(`${API}/${deploymentId}`, { method: 'GET' })
  },

  delete(deploymentId) {
    return BaseApi.request(`${API}/${deploymentId}`, { method: 'DELETE' })
  },

  getCharts(chartId) {
    return ApmBaseApi.request(`/apm-manager-consumer/charts?key=${chartId}`)
  },

  undeploy(deploymentId) {
    return BaseApi.request(`${API}/${deploymentId}/undeploy`, { method: 'POST' })
  },
}

export default Deployment
