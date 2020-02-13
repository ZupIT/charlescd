import 'jest'
import TotalPipeline from '../../../../app/core/integrations/spinnaker/connector'
import expectedTotalPipeline from './fixtures/expected-total-pipeline'
import { ISpinnakerPipelineConfiguration } from '../../../../app/core/integrations/spinnaker/interfaces'
import expectedPipelineWithoutDeployments from './fixtures/expected-total-pipeline-without-deploy'

it('compiles the pipeline', () => {
  const contract: ISpinnakerPipelineConfiguration = {
    account: 'account',
    pipelineName: 'pipeline-name',
    applicationName: 'application-name',
    appName: 'app-name',
    appNamespace: 'app-namespace',
    healthCheckPath: '/health',
    uri: { uriName: 'uri-name' },
    appPort: 12345,
    webhookUri: 'webhook.uri',
    versions: [{ version: 'v1', versionUrl: '/v1' }],
    unusedVersions: [{ version: 'v2', versionUrl: '/v2' }],
    circles: [{ destination: { version: 'v3' } }],
    githubAccount: 'github-acc',
    helmRepository: 'helm-repository',
    circleId: 'circle-id'
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
    healthCheckPath: '/health',
    uri: { uriName: 'uri-name' },
    appPort: 12345,
    webhookUri: 'webhook.uri',
    versions: [],
    unusedVersions: [{ version: 'v2', versionUrl: '/v2' }],
    circles: [{ destination: { version: 'v3' } }],
    githubAccount: 'github-acc',
    helmRepository: 'helm-repository',
    circleId: 'circle-id'
  }
  const totalPipeline = new TotalPipeline(contract)
  const result = totalPipeline.buildPipeline()
  // TODO conferir esse resultado
  expect(result).toEqual(expectedPipelineWithoutDeployments)
})
