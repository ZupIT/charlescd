import { IPipelineCircle } from './pipeline-circle.interface'
import { IPipelineVersion } from './pipeline-version.interface'

export interface IPipelineOptions {

  pipelineCircles: IPipelineCircle[]

  pipelineVersions: IPipelineVersion[]
}
