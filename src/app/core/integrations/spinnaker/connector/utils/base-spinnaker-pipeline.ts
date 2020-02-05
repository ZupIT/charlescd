import helmValues, { HelmTypes } from './helpers/constants'
import buildExpectedArtifacts from './helpers/build-expected-artifacts'

const baseSpinnaker = ({ appName, pipelineName, applicationName }, githubConfig, githubAccount) => ({
  appConfig: {},
  application: applicationName,
  name: pipelineName,
  expectedArtifacts: helmValues.map(helmType => buildExpectedArtifacts(githubConfig, githubAccount, appName, helmType as HelmTypes)),
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
