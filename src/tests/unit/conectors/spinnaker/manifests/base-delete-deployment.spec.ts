import 'jest'
import baseDeleteDeployments from '../../../../../app/core/integrations/spinnaker/connector/utils/manifests/base-delete-deployment'
import expectedBaseDeleteDeployment from '../fixtures/manifests/expected-base-delete-deployment'
it('builds base deployment delete manifest', () => {

  expect(
    baseDeleteDeployments(
      {
        account: 'account', appName: 'app-namespace', unusedVersions: [{version: 'unused-version', versionUrl: 'version-url'}],
        applicationName: 'app-name', appNamespace: 'app-namespace', appPort: 123,
        circleId: 'circle-id', circles: [], githubAccount: 'github-account',
        helmRepository: 'https://api.github.com/repos/org/repo/contents/', healthCheckPath: 'hs-path',
        pipelineName: 'pipeline-name', uri: {uriName: 'uri.com'}, versions: [], webhookUri: 'webhook-uri'
      },
      123, ['req-ref-id'], 'prev-stage')
  ).toEqual(expectedBaseDeleteDeployment)
})
