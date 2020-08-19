import { Configuration } from '../../../v1/core/config/configurations'

const UrlUtils = {
  getDeploymentNotificationUrl: (deploymentId: string): string => {
    return `${Configuration.butlerUrl}/v2/deployments/${deploymentId}/notify`
  }
}

export { UrlUtils }
