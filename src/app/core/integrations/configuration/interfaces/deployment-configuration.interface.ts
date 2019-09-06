import { ISpinnakerPipelineUri } from '../../spinnaker/interfaces/spinnaker-pipeline-uri.interface'

export interface IDeploymentConfiguration {

  account: string,

  pipelineName: string,

  applicationName: string,

  appName: string,

  appNamespace: string,

  healthCheckPath: string,

  uri: ISpinnakerPipelineUri,

  appPort: number,
}
