import { SETTINGS_PERMISSIONS, SETTINGS_PERMISSIONS_GROUPS } from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'
import GroupRoutes from './groups'
import UserRoutes from './users'
import WorkspaceRoutes from './workspaces'

export default {
  path: SETTINGS_PERMISSIONS,
  component: JSResource('Permissions', () => import('containers/Permissions')),
  redirect: SETTINGS_PERMISSIONS_GROUPS,
  routes: [
    GroupRoutes,
    UserRoutes,
    WorkspaceRoutes,
  ],
}
