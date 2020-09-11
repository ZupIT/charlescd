import { Component } from '../../../../api/deployments/interfaces'

const UndeploymentTemplateUtils = {

  getProxyEvalStageId: (components: Component[]): number => {
    return (components.length * 2) + 1
  }
}

export { UndeploymentTemplateUtils }
