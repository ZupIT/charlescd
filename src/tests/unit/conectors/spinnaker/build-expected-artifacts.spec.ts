import 'jest'
import buildExpectedArtifacts from '../../../../app/core/integrations/spinnaker/connector/utils/helpers/build-expected-artifacts'
import expectedArtifact from './fixtures/expected-artifacts'

it('builds the correct object', () => {
  const githubConfig = {
    helmTemplateUrl: 'helm.template.url',
    helmPrefixUrl: 'helm-prefix',
    helmRepoBranch: 'branch-name'
  }
  expect(
    buildExpectedArtifacts(githubConfig, 'github-account', 'app-name', 'template')
  ).toEqual(expectedArtifact)

})
