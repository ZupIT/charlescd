import { AbilityBuilder } from '@casl/ability'
import jwtDecode from 'jwt-decode'
import map from 'lodash/map'
import get from 'lodash/get'
import { getSession } from './auth'

const abilityBuilder = AbilityBuilder.define((can) => {
  can('nothing', 'all')
})

export const updateAbility = () => {
  const [token] = getSession()

  if (token) {
    const jwtPayload = jwtDecode(token)
    const { roles } = get(jwtPayload, 'realm_access')
    const rolesAbility = map(roles, role => ({ subject: 'all', actions: role }))
    abilityBuilder.update(rolesAbility)
  }
}

export default abilityBuilder
