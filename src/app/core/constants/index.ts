import { DeploymentsConstants } from './deployments'
import { ConsulConstants } from './integrations/consul.constants'

export const AppConstants = {

  ...DeploymentsConstants,

  ...ConsulConstants
}
