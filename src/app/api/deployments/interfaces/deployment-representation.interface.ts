import { DeploymentModuleRequest } from './deployment-module-request.interface'

export interface DeploymentRepresentation {

  modules: DeploymentModuleRequest[],

  authorId: string,

  description: string,

  circleId: string
}
