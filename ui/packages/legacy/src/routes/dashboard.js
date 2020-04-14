import { DASHBOARD, DASHBOARD_CIRCLES } from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'
import CircleRoutes from './circles'
import { hypotheses, hypothesesDetail } from './hypotheses'
import ModuleRoutes from './modules'
import NotFoundRoutes from './notFound'

export default {
  path: DASHBOARD,
  component: JSResource('Dashboard', () => import('containers/Dashboard')),
  redirect: DASHBOARD_CIRCLES,
  routes: [
    ...CircleRoutes,
    hypotheses,
    hypothesesDetail,
    ModuleRoutes,
    NotFoundRoutes,
  ],
}
