import map from 'lodash/map'

export const parseComponents = (components) => {
  return map(components, ({ name }) => ({ name }))
}
