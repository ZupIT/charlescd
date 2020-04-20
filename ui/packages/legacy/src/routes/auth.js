import { AUTH, AUTH_LOGIN } from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'

export default {
  path: AUTH,
  component: JSResource('Auth', () => import('containers/Auth')),
  routes: [
    {
      path: AUTH_LOGIN,
      component: JSResource('Login', () => import('containers/Login')),
    },
  ],
}
