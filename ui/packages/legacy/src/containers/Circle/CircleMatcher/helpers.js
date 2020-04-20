import reduce from 'lodash/reduce'

export function buildParameters(params = {}) {
  return reduce(params, (acc, { key = '', value = '' }) => {
    acc[key] = value

    return acc
  }, {})
}

export function parseParameters(parameters) {
  try {
    const parsedParams = JSON.parse(parameters)

    return parsedParams
  } catch {
    return parameters
  }
}
