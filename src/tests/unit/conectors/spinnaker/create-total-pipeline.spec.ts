import 'jest'
import TotalPipeline from '../../../../app/core/integrations/spinnaker/connector'
import ISpinnakerContract from '../../../../app/core/integrations/spinnaker/connector/types/contract'
import expectedTotalPipeline from './fixtures/expected-total-pipeline'

it('compiles the pipeline', () => {
  const contract: ISpinnakerContract = {
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
    githubConfig: { helmPrefixUrl: 'helm-prefix', helmRepoBranch: 'master', helmTemplateUrl: 'helm-template.url' },
    circleId: 'circle-id'
  }

  const totalPipeline = new TotalPipeline(contract)
  expect(totalPipeline.buildPipeline()).toEqual(expectedTotalPipeline)
})
