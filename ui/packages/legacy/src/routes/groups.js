import {
  SETTINGS_PERMISSIONS_GROUPS,
  SETTINGS_PERMISSIONS_GROUPS_CREATE,
  SETTINGS_PERMISSIONS_GROUPS_EDIT,
} from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'

export default {
  path: SETTINGS_PERMISSIONS_GROUPS,
  component: JSResource('Groups', () => import('containers/Groups')),
  routes: [
    {
      path: SETTINGS_PERMISSIONS_GROUPS_CREATE,
      component: JSResource('Create group', () => import('containers/Groups/ModalCreate')),
    },
    {
      path: SETTINGS_PERMISSIONS_GROUPS_EDIT,
      component: JSResource('Edit Group', () => import('containers/Groups/ModalCreate')),
    },
  ],
}
