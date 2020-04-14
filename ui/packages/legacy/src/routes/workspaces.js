import {
  SETTINGS_PERMISSIONS_WORKSPACE,
  SETTINGS_PERMISSIONS_WORKSPACE_CREATE,
  SETTINGS_PERMISSIONS_WORKSPACE_EDIT,
} from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'

export default {
  path: SETTINGS_PERMISSIONS_WORKSPACE,
  component: JSResource('Workspaces', () => import('containers/Workspaces')),
  routes: [
    {
      path: SETTINGS_PERMISSIONS_WORKSPACE_CREATE,
      component: JSResource('Create Workspaces', () => import('containers/Workspaces/ModalApplication')),
    },
    {
      path: SETTINGS_PERMISSIONS_WORKSPACE_EDIT,
      component: JSResource('Edit Workspaces', () => import('containers/Workspaces/ModalApplication')),
    },
  ],
}
