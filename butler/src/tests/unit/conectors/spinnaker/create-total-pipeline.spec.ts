import 'jest'
import TotalPipeline from '../../../../app/core/integrations/cd/spinnaker/connector'
import expectedTotalPipeline from './fixtures/expected-total-pipeline'
import { ISpinnakerPipelineConfiguration } from '../../../../app/core/integrations/cd/spinnaker/interfaces'
import expectedPipelineWithoutDeployments from './fixtures/expected-total-pipeline-without-deploy'

it('compiles the pipeline', () => {
  const contract: ISpinnakerPipelineConfiguration = {
    account: 'account',
    pipelineName: 'pipeline-name',
    applicationName: 'application-name',
    appName: 'app-name',
    appNamespace: 'app-namespace',
    webhookUri: 'webhook.uri',
    versions: [{ version: 'v1', versionUrl: '/v1' }],
    unusedVersions: [{ version: 'v2', versionUrl: '/v2' }],
    circles: [{ destination: { version: 'v3' } }],
    githubAccount: 'github-acc',
    helmRepository: 'https://api.github.com/repos/org/repo/contents/',
    circleId: 'circle-id',
    url: 'http://spinnaker.url.com'
  }

  const totalPipeline = new TotalPipeline(contract)
  expect(totalPipeline.buildPipeline()).toEqual(expectedTotalPipeline)
})

it('compiles the pipeline with only undeployment', () => {
  const contract: ISpinnakerPipelineConfiguration = {
    account: 'account',
    pipelineName: 'pipeline-name',
    applicationName: 'application-name',
    appName: 'app-name',
    appNamespace: 'app-namespace',
    webhookUri: 'webhook.uri',
    versions: [],
    unusedVersions: [{ version: 'v2', versionUrl: '/v2' }],
    circles: [{ destination: { version: 'v3' } }],
    githubAccount: 'github-acc',
    helmRepository: 'https://api.github.com/repos/org/repo/contents/',
    circleId: 'circle-id',
    url: 'http://spinnaker.url.com'
  }
  const totalPipeline = new TotalPipeline(contract)
  const result = totalPipeline.buildPipeline()

  expect(result).toEqual(expectedPipelineWithoutDeployments)
})
