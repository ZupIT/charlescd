import { CdConfiguration, Component, Deployment } from '../../../../api/deployments/interfaces'
import { AppConstants } from '../../../../../v1/core/constants'
import { ISpinnakerConfigurationData } from '../../../../../v1/api/configurations/interfaces'

const CommonTemplateUtils = {
  getDeploymentName: (component: Component, circleId: string | null): string => {
    return `${component.name}-${component.imageTag}-${CommonTemplateUtils.getCircleId(circleId)}`
  },

  getCircleId: (circleId: string | null): string => {
    return circleId ? circleId : AppConstants.DEFAULT_CIRCLE_ID
  },
  getNamespace(component: Component, configuration: CdConfiguration) {
    return component.namespace || (configuration.configurationData as ISpinnakerConfigurationData).namespace
  }
}

export { CommonTemplateUtils }
