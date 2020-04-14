import ConsulApi from './consul'

const API = '/v1/kv/apm/fields/zup/2d30a464fe8d9fd3dad15bb942337f32'
const API_FOLDER = '/v1/kv/apm/fields/zup?keys'
const API_PREFIX = '/v1/kv/'

const DataCollector = {
  getFields(id) {
    return ConsulApi.request(`${API_PREFIX}${id}`, { method: 'GET' })
  },
  saveFields(consulObject) {
    return ConsulApi.request(API, { method: 'PUT', data: consulObject })
  },
  getAllKeys() {
    return ConsulApi.request(API_FOLDER, { method: 'GET' })
  },
}

export default DataCollector
