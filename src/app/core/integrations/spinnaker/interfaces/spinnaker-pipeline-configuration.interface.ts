import { IPipelineCircle, IPipelineVersion } from '../../../../api/components/interfaces'
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

  versions: IPipelineVersion[],

  unusedVersions: IPipelineVersion[],

  circles: IPipelineCircle[]
}
