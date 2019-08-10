import { IPipelineCircle, IPipelineVersion } from '../../../../api/modules/interfaces'
import { ISpinnakerPipelineUri } from './spinnaker-pipeline-uri.interface'

export interface ISpinnakerPipelineConfiguration {

  account: string,

  pipelineName: string,

  applicationName: string,

  appName: string,

  appNamespace: string,

  imgUri: string,

  webhookUri: string,

  healthCheckPath: string,

  uri: ISpinnakerPipelineUri,

  appPort: string,

  subsets: IPipelineVersion[],

  circle: IPipelineCircle[]
}
