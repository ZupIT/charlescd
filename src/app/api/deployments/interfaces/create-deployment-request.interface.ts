import { DeploymentModuleRequest } from './deployment-module-request.interface'

export interface CreateDeploymentRequest {

  modules: DeploymentModuleRequest[],

  authorId: string,

  description: string,

  callbackUrl: string,

  circleHeader: string
}
