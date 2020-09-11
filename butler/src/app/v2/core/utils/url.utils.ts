import { Configuration } from '../../../v1/core/config/configurations'

const UrlUtils = {
  getDeploymentNotificationUrl: (executionId: string): string => {
    return `${Configuration.butlerUrl}/v2/executions/${executionId}/notify`
  }
}

export { UrlUtils }
