import 'jest'
import createVirtualService, { createEmptyVirtualService } from '../../../../app/core/integrations/spinnaker/connector/utils/manifests/base-virtual-service'
import { ISpinnakerPipelineConfiguration } from '../../../../app/core/integrations/spinnaker/interfaces'
import expectedBaseVirtualService from './fixtures/expected-base-virtual-service'
import expectedEmptyVirtualService from './fixtures/expected-empty-virtual-service'

it('creates the virtual service when there is no header on the circle', () => {
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
    circles: [{ destination: { version: 'v3' }, header: { headerValue: 'header-value', headerName: 'header-name' } }],
    githubAccount: 'github-acc',
    helmRepository: 'helm-repository',
    circleId: 'circle-id'
  }
  const virtualService = createVirtualService(contract)

  expect(virtualService).toEqual(expectedBaseVirtualService)
})

it('creates empty virtual service when there is no versions', () => {
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
    circles: [{ destination: { version: 'v3' }, header: { headerValue: 'header-value', headerName: 'header-name' } }],
    githubAccount: 'github-acc',
    githubConfig: { helmPrefixUrl: 'helm-prefix', helmRepoBranch: 'master', helmTemplateUrl: 'helm-template.url' },
    circleId: 'circle-id'
  }
  const virtualService = createEmptyVirtualService(contract)

  expect(virtualService).toEqual(expectedEmptyVirtualService)

})
