import {
  DASHBOARD_MODULES,
  DASHBOARD_MODULES_CREATE,
  DASHBOARD_MODULES_EDIT,
} from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'


export default {
  path: DASHBOARD_MODULES,
  component: JSResource('Modules', () => import('containers/Modules')),
  routes: [
    {
      exact: true,
      path: DASHBOARD_MODULES,
      component: JSResource('Module List', () => import('containers/Modules/ModuleList')),
    },
    {
      path: DASHBOARD_MODULES_CREATE,
      component: JSResource('Module Create', () => import('containers/Modules/CreateEditModule')),
    },
    {
      path: DASHBOARD_MODULES_EDIT,
      component: JSResource('Module Edit', () => import('containers/Modules/CreateEditModule')),
    },
  ],
}
