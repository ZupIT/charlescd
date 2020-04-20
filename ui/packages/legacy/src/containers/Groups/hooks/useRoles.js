import { useState, useEffect } from 'react'
import map from 'lodash/map'
import find from 'lodash/find'
import isUndefined from 'lodash/isUndefined'
import AuthInfo from 'core/api/auth-info'
import { useDispatch } from 'core/state/hooks'
import { groupsActions } from '../state'


const useRoles = () => {
  const dispatch = useDispatch()
  const [rolesLoading, setRolesLoading] = useState(false)

  useEffect(() => {
    return () => dispatch(groupsActions.reset('roles'))
  }, [])

  const serializeRoles = (currentRoles, newRoles) => (
    map(currentRoles, (role) => {
      return { ...role, value: !isUndefined(find(newRoles, newRole => newRole.id === role.id)) }
    })
  )

  const actions = {
    getRoles: (newRoles) => {
      setRolesLoading(true)

      AuthInfo.getRoles()
        .then(res => dispatch(groupsActions.roles(serializeRoles(res, newRoles))))
        .catch(error => console.error(error))
        .finally(() => setRolesLoading(false))
    },
    serializeRoles,
  }

  return [
    { rolesLoading },
    actions,
  ]
}

export default useRoles
