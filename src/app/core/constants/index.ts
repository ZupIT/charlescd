import { DeploymentsConstants } from './deployments'
import { ApplicationConstants } from './application'
import { IntegrationsConstants } from './integrations'
import { Configuration } from '../../config/configurations'

export const AppConstants = {

  ...DeploymentsConstants,

  ...IntegrationsConstants,

  ...ApplicationConstants,

  Configuration
}
