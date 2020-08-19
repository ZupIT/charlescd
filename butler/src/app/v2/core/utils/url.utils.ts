import { AppConstants } from '../../../v1/core/constants'

const UrlUtils = {
  getDeploymentNotificationUrl: (deploymentId: string): string => {
    return `${AppConstants.BUTLER_URL}/v2/deployments/${deploymentId}/notify`
  }
}

export { UrlUtils }
