import { ISpinnakerGithubConfig } from '../../interfaces/spinnaker-pipeline-github-account.interface'
import buildExpectedArtifacts from './helpers/build-expected-artifacts'
import helmValues, { HelmTypes } from './helpers/constants'
import { IBaseSpinnakerPipeline } from '../interfaces'

interface AppConfig {
  appName: string
  pipelineName: string
  applicationName: string
}

const baseSpinnaker = (
  { appName, pipelineName, applicationName }: AppConfig,
  helmRepository: string, githubAccount: string): IBaseSpinnakerPipeline => ({
    appConfig: {},
    application: applicationName,
    name: pipelineName,
    expectedArtifacts: helmValues.map(helmType => buildExpectedArtifacts(helmRepository, githubAccount, appName, helmType as HelmTypes)),
    keepWaitingPipelines: false,
    lastModifiedBy: 'anonymous',
    limitConcurrent: true,
    stages: [],
    triggers: [
      {
        enabled: true,
        payloadConstraints: {},
        source: pipelineName,
        type: 'webhook'
      }
    ],
    updateTs: '1573212638000'
  })

export default baseSpinnaker
