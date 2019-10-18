import { DeploymentsConstants } from './deployments'
import { ApplicationConstants } from './application'
import { IntegrationsConstants } from './integrations'

export const AppConstants = {

  ...DeploymentsConstants,

  ...IntegrationsConstants,

  ...ApplicationConstants
}
