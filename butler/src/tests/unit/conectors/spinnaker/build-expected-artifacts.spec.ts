import 'jest'
import buildExpectedArtifacts from '../../../../app/core/integrations/cd/spinnaker/connector/utils/helpers/build-expected-artifacts'
import expectedArtifactTemplate from './fixtures/expected-artifacts-template'
import expectedArtifactValue from './fixtures/expected-artifacts-value'

it('builds the correct template object', () => {

  expect(
    buildExpectedArtifacts('https://api.github.com/repos/org/repo/contents/' , 'github-account', 'app-name', 'template')
  ).toEqual(expectedArtifactTemplate)

})

it('builds the correct values object', () => {

  expect(
    buildExpectedArtifacts('https://api.github.com/repos/org/repo/contents/' , 'github-account', 'app-name', 'value')
  ).toEqual(expectedArtifactValue)

})
