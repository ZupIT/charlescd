import { RELEASE_TYPES } from 'containers/Moove/constants'
import { ZERO } from 'core/helpers/constants'
import reduce from 'lodash/reduce'
import unionBy from 'lodash/unionBy'

export const ifActions = (actions, deployment) => (
  actions.length > ZERO
  && deployment.status === RELEASE_TYPES.DEPLOYED
)

export const getModulesByFeatures = (features) => {
  return reduce(features, (modules, feature) => {
    const mods = feature.modules.map(({ id, name }) => ({ id, name }))

    return unionBy(modules.concat(mods), e => e.id)
  }, [])
}
