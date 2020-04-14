import {
  DASHBOARD_CIRCLES_CREATE,
  DASHBOARD_CIRCLES_EDIT,
  DASHBOARD_CIRCLES_MATCHER,
} from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'

export default [
  {
    path: DASHBOARD_CIRCLES_MATCHER,
    exact: true,
    component: JSResource('Matcher', () => import('containers/Circle/CircleMatcher')),
  },
  {
    path: DASHBOARD_CIRCLES_CREATE,
    exact: true,
    component: JSResource('Create', () => import('containers/Circle/ModalForm')),
  },
  {
    path: DASHBOARD_CIRCLES_EDIT,
    exact: true,
    component: JSResource('Edit', () => import('containers/Circle/ModalForm')),
  },
]
