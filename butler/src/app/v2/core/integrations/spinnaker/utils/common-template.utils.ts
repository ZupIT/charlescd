import { Component } from '../../../../api/deployments/interfaces'
import { AppConstants } from '../../../../../v1/core/constants'

const CommonTemplateUtils = {
  getDeploymentName: (component: Component, circleId: string | null): string => {
    return `${component.name}-${CommonTemplateUtils.getCircleId(circleId)}`
  },

  getCircleId: (circleId: string | null): string => {
    return circleId ? circleId : AppConstants.DEFAULT_CIRCLE_ID
  }
}

export { CommonTemplateUtils }
