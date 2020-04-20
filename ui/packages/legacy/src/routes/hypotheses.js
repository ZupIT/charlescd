import {
  DASHBOARD_HYPOTHESES,
  DASHBOARD_HYPOTHESES_CARD,
  DASHBOARD_HYPOTHESES_DETAIL,
  DASHBOARD_HYPOTHESES_CARD_BUILDS,
} from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'

export const hypotheses = {
  exact: true,
  path: DASHBOARD_HYPOTHESES,
  component: JSResource('Hypotheses', () => import('containers/QuickBoard')),
}

export const hypothesesDetail = {
  path: DASHBOARD_HYPOTHESES_DETAIL,
  component: JSResource('Hypotheses detail', () => import('containers/QuickBoard')),
  routes: [
    {
      path: DASHBOARD_HYPOTHESES_CARD,
      component: JSResource('View card', () => import('containers/Moove/ViewCard')),
    },
    {
      path: DASHBOARD_HYPOTHESES_CARD_BUILDS,
      component: JSResource('View build', () => import('containers/Moove/ViewBuild')),
    },
  ],
}
