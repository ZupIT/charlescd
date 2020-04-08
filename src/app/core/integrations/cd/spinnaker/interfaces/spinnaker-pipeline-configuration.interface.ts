import {
  IDeploymentVersion,
  IPipelineCircle
} from '../../../../../api/components/interfaces'

export interface ISpinnakerPipelineConfiguration {

  account: string,

  pipelineName: string,

  applicationName: string,

  appName: string,

  appNamespace: string,

  webhookUri: string,

  versions: IDeploymentVersion[],

  unusedVersions: IDeploymentVersion[],

  circles: IPipelineCircle[]

  circleId: string

  githubAccount: string

  helmRepository: string

  hosts?: string[]

  url: string
}
