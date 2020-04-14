import {
  ROOT, DASHBOARD_CIRCLES,
} from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'
import DashboardRoutes from './dashboard'
import SettingRoutes from './settings'
import AuthRoutes from './auth'
import Error from './error'

export default [{
  path: ROOT,
  component: JSResource('Root', () => import('../Root')),
  redirect: DASHBOARD_CIRCLES,
  routes: [
    DashboardRoutes,
    SettingRoutes,
    AuthRoutes,
    Error,
  ],
}]
