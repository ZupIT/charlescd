import { BaseApi } from './base'

const API = '/metrics'

const Metrics = {
  getMetricsByCircle(circleId, { period, metricType }) {
    const circleIdQuery = `?circleId=${circleId}`
    const periodQuery = `&projectionType=${period}`
    const metricTypeQuery = `&metricType=${metricType}`

    return BaseApi.request(`${API}${circleIdQuery}${periodQuery}${metricTypeQuery}`)
  },
}

export default Metrics
