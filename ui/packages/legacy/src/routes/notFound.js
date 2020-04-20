import {
  DAHSBOARD_NOT_FOUND,
} from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'

export default {
  path: DAHSBOARD_NOT_FOUND,
  component: JSResource('Not Found', () => import('containers/NotFound')),
}
