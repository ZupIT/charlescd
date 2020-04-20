import {
  SETTINGS_PERMISSIONS_USERS,
  SETTINGS_PERMISSIONS_USERS_CREATE,
  SETTINGS_PERMISSIONS_USERS_EDIT,
  SETTINGS_PERMISSIONS_USERS_GROUPS,
} from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'

export default {
  path: SETTINGS_PERMISSIONS_USERS,
  component: JSResource('Users', () => import('containers/Users')),
  routes: [
    {
      path: SETTINGS_PERMISSIONS_USERS_CREATE,
      component: JSResource('Create user', () => import('containers/Users/CreateModal')),
    },
    {
      path: SETTINGS_PERMISSIONS_USERS_EDIT,
      component: JSResource('Create user', () => import('containers/Users/CreateModal')),
    },
    {
      path: SETTINGS_PERMISSIONS_USERS_GROUPS,
      component: JSResource('Edit user', () => import('containers/Users/EditUserModal')),
    },
  ],
}
