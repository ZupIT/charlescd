import { Component } from '../../../../api/deployments/interfaces'

const DeploymentTemplateUtils = {
  getDeploymentEvalStageId: (components: Component[]): number => {
    return (components.length * 4) + 1
  },

  getProxyEvalStageId: (components: Component[]): number => {
    return (components.length * 4) + 2
  }
}

export { DeploymentTemplateUtils }
