import {
  SETTINGS,
} from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'
import PermissionRoutes from './permissions'
import CredentialRoutes from './credentials'

export default {
  path: SETTINGS,
  component: JSResource('Settings', () => import('containers/Settings')),
  routes: [
    PermissionRoutes,
    ...CredentialRoutes,
  ],
}
