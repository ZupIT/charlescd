import 'jest'
import baseStageHelm from '../../../../app/core/integrations/cd/spinnaker/connector/utils/base-stage-helm'
import expectedBaseStageHelm from './fixtures/expected-base-stage-helm'
import expectedBaseHelmPreviousStages from './fixtures/expected-base-helm-previous-stages'

it('builds the helm stage without previous stage', () => {
  expect(
    baseStageHelm({ appNamespace: 'app-namespace', appName: 'app-name' },
      'github-config', 'version', 'version.url', 'ref-if', ['req-ref-id'], undefined)
  ).toEqual(expectedBaseStageHelm)
})

it('builds the helm stage with previous stage', () => {
  expect(
    baseStageHelm({ appNamespace: 'app-namespace', appName: 'app-name' },
      'github-config', 'version', 'version.url', 'ref-if', ['req-ref-id'], 'Previous stage')
  ).toEqual(expectedBaseHelmPreviousStages)
})
