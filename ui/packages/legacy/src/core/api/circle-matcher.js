import {
  CircleMatcherBaseApiUnauthenticated,
  CircleMatcherBaseApiAuthenticated,
} from './base'

const API = '/identify'

const CircleMatcher = {
  identifyCirclesWhenUnauthenticated(data) {
    return CircleMatcherBaseApiUnauthenticated.request(API, { method: 'POST', data })
  },
  identifyCirclesWhenAuthenticated(data) {
    return CircleMatcherBaseApiAuthenticated.request(API, { method: 'POST', data })
  },
}

export default CircleMatcher
