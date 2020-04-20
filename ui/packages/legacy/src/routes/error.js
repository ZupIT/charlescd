import {
  ERRORS,
} from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'

export default {
  path: ERRORS,
  component: JSResource('Error', () => import('containers/Error')),
}
