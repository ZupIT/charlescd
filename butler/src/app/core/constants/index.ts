import { DeploymentsConstants } from './deployments'
import { ApplicationConstants } from './application'
import { Configuration } from '../config/configurations'

export const AppConstants = {

  ...DeploymentsConstants,

  ...ApplicationConstants,

  Configuration
}
