import { IDeploymentVersion, IPipelineCircle } from '../../../../../api/components/interfaces'
import { ISpinnakerPipelineUri } from './spinnaker-pipeline-uri.interface'

export interface ISpinnakerPipelineConfiguration {

  account: string,

  pipelineName: string,

  applicationName: string,

  appName: string,

  appNamespace: string,

  webhookUri: string,

  healthCheckPath: string,

  uri: ISpinnakerPipelineUri,

  appPort: number,

  versions: IDeploymentVersion[],

  unusedVersions: IDeploymentVersion[],

  circles: IPipelineCircle[]

  circleId: string

  githubAccount: string

  helmRepository: string

  hosts?: string[]
}
