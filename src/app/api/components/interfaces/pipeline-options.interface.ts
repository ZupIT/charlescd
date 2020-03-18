import { IPipelineCircle } from './pipeline-circle.interface'
import { IDeploymentVersion } from './pipeline-version.interface'

export interface IPipelineOptions {

  pipelineCircles: IPipelineCircle[]

  pipelineVersions: IDeploymentVersion[]

  pipelineUnusedVersions: IDeploymentVersion[]

}
